package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.auth.dto.JwtResponse;
import com.capstone.detectivegame.common.MaintenanceService;
import com.capstone.detectivegame.common.MessageResponse;
import com.capstone.detectivegame.security.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AccountController {
    private final PasswordResetService reset;private final GoogleLoginService google;private final AccountProperties config;
    private final SessionService sessions;private final CurrentUser current;private final MaintenanceService maintenance;private final RequestThrottle throttle;
    public AccountController(PasswordResetService reset,GoogleLoginService google,AccountProperties config,SessionService sessions,CurrentUser current,MaintenanceService maintenance,RequestThrottle throttle) {
        this.reset=reset;this.google=google;this.config=config;this.sessions=sessions;this.current=current;this.maintenance=maintenance;this.throttle=throttle;
    }
    @GetMapping("/config") public Map<String,Object> config() { return Map.of("passwordResetEnabled",reset.enabled(),"googleClientId",config.googleEnabled()?config.googleClientId():""); }
    public record Forgot(String email) {} public record Reset(String token,String password) {}
    public record Google(String credential,String nonce,String localPassword) {} public record Heartbeat(String area) {}
    @PostMapping("/forgot-password") @ResponseStatus(HttpStatus.ACCEPTED)
    public MessageResponse forgot(@RequestBody Forgot input,HttpServletRequest request) {
        throttle.check("reset:"+request.getRemoteAddr(),10);reset.request(input.email());
        return new MessageResponse("Nếu email thuộc một tài khoản, hướng dẫn khôi phục sẽ được gửi tới email đó.");
    }
    @PostMapping("/reset-password") public MessageResponse reset(@RequestBody Reset input,HttpServletRequest request) {
        throttle.check("set-password:"+request.getRemoteAddr(),20);reset.reset(input.token(),input.password());return new MessageResponse("Đã đổi mật khẩu. Hãy đăng nhập lại.");
    }
    @PostMapping("/google/challenge") public Map<String,Object> challenge(HttpServletRequest request) { throttle.check("google-nonce:"+request.getRemoteAddr(),20);return google.challenge(); }
    @PostMapping("/google") public JwtResponse google(@RequestBody Google input,HttpServletRequest request) {
        throttle.check("google-login:"+request.getRemoteAddr(),20);return google.login(input.credential(),input.nonce(),input.localPassword());
    }
    @PostMapping("/session") public Map<String,Object> session(@RequestBody(required=false) Heartbeat input,Authentication auth) {
        var user=current.require();sessions.heartbeat(auth.getName(),(String)auth.getDetails(),input==null?"WEB":input.area());
        return Map.of("userId",user.getId(),"username",user.getUsername(),"role",user.getRole(),"maintenance",maintenance.status());
    }
    @PostMapping("/logout") public MessageResponse logout(Authentication auth) { sessions.logout(auth.getName(),(String)auth.getDetails());return new MessageResponse("Đã đăng xuất."); }
}
