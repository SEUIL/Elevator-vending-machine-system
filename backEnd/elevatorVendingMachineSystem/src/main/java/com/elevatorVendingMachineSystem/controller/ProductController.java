package com.elevatorVendingMachineSystem.controller;

import com.elevatorVendingMachineSystem.dto.ProductDto;
import com.elevatorVendingMachineSystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // React 개발 서버 허용
public class ProductController {

    private final ProductService productService;

    // 상품 목록 조회 (사용자/관리자)
    @GetMapping
    public List<ProductDto.Response> getList() {
        return productService.getAllProducts();
    }

    // 상품 상세 조회 (사용자/관리자)
    @GetMapping("/{id}")
    public ProductDto.Response getProduct(@PathVariable Long id) {
        return productService.getProduct(id);
    }

    // 상품 등록 (관리자)
    @PostMapping
    public ResponseEntity<Long> save(@RequestBody ProductDto.Request requestDto) {
        return ResponseEntity.ok(productService.saveProduct(requestDto));
    }

    // 상품 수정 (관리자)
    @PutMapping("/{id}")
    public ResponseEntity<Long> update(@PathVariable Long id, @RequestBody ProductDto.Request requestDto) {
        return ResponseEntity.ok(productService.updateProduct(id, requestDto));
    }

    // 상품 삭제 (관리자)
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(id);
    }
}
