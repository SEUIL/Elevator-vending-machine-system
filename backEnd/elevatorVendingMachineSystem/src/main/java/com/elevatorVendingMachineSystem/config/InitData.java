package com.elevatorVendingMachineSystem.config;

import com.elevatorVendingMachineSystem.domain.Product;
import com.elevatorVendingMachineSystem.domain.Role;
import com.elevatorVendingMachineSystem.domain.User;
import com.elevatorVendingMachineSystem.repository.ProductRepository;
import com.elevatorVendingMachineSystem.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class InitData {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // 1. 기본 관리자 계정 생성
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("2025")) // 비밀번호 2025
                    .role(Role.ADMIN)
                    .build());
            System.out.println("========== 관리자 계정 생성 완료 (ID: admin / PW: 2025) ==========");
        }
    }
}