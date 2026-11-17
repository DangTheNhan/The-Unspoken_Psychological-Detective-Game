package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.common.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.math.BigInteger;
import java.net.http.HttpClient;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** GIS ID tokens are verified locally against Google's cached public keys, never decoded as proof. */
@Component
public class GoogleTokenVerifier {
    private final ObjectMapper mapper; private final AccountProperties config; private final RestClient client;
    private volatile Map<String,PublicKey> keys=Map.of();
    private Instant freshUntil=Instant.EPOCH, fetchedAt=Instant.EPOCH;
    public GoogleTokenVerifier(ObjectMapper mapper,AccountProperties config) {
        this.mapper=mapper;this.config=config;
        var factory=new JdkClientHttpRequestFactory(HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build());
        factory.setReadTimeout(Duration.ofSeconds(5));
        client=RestClient.builder().requestFactory(factory).build();
    }
    public Claims verify(String credential,String nonce) {
        if(!config.googleEnabled()) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"Đăng nhập Google chưa được cấu hình.");
        String kid=header(credential);
        refresh(kid);
        return verifyWithKeys(credential,nonce,keys,config.googleClientId());
    }
    private String header(String credential) {
        try {
            if(credential==null || credential.length()>20000) throw new IllegalArgumentException();
            String[] parts=credential.split("\\."); if(parts.length!=3) throw new IllegalArgumentException();
            JsonNode head=mapper.readTree(Base64.getUrlDecoder().decode(parts[0]));
            if(!"RS256".equals(head.path("alg").asText()) || head.path("kid").asText().length()>256) throw new IllegalArgumentException();
            return head.path("kid").asText();
        } catch(Exception bad) { throw ApiException.unauthorized("Không xác minh được thông tin Google."); }
    }
    private synchronized void refresh(String kid) {
        Instant now=Instant.now();
        if(now.isBefore(freshUntil) && (keys.containsKey(kid) || now.isBefore(fetchedAt.plusSeconds(60)))) return;
        try {
            var response=client.get().uri("https://www.googleapis.com/oauth2/v3/certs").retrieve().toEntity(JsonNode.class);
            Map<String,PublicKey> next=new HashMap<>();
            for(JsonNode key:response.getBody().path("keys")) {
                if(!"RSA".equals(key.path("kty").asText()) || !"RS256".equals(key.path("alg").asText()) || !"sig".equals(key.path("use").asText())) continue;
                var spec=new RSAPublicKeySpec(new BigInteger(1,Base64.getUrlDecoder().decode(key.path("n").asText())),new BigInteger(1,Base64.getUrlDecoder().decode(key.path("e").asText())));
                next.put(key.path("kid").asText(),KeyFactory.getInstance("RSA").generatePublic(spec));
            }
            if(next.isEmpty()) throw new IllegalStateException();
            long seconds=1800;
            String cache=response.getHeaders().getCacheControl();
            if(cache!=null) { var match=java.util.regex.Pattern.compile("max-age=(\\d+)").matcher(cache); if(match.find()) seconds=Math.min(86400,Long.parseLong(match.group(1))); }
            keys=Map.copyOf(next);fetchedAt=now;freshUntil=now.plusSeconds(seconds);
        } catch(Exception unavailable) { throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"Chưa kết nối được dịch vụ xác minh Google. Hãy thử lại sau."); }
    }
    Claims verifyWithKeys(String credential,String nonce,Map<String,PublicKey> available,String audience) {
        try {
            String kid=header(credential);
            PublicKey key=available.get(kid); if(!(key instanceof RSAPublicKey rsa)) throw new IllegalArgumentException();
            var parsed=Jwts.parser().verifyWith(rsa).build().parseSignedClaims(credential);
            Claims claims=parsed.getPayload();
            if(!java.util.Set.of("accounts.google.com","https://accounts.google.com").contains(claims.getIssuer())
                || claims.getAudience()==null || !claims.getAudience().contains(audience)
                || (claims.getAudience().size()>1 && claims.get("azp")==null)
                || (claims.get("azp")!=null && !audience.equals(claims.get("azp",String.class)))
                || claims.getExpiration()==null || claims.getSubject()==null || !claims.getSubject().matches("[\\x21-\\x7E]{1,255}")
                || !Boolean.TRUE.equals(claims.get("email_verified",Boolean.class))
                || nonce==null || !nonce.equals(claims.get("nonce",String.class))) throw new IllegalArgumentException();
            String email=claims.get("email",String.class);
            if(email==null || email.length()>100 || !email.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")) throw new IllegalArgumentException();
            return claims;
        } catch(Exception bad) { throw ApiException.unauthorized("Không xác minh được thông tin Google."); }
    }
}
