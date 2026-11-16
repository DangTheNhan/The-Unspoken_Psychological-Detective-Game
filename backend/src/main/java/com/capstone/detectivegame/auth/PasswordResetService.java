package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.common.ApiException;
import com.capstone.detectivegame.user.UserRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Locale;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {
    private final AccountStore store; private final UserRepository users; private final PasswordEncoder encoder;
    private final AccountProperties config; private final ObjectProvider<JavaMailSender> sender; private final String mailHost;
    public PasswordResetService(AccountStore store,UserRepository users,PasswordEncoder encoder,AccountProperties config,ObjectProvider<JavaMailSender> sender,@Value("${spring.mail.host:}") String mailHost) {
        this.store=store;this.users=users;this.encoder=encoder;this.config=config;this.sender=sender;this.mailHost=mailHost;
    }
    public boolean enabled() { return !mailHost.isBlank() && config.mailFrom()!=null && !config.mailFrom().isBlank() && sender.getIfAvailable()!=null; }
    @Transactional
    public void request(String email) {
        if(!enabled()) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"Gửi email khôi phục chưa được cấu hình trên máy chủ.");
        if(email==null || email.length()>100 || !email.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")) throw ApiException.badRequest("Email không hợp lệ.");
        var found=users.findByEmailIgnoreCase(email.trim().toLowerCase(Locale.ROOT));
        if(found.isEmpty()) return; // Same HTTP response for unknown email and cooldown.
        var user=users.lockById(found.get().getId()).orElseThrow();
        Instant now=Instant.now();
        var recent=store.db().queryForList("SELECT token_hash FROM password_reset_tokens WHERE user_id=? AND created_at>? LIMIT 1 FOR UPDATE",String.class,user.getId(),Timestamp.from(now.minusSeconds(60)));
        if(!recent.isEmpty()) return;
        store.db().update("DELETE FROM password_reset_tokens WHERE expires_at<?",Timestamp.from(now));
        store.db().update("UPDATE password_reset_tokens SET used_at=? WHERE user_id=? AND used_at IS NULL",Timestamp.from(now),user.getId());
        String token=AccountStore.randomToken();
        store.db().update("INSERT INTO password_reset_tokens(token_hash,user_id,created_at,expires_at) VALUES (?,?,?,?)",AccountStore.hash(token),user.getId(),Timestamp.from(now),Timestamp.from(now.plusSeconds(config.tokenMinutes()*60L)));
        SimpleMailMessage mail=new SimpleMailMessage();
        mail.setFrom(config.mailFrom());mail.setTo(user.getEmail());mail.setSubject("The Unspoken — Đặt lại mật khẩu");
        mail.setText("Bạn đã yêu cầu đặt lại mật khẩu The Unspoken.\n\n"+config.frontendUrl().replaceAll("/+$","")+"/reset-password#token="+token+"\n\nLiên kết dùng một lần, hết hạn sau "+config.tokenMinutes()+" phút. Nếu không phải bạn yêu cầu, hãy bỏ qua thư này.");
        try { sender.getObject().send(mail); }
        catch(org.springframework.mail.MailException unavailable) { throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"Chưa gửi được email. Hãy thử lại sau."); }
    }
    @Transactional
    public void reset(String token,String password) {
        if(token==null || !token.matches("[A-Za-z0-9_-]{43}")) throw ApiException.badRequest("Liên kết không hợp lệ hoặc đã hết hạn.");
        if(password==null || password.length()<8 || password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72 || password.isBlank()) throw ApiException.badRequest("Mật khẩu mới cần ít nhất 8 ký tự và tối đa 72 byte UTF-8.");
        String hash=AccountStore.hash(token);
        var candidate=store.reset(hash).orElseThrow(()->ApiException.badRequest("Liên kết không hợp lệ hoặc đã hết hạn."));
        var user=users.lockById(candidate.userId()).orElseThrow();
        var current=store.reset(hash).orElseThrow();
        Instant now=Instant.now();
        if(current.usedAt()!=null || !current.expiresAt().isAfter(now)) throw ApiException.badRequest("Liên kết không hợp lệ hoặc đã hết hạn.");
        int changed=store.db().update("UPDATE password_reset_tokens SET used_at=? WHERE token_hash=? AND used_at IS NULL AND expires_at>?",Timestamp.from(now),hash,Timestamp.from(now));
        if(changed!=1) throw ApiException.badRequest("Liên kết không hợp lệ hoặc đã hết hạn.");
        user.changePassword(encoder.encode(password)); users.saveAndFlush(user);
        store.revokeAll(user.getId());
        store.db().update("UPDATE password_reset_tokens SET used_at=? WHERE user_id=? AND used_at IS NULL",Timestamp.from(now),user.getId());
    }
}
