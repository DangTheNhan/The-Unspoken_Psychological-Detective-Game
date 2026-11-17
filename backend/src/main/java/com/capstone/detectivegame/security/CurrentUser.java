package com.capstone.detectivegame.security;

import com.capstone.detectivegame.common.ApiException;
import com.capstone.detectivegame.user.User;
import com.capstone.detectivegame.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.capstone.detectivegame.auth.AccountStore;

@Service
public class CurrentUser {
    private final UserRepository users;
    private final AccountStore store;
    public CurrentUser(UserRepository users, AccountStore store) { this.users=users;this.store=store; }
    public User require() {
        var auth=SecurityContextHolder.getContext().getAuthentication();
        if(auth==null || !auth.isAuthenticated()) throw ApiException.unauthorized("Cần đăng nhập lại.");
        return users.findByUsername(auth.getName()).orElseThrow(()->ApiException.unauthorized("Tài khoản không còn tồn tại."));
    }
    public User own(Long suppliedId) {
        User user=require();
        if(suppliedId!=null && !user.getId().equals(suppliedId)) throw new ApiException(HttpStatus.FORBIDDEN,"Không được truy cập dữ liệu của tài khoản khác.");
        return user;
    }
    /** Called inside a write transaction; serializes save/report with a new login or password reset. */
    public User ownForWrite(Long suppliedId) {
        var auth=SecurityContextHolder.getContext().getAuthentication();
        if(auth==null) throw ApiException.unauthorized("Cần đăng nhập lại.");
        var user=users.lockByUsername(auth.getName()).orElseThrow(()->ApiException.unauthorized("Cần đăng nhập lại."));
        if(!(auth.getDetails() instanceof String sid) || !store.valid(user.getUsername(),sid)) throw ApiException.unauthorized("Phiên đăng nhập đã kết thúc.");
        if(suppliedId!=null && !user.getId().equals(suppliedId)) throw new ApiException(HttpStatus.FORBIDDEN,"Không được truy cập dữ liệu của tài khoản khác.");
        return user;
    }
}
