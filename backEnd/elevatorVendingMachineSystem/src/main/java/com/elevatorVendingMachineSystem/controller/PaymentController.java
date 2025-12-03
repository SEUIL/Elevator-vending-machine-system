package com.elevatorVendingMachineSystem.controller;

import com.elevatorVendingMachineSystem.dto.PaymentDto;
import com.elevatorVendingMachineSystem.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;

    // 결제 요청 (POST /api/payments)
    @PostMapping
    public ResponseEntity<PaymentDto.Response> pay(@RequestBody PaymentDto.Request request) {
        PaymentDto.Response response = paymentService.processPayment(request);

        if (!response.isSuccess()) {
            // 실패 시 400 Bad Request 또는 200 OK에 실패 메시지를 담아 보낼 수 있음.
            // 여기서는 클라이언트 처리를 쉽게 하기 위해 200 OK로 보내고 success flag로 판단하도록 함.
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(response);
    }
}