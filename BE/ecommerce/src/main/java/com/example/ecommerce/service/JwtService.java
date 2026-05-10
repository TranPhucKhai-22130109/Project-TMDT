package com.example.ecommerce.service;

import com.example.ecommerce.dto.TokenPayload;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${jwt.access-token-expire}")
    private int accessTokenExpiration;

    @Value("${jwt.refresh-token-expire}")
    private int refreshTokenExpiration;

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public TokenPayload generateAccessToken(User user) {
        return generateToken(user, accessTokenExpiration);
    }

    public TokenPayload generateRefreshToken(User user) {
        return generateToken(user, refreshTokenExpiration);
    }

    public boolean isValidToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            return jwt.getExpiresAt() != null &&
                    jwt.getExpiresAt().isAfter(Instant.now());
        } catch (JwtException ex) {
            return false;
        }
    }

    public Jwt extractToken(String token) {
        try {
            return jwtDecoder.decode(token);
        } catch (JwtException ex) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    private TokenPayload generateToken(User user, long ttlSeconds) {
        String jwtId = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiresAt = now.plus(ttlSeconds, ChronoUnit.SECONDS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(user.getId())
                .claim("scope",user.getAuthorities()
                        .stream()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .toList())
                .claim("jwtId", jwtId)
                .build();

        JwsHeader header = JwsHeader.with(JWT_ALGORITHM).build();

        String token = jwtEncoder
                .encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();

        return TokenPayload.builder()
                .token(token)
                .jwtId(jwtId)
                .expiresAt(expiresAt)
                .build();
    }
}

