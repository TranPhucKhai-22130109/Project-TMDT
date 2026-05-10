package com.example.ecommerce.controller;




import com.example.ecommerce.dto.request.auth.LoginRequest;
import com.example.ecommerce.dto.request.auth.SignUpRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.LoginResponse;
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
        boolean available  = authService.isUsernameAvailable(username);

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
                        .message("Register successfully")
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
        String newAccessToken = authService.refreshAccessToken(refreshToken);

        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        newAccessToken
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(  ApiResponse.<LoginResponse>builder()
                                .success(true)
                                .code("REFRESH_SUCCESS")
                                .message("Token refreshed")
                                .data(
                                        LoginResponse.builder()
//                                        .accessToken(newAccessToken)
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