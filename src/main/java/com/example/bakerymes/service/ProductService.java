package com.example.bakerymes.service;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.repository.CategoryRepository;
import com.example.bakerymes.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // 전체 제품 조회
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 제품 등록
    public Product saveProduct(Product product) {

        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));
        product.setCode(generateCode(category));

        return productRepository.save(product);
    }

    // 코드 자동 생성
    public String generateCode(Category category) {

        Optional<Product> lastProduct = productRepository.findTopByCategoryOrderByCodeDesc(category);

        int next = 1;
        if (lastProduct.isPresent()) {
            String lastCode = lastProduct.get().getCode(); // 예: PRD001-007
            String[] parts = lastCode.split("-");
            if (parts.length == 2) {
                try {
                    next = Integer.parseInt(parts[1]) + 1;
                } catch (NumberFormatException ignored) {}
            }
        }

        String prefix = category.getCodePrefix(); // 예: PRD001
        return String.format("%s-%03d", prefix, next); // 결과: PRD001-008

    }

}
