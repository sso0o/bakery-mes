package com.example.bakerymes.service;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.repository.CategoryRepository;
import com.example.bakerymes.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
        return productRepository.save(product);
    }

    // 코드 자동 생성
    public String generateCode(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        String prefix = category.getCodePrefix();
        long count = productRepository.countByCodeStartingWith(prefix);
        return String.format("%s%03d", prefix, count + 1);
    }
}
