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

    // ===== Email verification token =====
    private final ConcurrentHashMap<String, String> emailVerifyTokens = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> emailVerifyExpiry = new ConcurrentHashMap<>();

    public void storeVerifyToken(String token, String userId, Instant expiresAt) {
        emailVerifyTokens.put(token, userId);
        emailVerifyExpiry.put(token, expiresAt);
    }

    public String getUserIdByVerifyToken(String token) {
        Instant expiresAt = emailVerifyExpiry.get(token);
        if (expiresAt == null || expiresAt.isBefore(Instant.now())) {
            consumeVerifyToken(token);
            return null;
        }
        return emailVerifyTokens.get(token);
    }

    public void consumeVerifyToken(String token) {
        emailVerifyTokens.remove(token);
        emailVerifyExpiry.remove(token);
    }

    // ===== OTP (forgot password) =====
    private final ConcurrentHashMap<String, String> otpStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> otpExpiry = new ConcurrentHashMap<>();

    public void storeOtp(String email, String otp, Instant expiresAt) {
        otpStore.put(email, otp);
        otpExpiry.put(email, expiresAt);
    }

    public boolean validateAndConsumeOtp(String email, String otp) {
        Instant expiresAt = otpExpiry.get(email);
        if (expiresAt == null || expiresAt.isBefore(Instant.now())) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return false;
        }
        String stored = otpStore.get(email);
        if (stored != null && stored.equals(otp)) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return true;
        }
        return false;
    }

    // ===== Reset password token =====
    private final ConcurrentHashMap<String, String> resetTokens = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> resetTokenExpiry = new ConcurrentHashMap<>();

    public void storeResetToken(String token, String email, Instant expiresAt) {
        resetTokens.put(token, email);
        resetTokenExpiry.put(token, expiresAt);
    }

    public String validateAndConsumeResetToken(String token) {
        Instant expiresAt = resetTokenExpiry.get(token);
        if (expiresAt == null || expiresAt.isBefore(Instant.now())) {
            resetTokens.remove(token);
            resetTokenExpiry.remove(token);
            return null;
        }
        String email = resetTokens.get(token);
        resetTokens.remove(token);
        resetTokenExpiry.remove(token);
        return email;
    }
}
