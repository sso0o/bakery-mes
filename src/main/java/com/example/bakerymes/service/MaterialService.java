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

        String newCode = createMaterialCode(category);

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

        // 카테고리 변경 방지
        if (!m.getCategory().getId().equals(material.getCategory().getId())) {
            throw new IllegalArgumentException("카테고리는 수정할 수 없습니다.");
        }

        m.setName(material.getName());
        m.setCapacity(material.getCapacity());
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

    public String createMaterialCode(Category category) {
        String prefix = category.getCodePrefix(); // 예: MTP001
        String lastCode = materialRepository.findLastCodeByCategory(category); // 예: MTP001-005

        int nextNumber = 1;
        if (lastCode != null && lastCode.startsWith(prefix)) {
            String[] parts = lastCode.split("-");
            if (parts.length == 2) {
                try {
                    nextNumber = Integer.parseInt(parts[1]) + 1;
                } catch (NumberFormatException ignored) {}
            }
        }

        return String.format("%s-%03d", prefix, nextNumber);
    }
}
