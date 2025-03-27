package com.example.bakerymes.controller;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories(@RequestParam String type) {
        return categoryService.getCategoriesByType(type);
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 예외를 적절히 처리하고 로그를 남깁니다.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
