package com.elevatorVendingMachineSystem.service;

import com.elevatorVendingMachineSystem.domain.Product;
import com.elevatorVendingMachineSystem.dto.ProductDto;
import com.elevatorVendingMachineSystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * 상품 목록 조회 (SID-001, SID-019)
     * 사용자와 관리자 모두 사용합니다.
     * UT-101 시험 케이스 대응: DB 상태에 따라 콘솔에 텍스트 출력
     */
    public List<ProductDto.Response> getAllProducts() {
        try {
            // 1. DB 조회 시도
            List<Product> products = productRepository.findAll();

            // 2. 데이터 유무 확인 및 텍스트 출력
            if (!products.isEmpty()) {
                System.out.println("======================");
                System.out.println("Result: DB에 데이터 존재");  // UT-101-01
                System.out.println("======================");
            } else {
                System.out.println("======================");
                System.out.println("Result: DB에 데이터 없음");  // UT-101-02
                System.out.println("======================");
            }

            return products.stream()
                    .map(ProductDto.Response::new)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            // 3. DB 연결 실패 등 예외 발생 시 텍스트 출력
            System.out.println("======================");
            System.out.println("Result: DB 연결 실패");      // UT-101-03
            System.out.println("Error Message: " + e.getMessage());
            System.out.println("======================");

            // 컨트롤러가 에러를 인지할 수 있도록 예외를 다시 던짐
            throw e;
        }
    }

    /**
     * 상품 상세 조회 (SID-003, SID-020)
     */
    public ProductDto.Response getProduct(Long id) {
        try {
            // 1. DB 조회 시도
            Optional<Product> productOpt = productRepository.findById(id);

            // 2. 데이터 유무 확인 및 텍스트 출력
            if (productOpt.isPresent()) {
                System.out.println("======================");
                System.out.println("Result: DB에 데이터 존재"); // UT-101-01 (상세)
                System.out.println("======================");
                return new ProductDto.Response(productOpt.get());
            } else {
                System.out.println("======================");
                System.out.println("Result: DB에 데이터 없음"); // UT-101-02 (상세)
                System.out.println("======================");
                throw new IllegalArgumentException("해당 상품이 존재하지 않습니다. id=" + id);
            }

        } catch (IllegalArgumentException e) {
            // 데이터 없음(404) 상황은 위에서 로그를 찍었으므로 그대로 던짐
            throw e;
        } catch (Exception e) {
            // 3. 그 외 DB 연결 실패 등 예외 발생 시
            printDbConnectionError(e);
            throw e;
        }
    }

    /**
     * 신규 상품 등록 (SID-022)
     * 관리자 전용 기능입니다.
     */
    @Transactional
    public Long saveProduct(ProductDto.Request request, String imageUrl) {
        // 이미지가 있으면 DTO의 imageUrl 값을 덮어씌움 (DTO를 수정하거나 Entity 빌더에서 처리)
        // 여기서는 Entity 생성 시 주입하는 방식으로 처리
        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .stock(request.getStock())
                .locationCode(request.getLocationCode())
                .volume(request.getVolume())
                .calories(request.getCalories())
                .expirationDate(request.getExpirationDate())
                .allergyInfo(request.getAllergyInfo())
                .imageUrl(imageUrl != null ? imageUrl : request.getImageUrl()) // 파일이 있으면 그 경로 사용
                .build();

        return productRepository.save(product).getId();
    }

    /**
     * 상품 정보 수정 (SID-021)
     * 재고 보충 기능도 포함될 수 있습니다. (COM-06)
     */
    @Transactional
    public Long updateProduct(Long id, ProductDto.Request requestDto, String newImageUrl) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다. id=" + id));

        // 새 이미지가 있으면 교체, 없으면 기존 이미지 유지
        String finalImageUrl = (newImageUrl != null) ? newImageUrl : product.getImageUrl();

        product.updateInfo(
                requestDto.getName(),
                requestDto.getPrice(),
                requestDto.getVolume(),
                requestDto.getCalories(),
                requestDto.getExpirationDate(),
                requestDto.getAllergyInfo()
                // ImageUrl 업데이트 메서드가 엔티티에 없다면 추가 필요
        );

        // Product.java 엔티티에 setImageUrl 또는 updateImage 메서드가 필요함
        // 여기서는 편의상 아래와 같이 가정 (Entity에 메서드 추가 필요)
        product.updateImageUrl(finalImageUrl);

        product.updateStock(requestDto.getStock());

        return id;
    }

    /**
     * 상품 삭제 (SID-023)
     */
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다. id=" + id));
        productRepository.delete(product);
    }

    // 공통 에러 출력 메서드
    private void printDbConnectionError(Exception e) {
        System.out.println("======================");
        System.out.println("Result: DB 연결 실패");      // UT-101-03
        System.out.println("Error Message: " + e.getMessage());
        System.out.println("======================");
    }
}