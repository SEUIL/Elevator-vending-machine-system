package com.elevatorVendingMachineSystem.service;

import com.elevatorVendingMachineSystem.domain.PaymentLog;
import com.elevatorVendingMachineSystem.domain.PaymentMethod;
import com.elevatorVendingMachineSystem.domain.PaymentStatus;
import com.elevatorVendingMachineSystem.domain.Product;
import com.elevatorVendingMachineSystem.dto.PaymentDto;
import com.elevatorVendingMachineSystem.repository.PaymentLogRepository;
import com.elevatorVendingMachineSystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j // 로그 출력을 위한 Lombok 어노테이션
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProductRepository productRepository;
    private final PaymentLogRepository paymentLogRepository;

    /**
     * 결제 프로세스 통합 처리 (SID-014 ~ SID-018)
     */
    @Transactional
    public PaymentDto.Response processPayment(PaymentDto.Request request) {
        // 1. 상품 조회 및 유효성 검사
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

        // 2. 재고 확인
        if (product.getStock() <= 0) {
            savePaymentLog(product, request, PaymentStatus.FAIL, "재고 부족");
            return new PaymentDto.Response(false, "재고가 부족합니다.", 0);
        }

        // 3. 결제 수단별 로직 처리 (Mocking)
        int change = 0; // 거스름돈

        if (request.getMethod() == PaymentMethod.CASH) {
            // 현금 결제: 금액 비교 (SID-007)
            if (request.getInsertedAmount() < product.getPrice()) {
                savePaymentLog(product, request, PaymentStatus.FAIL, "투입 금액 부족");
                return new PaymentDto.Response(false, "투입 금액이 부족합니다.", request.getInsertedAmount());
            }
            // 잔액 계산 (SID-008)
            change = request.getInsertedAmount() - product.getPrice();
        } else if (request.getMethod() == PaymentMethod.CARD) {
            // 카드 결제: PG사 승인 요청 (SID-015 Mocking)
            // 실제로는 외부 API를 호출하지만, 여기서는 성공으로 가정
            log.info("PG사 승인 요청... [카드 번호: ****-****-****-1234, 금액: {}]", product.getPrice());
        }

        // 4. 상품 출고 (COM-08 요청사항: 텍스트 출력으로 대체)
        // 임베디드 장비(모터 등)가 없으므로 콘솔 로그로 대체합니다.
        log.info("==================================================");
        log.info("📢 [하드웨어 신호 전송] 상품명: {}, 위치: {} -> 상품이 출고되었습니다.",
                product.getName(), product.getLocationCode());
        log.info("==================================================");

        // 5. 재고 차감 (트랜잭션 내 수행)
        product.decreaseStock(1);

        // 6. 결제 로그 저장 (SID-018)
        savePaymentLog(product, request, PaymentStatus.SUCCESS, null);

        return new PaymentDto.Response(true, "결제가 완료되었습니다. 상품을 꺼내주세요.", change);
    }

    /**
     * 결제 로그 저장 메서드 (SID-018)
     */
    private void savePaymentLog(Product product, PaymentDto.Request request, PaymentStatus status, String errorMsg) {
        PaymentLog log = PaymentLog.builder()
                .productId(product.getId())
                .productName(product.getName())
                .amount(product.getPrice())
                .method(request.getMethod())
                .status(status)
                .errorMessage(errorMsg)
                .build();

        paymentLogRepository.save(log);
    }
}