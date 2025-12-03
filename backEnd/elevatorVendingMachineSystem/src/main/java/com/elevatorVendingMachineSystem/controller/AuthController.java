package com.elevatorVendingMachineSystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // 로그인 테스트용 API
    // 프론트에서 Authorization: Basic base64(id:pw) 헤더를 보내서
    // 200 OK가 오면 로그인 성공, 401이면 실패로 처리
    @GetMapping("/login")
    public ResponseEntity<String> login() {
        return ResponseEntity.ok("로그인 성공");
    }
}