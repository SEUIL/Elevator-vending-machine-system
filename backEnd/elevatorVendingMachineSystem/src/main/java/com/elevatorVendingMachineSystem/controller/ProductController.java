package com.elevatorVendingMachineSystem.controller;

import com.elevatorVendingMachineSystem.dto.ProductDto;
import com.elevatorVendingMachineSystem.service.FileService;
import com.elevatorVendingMachineSystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // React 개발 서버 허용
public class ProductController {

    private final ProductService productService;
    private final FileService fileService;

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
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> save(
            @RequestPart("request") ProductDto.Request requestDto, // JSON 데이터
            @RequestPart(value = "file", required = false) MultipartFile file // 이미지 파일
    ) throws IOException {

        // 1. 이미지 파일 저장 및 경로 생성
        String imageUrl = fileService.saveFile(file);

        // 2. 경로를 DTO에 주입 (Request DTO에 setter가 필요하거나, Service에서 처리)
        // 여기서는 Service로 넘겨서 처리하도록 수정하겠습니다.
        return ResponseEntity.ok(productService.saveProduct(requestDto, imageUrl));
    }

    // 상품 수정 (관리자)
    @PutMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> update(
            @PathVariable Long id,
            @RequestPart("request") ProductDto.Request requestDto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        String imageUrl = fileService.saveFile(file);
        // 이미지가 없으면 null이 반환됨 -> 서비스에서 기존 이미지 유지 로직 필요
        return ResponseEntity.ok(productService.updateProduct(id, requestDto, imageUrl));
    }

    // 상품 삭제 (관리자)
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(id);
    }
}
