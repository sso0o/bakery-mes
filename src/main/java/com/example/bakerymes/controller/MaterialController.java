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

    // 자재 등록
    @PostMapping
    public Material createMaterial(@RequestBody Material material) {
        return materialService.saveMaterial(material);
    }

    // 자재 전체 조회
    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }


}
