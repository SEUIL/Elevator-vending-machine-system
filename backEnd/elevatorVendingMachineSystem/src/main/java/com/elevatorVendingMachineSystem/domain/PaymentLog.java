package com.elevatorVendingMachineSystem.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 결제 내역 엔티티
 * 모든 결제 성공/실패 기록을 저장합니다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class) // 생성 시간 자동 기록
@Table(name = "payment_log")
public class PaymentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("결제된 상품 ID")
    private Long productId;

    @Comment("결제된 상품명 (상품 삭제 대비용)")
    private String productName;

    @Comment("결제 금액")
    private Integer amount;

    @Comment("결제 수단 (CARD, CASH)")
    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @Comment("결제 상태 (SUCCESS, FAIL)")
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Comment("에러 메시지 (실패 시)")
    private String errorMessage;

    @Builder
    public PaymentLog(Long productId, String productName, Integer amount,
                      PaymentMethod method, PaymentStatus status, String errorMessage) {
        this.productId = productId;
        this.productName = productName;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.errorMessage = errorMessage;
    }
}
