package com.elevatorVendingMachineSystem.dto;

import com.elevatorVendingMachineSystem.domain.Product;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class ProductDto {

    // 상품 등록/수정 요청 (Request)
    @Getter
    @NoArgsConstructor
    public static class Request {
        private String name;
        private Integer price;
        private Integer stock;
        private Integer locationCode;
        private String volume;
        private Integer calories;
        private LocalDate expirationDate;
        private String allergyInfo;
        private String imageUrl;

        @Builder
        public Request(String name, Integer price, Integer stock, Integer locationCode,
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

        public Product toEntity() {
            return Product.builder()
                    .name(name)
                    .price(price)
                    .stock(stock)
                    .locationCode(locationCode)
                    .volume(volume)
                    .calories(calories)
                    .expirationDate(expirationDate)
                    .allergyInfo(allergyInfo)
                    .imageUrl(imageUrl)
                    .build();
        }
    }

    // 상품 응답 (Response)
    @Getter
    public static class Response {
        private Long id;
        private String name;
        private Integer price;
        private Integer stock;
        private Integer locationCode;
        private String volume;
        private Integer calories;
        private LocalDate expirationDate;
        private String allergyInfo;
        private String imageUrl;

        public Response(Product product) {
            this.id = product.getId();
            this.name = product.getName();
            this.price = product.getPrice();
            this.stock = product.getStock();
            this.locationCode = product.getLocationCode();
            this.volume = product.getVolume();
            this.calories = product.getCalories();
            this.expirationDate = product.getExpirationDate();
            this.allergyInfo = product.getAllergyInfo();
            this.imageUrl = product.getImageUrl();
        }
    }
}