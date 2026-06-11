package com.example.ecommerce.controller;


import com.example.ecommerce.dto.request.auth.ForgotPasswordRequest;
import com.example.ecommerce.dto.request.auth.GoogleAuthRequest;
import com.example.ecommerce.dto.request.auth.LoginRequest;
import com.example.ecommerce.dto.request.auth.ResetPasswordRequest;
import com.example.ecommerce.dto.request.auth.SignUpRequest;
import com.example.ecommerce.dto.request.auth.VerifyOtpRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.LoginResponse;
import com.example.ecommerce.dto.response.VerifyOtpResponse;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Void>> checkUsername(
            @RequestParam String username
    ) {
        boolean available = authService.isUsernameAvailable(username);

        if (!available) {
            return ResponseEntity.ok(
                    ApiResponse.<Void>builder()
                            .success(false)
                            .code("USERNAME_ALREADY_EXISTS")
                            .message("Username already exists")
                            .build()
            );
        }

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("USERNAME_AVAILABLE")
                        .message("Username is available")
                        .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @RequestBody SignUpRequest request
    ) {
        authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("REGISTER_SUCCESS")
                        .message("Registration successful. Please check your email to verify your account.")
                        .build()
        );
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @RequestParam String token
    ) {
        authService.verifyEmail(token);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("EMAIL_VERIFIED")
                        .message("Email verified successfully. You can now log in.")
                        .build()
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("OTP_SENT")
                        .message("OTP has been sent to your email.")
                        .build()
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {
        String resetToken = authService.verifyOtp(request.getEmail(), request.getOtp());

        return ResponseEntity.ok(
                ApiResponse.<VerifyOtpResponse>builder()
                        .success(true)
                        .code("OTP_VERIFIED")
                        .message("OTP verified. Use the reset token to set a new password.")
                        .data(VerifyOtpResponse.builder()
                                .resetToken(resetToken)
                                .build())
                        .build()
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request.getResetToken(), request.getNewPassword());

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("PASSWORD_RESET_SUCCESS")
                        .message("Password has been reset successfully.")
                        .build()
        );
    }

    // Google
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<LoginResponse>> loginWithGoogle(
            @RequestBody GoogleAuthRequest request) {
        LoginResponse loginResponse = authService.loginWithGoogle(request);

        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        loginResponse.getAccessToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        loginResponse.getRefreshToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/v1/auth/refresh")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(
                        ApiResponse.<LoginResponse>builder()
                                .success(true)
                                .code("GOOGLE_LOGIN_SUCCESS")
                                .message("Login with Google successfully")
                                .data(
                                        LoginResponse.builder()
                                                .userId(loginResponse.getUserId())
                                                .username(loginResponse.getUsername())
                                                .build()
                                )
                                .build()
                );
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody LoginRequest request
    ) {
        LoginResponse loginResponse = authService.login(request);

        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        loginResponse.getAccessToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        loginResponse.getRefreshToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/v1/auth/refresh")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(
                        ApiResponse.<LoginResponse>builder()
                                .success(true)
                                .code("LOGIN_SUCCESS")
                                .message("Login successfully")
                                .data(
                                        LoginResponse.builder()
                                                .userId(loginResponse.getUserId())
                                                .username(loginResponse.getUsername())
//                                                .accessToken(loginResponse.getAccessToken())
                                                .build()
                                )
                                .build()
                );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        LoginResponse loginResponse = authService.refreshAccessToken(refreshToken);

        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        loginResponse.getAccessToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        loginResponse.getRefreshToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/v1/auth/refresh")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.<LoginResponse>builder()
                        .success(true)
                        .code("REFRESH_SUCCESS")
                        .message("Token refreshed")
                        .data(
                                LoginResponse.builder()
                                        .userId(loginResponse.getUserId())
                                        .username(loginResponse.getUsername())
                                        .build()
                        )
                        .build()
                );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        String accessToken = null;

        if (authorization != null && authorization.startsWith("Bearer ")) {
            accessToken = authorization.substring(7);
        }

        authService.logout(accessToken, refreshToken, response);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Logout successfully")
                        .build()
        );
    }

}