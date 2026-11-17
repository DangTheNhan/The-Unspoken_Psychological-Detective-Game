package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.auth.dto.JwtResponse;
import com.capstone.detectivegame.common.ApiException;
import com.capstone.detectivegame.user.User;
import com.capstone.detectivegame.user.UserRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GoogleLoginService {
    private final AccountStore store;private final UserRepository users;private final PasswordEncoder encoder;
    private final GoogleTokenVerifier verifier;private final SessionService sessions;private final AccountProperties config;
    public GoogleLoginService(AccountStore store,UserRepository users,PasswordEncoder encoder,GoogleTokenVerifier verifier,SessionService sessions,AccountProperties config) {
        this.store=store;this.users=users;this.encoder=encoder;this.verifier=verifier;this.sessions=sessions;this.config=config;
    }
    public Map<String,Object> challenge() {
        if(!config.googleEnabled()) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"Đăng nhập Google chưa được cấu hình.");
        Instant now=Instant.now();String nonce=AccountStore.randomToken();
        store.db().update("DELETE FROM google_challenges WHERE expires_at<?",Timestamp.from(now));
        store.db().update("INSERT INTO google_challenges(nonce_hash,expires_at) VALUES (?,?)",AccountStore.hash(nonce),Timestamp.from(now.plusSeconds(300)));
        return Map.of("nonce",nonce,"expiresAt",now.plusSeconds(300));
    }
    @Transactional
    public JwtResponse login(String credential,String nonce,String localPassword) {
        if(nonce==null || !nonce.matches("[A-Za-z0-9_-]{43}")) throw ApiException.unauthorized("Yêu cầu Google không hợp lệ.");
        var claims=verifier.verify(credential,nonce);
        String hash=AccountStore.hash(nonce);
        var valid=store.db().queryForList("SELECT nonce_hash FROM google_challenges WHERE nonce_hash=? AND used_at IS NULL AND expires_at>? FOR UPDATE",String.class,hash,Timestamp.from(Instant.now()));
        if(valid.isEmpty()) throw ApiException.unauthorized("Yêu cầu Google đã dùng hoặc hết hạn. Hãy mở lại nút Google.");
        var ids=store.db().queryForList("SELECT user_id FROM google_identities WHERE google_sub=?",Long.class,claims.getSubject());
        User user;
        if(!ids.isEmpty()) user=users.lockById(ids.get(0)).orElseThrow();
        else {
            String email=claims.get("email",String.class).toLowerCase(Locale.ROOT);
            var existing=users.findByEmailIgnoreCase(email);
            if(existing.isPresent()) {
                user=users.lockById(existing.get().getId()).orElseThrow();
                if(User.ROLE_ADMIN.equals(user.getRole())) throw new ApiException(HttpStatus.FORBIDDEN,"Tài khoản quản trị dùng đăng nhập bằng mật khẩu.");
                if(localPassword==null || localPassword.isEmpty()) throw ApiException.conflict("Email này đã có tài khoản. Nhập mật khẩu hiện tại để liên kết Google.");
                if(localPassword.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72 || !encoder.matches(localPassword,user.getPasswordHash())) throw ApiException.unauthorized("Mật khẩu liên kết không đúng.");
                Integer linked=store.db().queryForObject("SELECT COUNT(*) FROM google_identities WHERE user_id=?",Integer.class,user.getId());
                if(linked!=null && linked>0) throw ApiException.conflict("Tài khoản đã liên kết với một tài khoản Google khác.");
            } else {
                user=users.saveAndFlush(new User("google_"+AccountStore.randomToken().substring(0,18),email,encoder.encode(AccountStore.randomToken())));
            }
            store.db().update("INSERT INTO google_identities(google_sub,user_id) VALUES (?,?)",claims.getSubject(),user.getId());
        }
        if(User.ROLE_ADMIN.equals(user.getRole())) throw new ApiException(HttpStatus.FORBIDDEN,"Tài khoản quản trị dùng đăng nhập bằng mật khẩu.");
        store.db().update("UPDATE google_challenges SET used_at=? WHERE nonce_hash=?",Timestamp.from(Instant.now()),hash);
        return sessions.issue(user);
    }
}
