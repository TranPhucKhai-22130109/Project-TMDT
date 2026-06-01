package com.example.ecommerce.configuration;

import com.example.ecommerce.service.UserDetailServiceCustomize;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // 🌟 Kích hoạt @PreAuthorize("hasRole('ADMIN')") hoạt động ở Controller
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailServiceCustomize userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity res) throws Exception {
        res.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        // Cho phép các phương thức OPTIONS (CORS Preflight) đi qua không cần token
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // VNPay callback - không cần xác thực
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders/vnpay-callback").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/orders/vnpay-callback").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/payments/vnpay-callback").permitAll()

                        // Auth - public
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/v1/auth/**").permitAll()

                        // Products - public
                        .requestMatchers("/api/v1/products/**").permitAll()
                        .requestMatchers("/v1/products/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()

                        // Auction
                        .requestMatchers("/api/auction/bid").authenticated()
                        .requestMatchers("/api/auction/**").permitAll()

                        // Admin Urls
                        .requestMatchers("/api/admin/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/v1/admin/**").hasRole("ADMIN")

                        // Tất cả còn lại yêu cầu xác thực
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .bearerTokenResolver(bearerTokenResolver())
                );

        return res.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        return request -> {
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("accessToken".equals(cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }
            return null;
        };
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        // 🌟 SỬA QUAN TRỌNG: Chỉ định Spring Boot đọc quyền hạn từ trường nào trong chuỗi JWT của bạn.
        // Mặc định là "scope", ở đây ta ép đọc từ "roles" (hoặc "role" / "authorities" tùy theo cách bạn tạo JWT)
        // Bác hãy kiểm tra hàm tạo Token (JwtProvider/JwtService) xem đang put tên gì nhé, thường là "roles"
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Cấu hình rõ nguồn gốc và các method được phép hoạt động khi truyền Cookie kèm theo
        config.setAllowedOriginPatterns(Collections.singletonList("http://localhost:3000"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "Accept", "X-Requested-With"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}