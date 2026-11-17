package com.capstone.detectivegame.auth;

import static org.junit.jupiter.api.Assertions.*;
import com.capstone.detectivegame.common.ApiException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.*;

class GoogleTokenVerifierTest {
    static KeyPair key,other;
    final String nonce="n".repeat(43);
    final GoogleTokenVerifier verifier=new GoogleTokenVerifier(new ObjectMapper(),new AccountProperties("test-web-client","http://localhost:5173","",30));
    @BeforeAll static void keys() throws Exception { var generator=KeyPairGenerator.getInstance("RSA");generator.initialize(2048);key=generator.generateKeyPair();other=generator.generateKeyPair(); }
    String token(Map<String,Object> overrides,KeyPair signing,Instant expiry) {
        Map<String,Object> claims=new HashMap<>(Map.of("iss","https://accounts.google.com","aud","test-web-client","sub","opaque-google-subject","email","player@example.test","email_verified",true,"nonce",nonce));
        claims.putAll(overrides);
        return Jwts.builder().header().keyId("test-key").and().claims(claims).expiration(Date.from(expiry)).signWith(signing.getPrivate(),Jwts.SIG.RS256).compact();
    }
    @Test void acceptsCorrectSignatureAudienceIssuerAndNonce() {
        var claims=verifier.verifyWithKeys(token(Map.of(),key,Instant.now().plusSeconds(120)),nonce,Map.of("test-key",key.getPublic()),"test-web-client");
        assertEquals("opaque-google-subject",claims.getSubject());
    }
    @Test void rejectsChangedSignature() { assertThrows(ApiException.class,()->verifier.verifyWithKeys(token(Map.of(),other,Instant.now().plusSeconds(120)),nonce,Map.of("test-key",key.getPublic()),"test-web-client")); }
    @Test void rejectsAudienceIssuerVerificationAndReplayNonce() {
        for(var override:List.of(Map.<String,Object>of("aud","other-client"),Map.<String,Object>of("iss","https://attacker.invalid"),Map.<String,Object>of("email_verified",false),Map.<String,Object>of("nonce","an-old-request"),Map.<String,Object>of("azp","other-client")))
            assertThrows(ApiException.class,()->verifier.verifyWithKeys(token(override,key,Instant.now().plusSeconds(120)),nonce,Map.of("test-key",key.getPublic()),"test-web-client"));
    }
    @Test void rejectsExpiredOrUnsignedToken() {
        assertThrows(ApiException.class,()->verifier.verifyWithKeys(token(Map.of(),key,Instant.now().minusSeconds(2)),nonce,Map.of("test-key",key.getPublic()),"test-web-client"));
        assertThrows(ApiException.class,()->verifier.verifyWithKeys("eyJhbGciOiJub25lIn0.e30.",nonce,Map.of("test-key",key.getPublic()),"test-web-client"));
    }
    @Test void unavailableConfigurationNeverAcceptsAClaim() {
        var disabled=new GoogleTokenVerifier(new ObjectMapper(),new AccountProperties("","http://localhost:5173","",30));
        assertEquals(503,assertThrows(ApiException.class,()->disabled.verify("anything",nonce)).getStatus().value());
    }
}
