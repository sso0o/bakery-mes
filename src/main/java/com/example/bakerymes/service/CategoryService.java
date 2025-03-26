package com.example.bakerymes.service;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // 카테고리 삭제
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("삭제할 카테고리를 찾을 수 없습니다. (id=" + id + ")"));

        categoryRepository.delete(category);
    }
}
