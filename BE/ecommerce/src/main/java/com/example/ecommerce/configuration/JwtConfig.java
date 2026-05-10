package com.example.ecommerce.configuration;



import com.example.ecommerce.service.JwtService;
import com.example.ecommerce.service.TokenService;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.*;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@RequiredArgsConstructor
public class JwtConfig {
    @Value("${jwt.base64-secret}")
    private String jwtKey;
    private final TokenService tokenService;

    public SecretKey getSecretKey() {
        byte[] keyBytes = Base64.encode(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JwtService.JWT_ALGORITHM.getName());
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder =NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(JwtService.JWT_ALGORITHM).build();
        return token -> {
            try {
                Jwt jwt =  jwtDecoder.decode(token);
                String jwtId = jwt.getClaim("jwtId");

                // Check blacklist access token
                if(tokenService.isAccessTokenBlacklisted(jwtId)) {
                    throw new JwtException("JWT token is blacklisted");
                }
                return jwt;
            } catch (Exception e) {
                System.out.println("jwt error:" + e.getMessage());
                throw e;
            }
        };
    }

}
