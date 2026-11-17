package com.capstone.detectivegame.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.account")
public record AccountProperties(String googleClientId, String frontendUrl, String mailFrom, int resetTokenMinutes) {
    public boolean googleEnabled() { return googleClientId!=null && !googleClientId.isBlank(); }
    public int tokenMinutes() { return resetTokenMinutes>0?resetTokenMinutes:30; }
}
