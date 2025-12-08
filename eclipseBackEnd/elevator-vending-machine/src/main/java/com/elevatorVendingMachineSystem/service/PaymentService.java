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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j // 로그 출력을 위한 Lombok 어노테이션
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProductRepository productRepository;
    private final PaymentLogRepository paymentLogRepository;
    //찬범추
    private final EmbeddedClientService embeddedClientService;
    // 현금 결제 누적 세션
    private Long currentCashProductId = null;
    private int currentInsertedCashAmount = 0;

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

            // ================================
            // 🔽 ① 첫 투입이거나 상품이 바뀐 경우 초기화
            // ================================
            if (currentCashProductId == null || !currentCashProductId.equals(product.getId())) {
                currentCashProductId = product.getId();
                currentInsertedCashAmount = 0;
            }

            // ================================
            // 🔽 ② 금액 누적
            // ================================
            currentInsertedCashAmount += request.getInsertedAmount();

            // ================================
            // 🔽 ③ 금액 부족 → 추가 투입 요청
            // ================================
            if (currentInsertedCashAmount < product.getPrice()) {
                return new PaymentDto.Response(
                        false,
                        "추가 투입이 필요합니다.",
                        currentInsertedCashAmount
                );
            }

            change = currentInsertedCashAmount - product.getPrice();

            // 재고 차감
            product.decreaseStock(1);

            // 결제 로그 저장
            savePaymentLog(product, request, PaymentStatus.SUCCESS, null);

            // 영수증 출력 여부 체크
            if (request.isNeedReceipt()) {
                printReceipt(product, product.getPrice(), change);
            }

            // ================================
            // 🔽 상품 출고 로그 + 하드웨어 신호 추가
            // ================================
            log.info("==================================================");
            log.info("📢 [하드웨어 신호 전송] 상품명: {}, 위치: {} -> 상품이 출고되었습니다.",
                    product.getName(), product.getLocationCode());
            log.info("==================================================");

            // 실제 하드웨어 명령 전송 가능 시
            // embeddedClientService.sendDispenseCommand(product);

            // 세션 초기화
            currentCashProductId = null;
            currentInsertedCashAmount = 0;

            // 최종 결제 완료 응답 반환
            return new PaymentDto.Response(
                    true,
                    "결제가 완료되었습니다. 상품을 꺼내주세요.",
                    change
            );
        }
        else if (request.getMethod() == PaymentMethod.CARD) {
            // 카드 결제: PG사 승인 요청 (SID-015 Mocking)
            // 실제로는 외부 API를 호출하지만, 여기서는 성공으로 가정
            log.info("PG사 승인 요청... [카드 번호: ****-****-****-2025, 금액: {}]", product.getPrice());
        }

        // 4. 상품 출고 및 잔액 반환(COM-08 요청사항: 텍스트 출력으로 대체)
        // 임베디드 장비(모터 등)가 없으므로 콘솔 로그로 대체합니다.
        if(change > 0) {
            log.info("==================================================");
            log.info("잔액이 반환되었습니다 : {}", change);
            log.info("==================================================");
        }
        log.info("==================================================");
        log.info("📢 [하드웨어 신호 전송] 상품명: {}, 위치: {} -> 상품이 출고되었습니다.",
                product.getName(), product.getLocationCode());
        log.info("==================================================");

        // 찬범추 - 노트북2에 출고신호 전송
        //embeddedClientService.sendDispenseCommand(product);

        // 5. 재고 차감 (트랜잭션 내 수행)
        product.decreaseStock(1);

        // 6. 결제 로그 저장 (SID-018)
        savePaymentLog(product, request, PaymentStatus.SUCCESS, null);

        // 7. 영수증 출력 (UT-303)
        if (request.isNeedReceipt()) {
            printReceipt(product, request, change);
        }

        return new PaymentDto.Response(true, "결제가 완료되었습니다. 상품을 꺼내주세요.", change);
    }

    // ================================
// 🔽 추가: 현금 최종 결제 확정 메서드
// ================================
    @Transactional
    public PaymentDto.Response confirmPayment(boolean needReceipt) {

        if (currentCashProductId == null) {
            return new PaymentDto.Response(false, "결제 중인 현금 거래가 없습니다.", 0);
        }

        Product product = productRepository.findById(currentCashProductId)
                .orElseThrow(() -> new IllegalArgumentException("상품 오류"));

        int price = product.getPrice();

        if (currentInsertedCashAmount < price) {
            return new PaymentDto.Response(false, "투입 금액이 부족합니다.", currentInsertedCashAmount);
        }

        int change = currentInsertedCashAmount - price;

        // 재고 차감
        product.decreaseStock(1);

        // 로그 저장
        savePaymentLog(product, new PaymentDto.Request(), PaymentStatus.SUCCESS, null);

        // 영수증 출력
        if (needReceipt) {
            printReceipt(product, price, change);
        }

        // 세션 초기화
        currentCashProductId = null;
        currentInsertedCashAmount = 0;

        return new PaymentDto.Response(true, "결제가 완료되었습니다.", change);
    }


    /**
     * 영수증 출력 메서드 (UT-303 구현)
     */
    private void printReceipt(Product product, PaymentDto.Request request, int change) {
        String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        int receivedAmount = (request.getMethod() == PaymentMethod.CASH) ? request.getInsertedAmount() : product.getPrice();

        System.out.println("\n");
        System.out.println("********** [영수증] **********");
        System.out.println("상호명: BCU 컴퍼니 엘리베이터 자판기 1호");
        System.out.println("일  시: " + dateTime);
        System.out.println("------------------------------");
        System.out.println("상품명          단가    수량    금액");
        System.out.printf("%-10s %,6d    1   %,6d\n", product.getName(), product.getPrice(), product.getPrice());
        System.out.println("------------------------------");
        System.out.printf("합계 금액:              %,7d원\n", product.getPrice());
        System.out.printf("받은 금액(%s):        %,7d원\n", request.getMethod(), receivedAmount);
        System.out.printf("거스름돈:               %,7d원\n", change);
        System.out.println("******************************");
        System.out.println("\n");
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
    // 현금 결제 전용 오버로딩
    private void printReceipt(Product product, int price, int change) {
        String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        System.out.println("\n");
        System.out.println("********** [영수증] **********");
        System.out.println("상호명: BCU 컴퍼니 엘리베이터 자판기 1호");
        System.out.println("일  시: " + dateTime);
        System.out.println("------------------------------");
        System.out.println("상품명          단가    수량    금액");
        System.out.printf("%-10s %,6d    1   %,6d\n", product.getName(), price, price);
        System.out.println("------------------------------");
        System.out.printf("합계 금액:              %,7d원\n", price);
        System.out.printf("받은 금액(CASH):       %,7d원\n", price + change);
        System.out.printf("거스름돈:               %,7d원\n", change);
        System.out.println("******************************");
        System.out.println("\n");
    }

}