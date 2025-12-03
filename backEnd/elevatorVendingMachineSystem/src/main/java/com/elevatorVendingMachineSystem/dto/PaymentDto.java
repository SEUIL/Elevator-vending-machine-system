package com.elevatorVendingMachineSystem.dto;

import com.elevatorVendingMachineSystem.domain.PaymentMethod;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class PaymentDto {

    @Getter
    @NoArgsConstructor
    public static class Request {
        private Long productId;      // 구매할 상품 ID
        private PaymentMethod method; // 결제 수단 (CARD, CASH)
        private Integer insertedAmount; // 투입 금액 (현금일 경우 필수)
        private boolean needReceipt; //영수증 요청 여부 (true or false)
    }

    @Getter
    public static class Response {
        private boolean success;     // 성공 여부
        private String message;      // 결과 메시지 (예: 결제 완료, 잔액 부족 등)
        private Integer change;      // 거스름돈 (현금 결제 시)

        public Response(boolean success, String message, Integer change) {
            this.success = success;
            this.message = message;
            this.change = change;
        }
    }
}