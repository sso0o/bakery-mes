package com.example.bakerymes.service;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Material;
import com.example.bakerymes.repository.CategoryRepository;
import com.example.bakerymes.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CategoryRepository categoryRepository;

    public Material registerMaterial(Material material) {
        Category category = categoryRepository.findById(material.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("카테고리 없음"));

        // 같은 카테고리 자재 개수 세기
        long count = materialRepository.countByCategory(category);

        // 자재 코드 생성: 카테고리 prefix + - + 순번
        String newCode = category.getCodePrefix() + "-" + String.format("%03d", count + 1);
        material.setCode(newCode);
        material.setCategory(category);

        return materialRepository.save(material);
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }
}
