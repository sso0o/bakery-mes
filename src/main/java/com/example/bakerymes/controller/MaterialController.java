package com.example.bakerymes.controller;

import com.example.bakerymes.model.Material;
import com.example.bakerymes.service.CategoryService;
import com.example.bakerymes.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/materials")
public class MaterialController {

    // 자재 등록
    private final MaterialService materialService;
    private final CategoryService categoryService;

    // 자재 전체 조회
    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }

    // 자재 등록
    @PostMapping
    public Material save(@RequestBody Material material) {
        return materialService.saveMaterial(material);
    }

    // 자재 수정
    @PutMapping("/{id}")
    public Material update(@PathVariable Long id, @RequestBody Material material) {
        return materialService.updateMaterial(id, material);
    }

    // 자재 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        materialService.deleteMaterial(id);
    }



}
