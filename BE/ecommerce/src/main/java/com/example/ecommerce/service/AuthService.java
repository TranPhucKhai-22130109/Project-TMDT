package com.example.ecommerce.service;

import com.example.ecommerce.dto.TokenPayload;
import com.example.ecommerce.dto.request.auth.LoginRequest;
import com.example.ecommerce.dto.request.auth.SignUpRequest;
import com.example.ecommerce.dto.response.LoginResponse;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.entity.UserRole;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.RoleRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.repository.UserRoleRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenService tokenService;
    private final JwtDecoder jwtDecoder;

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }


    public void register(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User user = new User();
        user.setUsername(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        UserRole userRole = new UserRole();
        userRole.setUser(savedUser);
        userRole.setRole(role);

        userRoleRepository.save(userRole);
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authenticationToken = UsernamePasswordAuthenticationToken.unauthenticated(request.getEmail(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        User user = (User) authentication.getPrincipal();
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        TokenPayload accessToken = jwtService.generateAccessToken(user);
        TokenPayload refreshToken = jwtService.generateRefreshToken(user);
        tokenService.storeRefreshToken(refreshToken.getJwtId(), refreshToken.getExpiresAt());

        return LoginResponse.builder()
            .accessToken(accessToken.getToken())
            .refreshToken(refreshToken.getToken())
            .userId(user.getId())
            .username(user.getUsername())
            .build();
    }

    public String refreshAccessToken(String refreshToken) {
        Jwt jwt;
        try {
            jwt = jwtDecoder.decode(refreshToken); // decode refresh token
        } catch (JwtException ex) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        String jwtId = jwt.getClaim("jwtId");

        // 1. Check refresh token
        if (!tokenService.isRefreshTokenValid(jwtId)) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        // 2. Revoke refresh old token
        tokenService.revokeRefreshToken(jwtId);

        User user = userRepository.findById(jwt.getSubject())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return jwtService.generateAccessToken(user).getToken();
    }


    public void logout(String accessToken, String refreshToken, HttpServletResponse response) {
        // Blacklist access token
        if (accessToken != null && jwtService.isValidToken(accessToken)) {
            Jwt jwt = jwtService.extractToken(accessToken);
            String accessJti = jwt.getClaim("jwtId");
            Instant accessExp = jwt.getExpiresAt();
            long ttl = Duration.between(Instant.now(), accessExp).getSeconds();
            if (ttl > 0) {
                tokenService.blacklistAccessToken(accessJti, accessExp);
            }
        }

        // Revoke refresh token
        if (refreshToken != null && jwtService.isValidToken(refreshToken)) {
            Jwt jwt = jwtService.extractToken(accessToken);
            tokenService.revokeRefreshToken(jwt.getClaim("jwtId"));
        }

        // Clear refresh cookie
        ResponseCookie clearRefreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        // Clear access cookie
        ResponseCookie clearAccessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", clearRefreshCookie.toString());
        response.addHeader("Set-Cookie", clearAccessCookie.toString());
    }

}
