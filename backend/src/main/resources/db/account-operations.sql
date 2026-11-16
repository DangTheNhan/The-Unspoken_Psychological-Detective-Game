-- DEC-027 / T-062. Additive migration; original schema.sql is unchanged.
CREATE TABLE IF NOT EXISTS auth_sessions (
    user_id BIGINT PRIMARY KEY,
    session_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    issued_at TIMESTAMP(6) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    last_seen_at TIMESTAMP(6) NOT NULL,
    area VARCHAR(8) NOT NULL DEFAULT 'WEB',
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_auth_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_presence (revoked, last_seen_at)
);
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    used_at TIMESTAMP(6) NULL,
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reset_user (user_id, created_at)
);
CREATE TABLE IF NOT EXISTS google_identities (
    google_sub VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_google_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS google_challenges (
    nonce_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    expires_at TIMESTAMP(6) NOT NULL,
    used_at TIMESTAMP(6) NULL
);
CREATE TABLE IF NOT EXISTS system_maintenance (
    id INT PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    starts_at TIMESTAMP(6) NULL,
    message VARCHAR(1000) NOT NULL DEFAULT '',
    revision BIGINT NOT NULL DEFAULT 0
);
INSERT IGNORE INTO system_maintenance (id) VALUES (1);
