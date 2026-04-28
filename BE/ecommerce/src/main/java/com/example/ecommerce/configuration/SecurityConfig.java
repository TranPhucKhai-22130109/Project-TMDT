package com.example.ecommerce.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Cấu hình bảo mật chính.
     * - Public endpoints (không cần auth): /api/hello, /api/test
     * - Các endpoint còn lại: yêu cầu xác thực (sẽ mở rộng sau)
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Áp dụng CORS theo bean corsConfigurationSource()
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Tắt CSRF (API stateless, dùng JWT sau này)
            .csrf(AbstractHttpConfigurer::disable)

            // Không tạo session
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Phân quyền endpoint
            .authorizeHttpRequests(auth -> auth
                // Public: test endpoints
                .requestMatchers("/api/hello", "/api/test/**", "/api/products/**").permitAll()
                // Các request khác cần auth (cấu hình thêm sau)
                .anyRequest().authenticated()
            );

        return http.build();
    }

    /**
     * CORS toàn cục – cho phép FE (localhost:3000) gọi BE.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
