package com.example.ecommerce.service;


import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {

    // In-memory storage thay thế Redis
    private final ConcurrentHashMap<String, Instant> refreshTokens = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    private static final String REFRESH_PREFIX = "refresh:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    public long calculateTtl(Instant expiresAt) {
        return Duration.between(Instant.now(), expiresAt).getSeconds();
    }

    // ===== Refresh token =====
    public void storeRefreshToken(String jti, Instant expiresAt) {
        refreshTokens.put(REFRESH_PREFIX + jti, expiresAt);
    }

    public boolean isRefreshTokenValid(String jti) {
        Instant expiresAt = refreshTokens.get(REFRESH_PREFIX + jti);
        if (expiresAt == null) return false;
        if (expiresAt.isBefore(Instant.now())) {
            refreshTokens.remove(REFRESH_PREFIX + jti); // auto-cleanup expired
            return false;
        }
        return true;
    }

    public void revokeRefreshToken(String jti) {
        refreshTokens.remove(REFRESH_PREFIX + jti);
    }

    // ===== Access token =====

    public void blacklistAccessToken(String jti, Instant expiresAt) {
        blacklistedTokens.put(BLACKLIST_PREFIX + jti, expiresAt);
    }

    public boolean isAccessTokenBlacklisted(String jti) {
        Instant expiresAt = blacklistedTokens.get(BLACKLIST_PREFIX + jti);
        if (expiresAt == null) return false;
        if (expiresAt.isBefore(Instant.now())) {
            blacklistedTokens.remove(BLACKLIST_PREFIX + jti); // auto-cleanup expired
            return false;
        }
        return true;
    }
}
