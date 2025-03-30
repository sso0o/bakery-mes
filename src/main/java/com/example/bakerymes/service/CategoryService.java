package com.example.bakerymes.service;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 타입으로 카테고리 목록 조회
    public List<Category> getCategoriesByType(String type) {
        return categoryRepository.findByType(type);
    }

    // ID로 카테고리 조회 (예외 처리 포함)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("카테고리 없음"));
    }

    // 카테고리 생성
    public Category saveCategory(Category category) {
        String generated = generateCode(category.getType());
        category.setCodePrefix(generated);
        return categoryRepository.save(category);
    }

    // 코드 자동 생성
    public String generateCode(String type) {
        String prefix;
        switch (type) {
            case "PRODUCT" -> prefix = "PTP";
            case "PROCESS" -> prefix = "PRC";
            case "UNIT" -> prefix = "UNT";
            case "STATUS" -> prefix = "STS";
            case "MATERIAL" -> prefix = "MTP";
            default -> prefix = "CAT"; // 기본값
        }

        String lastCode = categoryRepository.findTopByTypeOrderByCodePrefixDesc(type)
                .map(Category::getCodePrefix)
                .orElse(null);

        int next = 1;
        if (lastCode != null && lastCode.length() >= 6) {
            try {
                next = Integer.parseInt(lastCode.substring(3)) + 1;
            } catch (NumberFormatException ignored) {}
        }

        return String.format("%s%03d", prefix, next);
    }


    // 카테고리 삭제
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("삭제할 카테고리를 찾을 수 없습니다. (id=" + id + ")"));

        categoryRepository.delete(category);
    }
}
