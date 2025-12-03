package com.elevatorVendingMachineSystem.repository;

import com.elevatorVendingMachineSystem.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 위치 번호로 상품 찾기 (SIP2 - 위치 번호 기반 조회)
    Optional<Product> findByLocationCode(Integer locationCode);
}