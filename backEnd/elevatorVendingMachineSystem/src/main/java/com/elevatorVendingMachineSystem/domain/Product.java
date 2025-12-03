package com.elevatorVendingMachineSystem.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import java.time.LocalDate;

/**
 * 상품 엔티티 (SRS2, SIP2 기반)
 * 자판기에 진열된 상품의 정보를 담습니다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Comment("상품명")
    @Column(nullable = false, length = 50)
    private String name;

    @Comment("가격")
    @Column(nullable = false)
    private Integer price;

    @Comment("재고 수량")
    @Column(nullable = false)
    private Integer stock;

    @Comment("상품 위치 번호 (예: 1, 2, 3...)")
    @Column(nullable = false, unique = true) // 위치는 중복될 수 없음
    private Integer locationCode;

    @Comment("상품 용량 (예: 350ml)")
    private String volume;

    @Comment("칼로리 (kcal)")
    private Integer calories;

    @Comment("유통기한")
    private LocalDate expirationDate;

    @Comment("알레르기 정보")
    private String allergyInfo;

    @Comment("상품 이미지 URL (프론트 표시용)")
    private String imageUrl;

    @Builder
    public Product(String name, Integer price, Integer stock, Integer locationCode,
                   String volume, Integer calories, LocalDate expirationDate,
                   String allergyInfo, String imageUrl) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.locationCode = locationCode;
        this.volume = volume;
        this.calories = calories;
        this.expirationDate = expirationDate;
        this.allergyInfo = allergyInfo;
        this.imageUrl = imageUrl;
    }

    // 재고 감소 비즈니스 로직
    public void decreaseStock(int quantity) {
        int restStock = this.stock - quantity;
        if (restStock < 0) {
            throw new IllegalStateException("재고가 부족합니다.");
        }
        this.stock = restStock;
    }

    // 상품 정보 수정 (COM-06)
    public void updateInfo(String name, Integer price, String volume, Integer calories,
                           LocalDate expirationDate, String allergyInfo) {
        this.name = name;
        this.price = price;
        this.volume = volume;
        this.calories = calories;
        this.expirationDate = expirationDate;
        this.allergyInfo = allergyInfo;
    }

    // 재고 보충 (COM-06)
    public void addStock(int quantity) {
        this.stock += quantity;
    }

    public void updateStock(int stock) {
        this.stock = stock;
    }

    //이미지 파일 저장
    public void updateImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}