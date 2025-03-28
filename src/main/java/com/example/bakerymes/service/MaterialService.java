package com.example.bakerymes.service;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Material;
import com.example.bakerymes.repository.CategoryRepository;
import com.example.bakerymes.repository.MaterialRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CategoryRepository categoryRepository;

    public Material saveMaterial(Material material) {
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

    @Transactional
    public Material updateMaterial(Long id, Material material) {
        Material m = materialRepository.findById(id) .orElseThrow(() -> new RuntimeException("해당 자재 없음"));

        Category newCategory = categoryRepository.findById(material.getCategory().getId())
               .orElseThrow(() -> new RuntimeException("변경할 카테고리 없음"));

        // 같은 카테고리 자재 개수 세기
        long count = materialRepository.countByCategory(newCategory);
        String newCode = newCategory.getCodePrefix() + "-" + String.format("%03d", count + 1);
        m.setCode(newCode);
        m.setCategory(newCategory);

        m.setName(material.getName());
        m.setName(material.getName());
        m.setUnit(material.getUnit());
        m.setOutUnit(material.getOutUnit());
        m.setManufacturer(material.getManufacturer());
        m.setDescription(material.getDescription());

        return materialRepository.save(m);
    }

    public void deleteMaterial(Long id) {
        Material m = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 자재 없음"));
        materialRepository.delete(m);
    }
}
