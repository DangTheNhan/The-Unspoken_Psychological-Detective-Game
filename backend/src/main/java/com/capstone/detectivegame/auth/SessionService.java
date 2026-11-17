package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.auth.dto.JwtResponse;
import com.capstone.detectivegame.security.JwtTokenProvider;
import com.capstone.detectivegame.user.User;
import com.capstone.detectivegame.user.UserRepository;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {
    private final AccountStore store;
    private final UserRepository users;
    private final JwtTokenProvider tokens;
    public SessionService(AccountStore store, UserRepository users, JwtTokenProvider tokens) {
        this.store=store; this.users=users; this.tokens=tokens;
    }
    @Transactional
    public JwtResponse issue(User user) {
        users.lockById(user.getId()).orElseThrow();
        String sid=AccountStore.randomToken();
        store.issue(user.getId(),sid,Instant.now().plusMillis(tokens.expirationMs()));
        return new JwtResponse(tokens.generateToken(user.getUsername(),user.getRole(),sid),"Bearer",user.getUsername(),user.getRole(),user.getId());
    }
    public boolean valid(String username,String sid) { return store.valid(username,sid); }
    public void heartbeat(String username,String sid,String area) { store.heartbeat(username,sid,"PLAY".equals(area)?"PLAY":"WEB"); }
    public void logout(String username,String sid) { store.revoke(username,sid); }
}
