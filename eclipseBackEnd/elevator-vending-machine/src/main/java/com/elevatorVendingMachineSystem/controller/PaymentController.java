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

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(response);
    }
    @PostMapping("/confirm")
    public ResponseEntity<PaymentDto.Response> confirmPayment(
            @RequestParam boolean needReceipt) {

        PaymentDto.Response response = paymentService.confirmPayment(needReceipt);
        return ResponseEntity.ok(response);
    }
}