package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.auth.dto.JwtResponse;
import com.capstone.detectivegame.auth.dto.LoginRequest;
import com.capstone.detectivegame.auth.dto.RegisterRequest;
import com.capstone.detectivegame.common.ApiException;
import com.capstone.detectivegame.security.JwtTokenProvider;
import com.capstone.detectivegame.user.User;
import com.capstone.detectivegame.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Đăng ký / đăng nhập (Project.docx §4.3).
 * Giới hạn độ dài lấy từ schema users (§2.1): username VARCHAR(50), email VARCHAR(100).
 * PENDING(ISS-13): mã lỗi (409 trùng, 401 sai mật khẩu, 400 thiếu trường) là đề xuất tạm.
 */
@Service
public class AuthService {

    private static final int USERNAME_MAX = 50;
    private static final int EMAIL_MAX = 100;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessions;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, SessionService sessions) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessions = sessions;
    }

    @Transactional
    public void register(RegisterRequest request) {
        String username = requireText(request.username(), "username", USERNAME_MAX);
        String email = requireText(request.email(), "email", EMAIL_MAX);
        String password = requirePassword(request.password());

        if (userRepository.existsByUsername(username)) {
            throw ApiException.conflict("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.existsByEmail(email)) {
            throw ApiException.conflict("Email đã được sử dụng");
        }
        userRepository.save(new User(username, email, passwordEncoder.encode(password)));
    }

    @Transactional
    public JwtResponse login(LoginRequest request) {
        String username = requireText(request.username(), "username", USERNAME_MAX);
        String password = requirePassword(request.password());

        User user = userRepository.lockByUsername(username)
                .filter(found -> passwordEncoder.matches(password, found.getPasswordHash()))
                .orElseThrow(() -> ApiException.unauthorized("Sai tên đăng nhập hoặc mật khẩu"));

        return sessions.issue(user);
    }

    private static String requireText(String value, String field, int maxLength) {
        if (value == null || value.isBlank()) {
            throw ApiException.badRequest("Thiếu trường bắt buộc: " + field);
        }
        String trimmed = value.trim();
        if (trimmed.length() > maxLength) {
            throw ApiException.badRequest(field + " vượt quá " + maxLength + " ký tự");
        }
        return trimmed;
    }

    private static String requirePassword(String value) {
        if(value==null || value.isBlank() || value.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72) throw ApiException.badRequest("Mật khẩu không hợp lệ hoặc vượt 72 byte UTF-8.");
        return value;
    }
}
