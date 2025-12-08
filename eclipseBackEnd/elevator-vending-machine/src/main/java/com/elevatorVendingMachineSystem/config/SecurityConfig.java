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
//제품 삭제를 위한 경추
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
                        //.requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN") // 상품 등록
                        //.requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN") // 상품 수정
                        //.requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN") // 상품 삭제
                        //.requestMatchers("/api/admin/**").hasRole("ADMIN") // 관리자 전용 API

                        // 빠른 진행을 위해 권한 허용함
                        // 삭제를 위한 권한 추가
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products").permitAll()   // 상품 등록
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").permitAll() // 상품 수정
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").permitAll() // 상품 삭제
                        .requestMatchers("/api/admin/**"). permitAll() // 관리자 전용 API
                        // 경욱이 추가한 경로 제품 이미지와 결제
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/payments/**").permitAll()

                        //

                        // 그 외 모든 요청은 인증 필요
                        //.anyRequest().authenticated()
                        // 원활한 개발을 위해
                        .anyRequest().permitAll()

                )
                .httpBasic(Customizer.withDefaults()); // HTTP Basic Auth 활성화

        return http.build();
    }
    // 제품 삭제를 위해 추가
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:3001");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    // 비밀번호 암호화 도구 (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}