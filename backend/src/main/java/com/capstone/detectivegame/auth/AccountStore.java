package com.capstone.detectivegame.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** Supplemental DEC-027 tables. Uses Spring's transaction-bound JDBC connection. */
@Repository
public class AccountStore {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final JdbcTemplate db;
    public AccountStore(JdbcTemplate db) { this.db = db; }
    public JdbcTemplate db() { return db; }
    public static String randomToken() {
        byte[] bytes = new byte[32]; RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    public static String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (java.security.NoSuchAlgorithmException impossible) { throw new IllegalStateException(impossible); }
    }
    public void issue(long userId, String sid, Instant expires) {
        Instant now = Instant.now();
        int changed = db.update("UPDATE auth_sessions SET session_hash=?,issued_at=?,expires_at=?,last_seen_at=?,area='WEB',revoked=FALSE WHERE user_id=?",
                hash(sid), Timestamp.from(now), Timestamp.from(expires), Timestamp.from(now), userId);
        if (changed == 0) db.update("INSERT INTO auth_sessions(user_id,session_hash,issued_at,expires_at,last_seen_at) VALUES (?,?,?,?,?)",
                userId, hash(sid), Timestamp.from(now), Timestamp.from(expires), Timestamp.from(now));
    }
    public boolean valid(String username, String sid) {
        if (sid == null || sid.isBlank()) return false;
        return Boolean.TRUE.equals(db.queryForObject("SELECT EXISTS(SELECT 1 FROM auth_sessions s JOIN users u ON u.id=s.user_id WHERE u.username=? AND s.session_hash=? AND s.revoked=FALSE AND s.expires_at>?)",
                Boolean.class, username, hash(sid), Timestamp.from(Instant.now())));
    }
    public void heartbeat(String username, String sid, String area) {
        db.update("UPDATE auth_sessions s JOIN users u ON u.id=s.user_id SET s.last_seen_at=?,s.area=? WHERE u.username=? AND s.session_hash=? AND s.revoked=FALSE",
                Timestamp.from(Instant.now()), area, username, hash(sid));
    }
    public void revoke(String username, String sid) {
        db.update("UPDATE auth_sessions s JOIN users u ON u.id=s.user_id SET s.revoked=TRUE WHERE u.username=? AND s.session_hash=?", username, hash(sid));
    }
    public void revokeAll(long userId) { db.update("UPDATE auth_sessions SET revoked=TRUE WHERE user_id=?", userId); }
    public List<Map<String,Object>> online() {
        return db.query("SELECT u.id,u.username,s.last_seen_at,s.area FROM auth_sessions s JOIN users u ON u.id=s.user_id WHERE u.role='ROLE_PLAYER' AND s.revoked=FALSE AND s.expires_at>? AND s.last_seen_at>? ORDER BY u.username",
                (rs,n) -> Map.of("userId", rs.getLong("id"), "username",rs.getString("username"), "lastSeenAt",rs.getTimestamp("last_seen_at").toInstant(), "area",rs.getString("area")),
                Timestamp.from(Instant.now()), Timestamp.from(Instant.now().minusSeconds(60)));
    }
    public record Reset(long userId, Instant expiresAt, Instant usedAt) {}
    public Optional<Reset> reset(String hash) {
        return db.query("SELECT user_id,expires_at,used_at FROM password_reset_tokens WHERE token_hash=?", (rs,n) -> new Reset(rs.getLong(1),rs.getTimestamp(2).toInstant(),rs.getTimestamp(3)==null?null:rs.getTimestamp(3).toInstant()), hash).stream().findFirst();
    }
}
