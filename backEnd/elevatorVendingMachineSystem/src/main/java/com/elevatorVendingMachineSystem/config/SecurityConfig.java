package com.elevatorVendingMachineSystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // REST API이므로 CSRF 보안 해제
                .authorizeHttpRequests(auth -> auth
                        // 1. 공용 접근 허용 (로그인 불필요)
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll() // 상품 조회
                        .requestMatchers(HttpMethod.POST, "/api/payments").permitAll()   // 결제 요청

                        // 2. 관리자 전용 (로그인 필요)
                        .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")   // 상품 등록
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN") // 상품 수정
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN") // 상품 삭제
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // 관리자 전용 API

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()); // HTTP Basic Auth 활성화

        return http.build();
    }

    // 비밀번호 암호화 도구 (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}