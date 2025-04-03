package com.example.bakerymes.controller;

import com.example.bakerymes.dto.MaterialStockResponse;
import com.example.bakerymes.model.MaterialStock;
import com.example.bakerymes.service.MaterialStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/material-stocks")
public class MaterialStockController {

    private final MaterialStockService materialStockService;

    @GetMapping
    public List<MaterialStockResponse> getAllStocks() {
        return materialStockService.getAllStocks();
    }

    @GetMapping("/by-material/{materialId}")
    public List<MaterialStock> getStocksByMaterialId(@PathVariable Long materialId) {
        return materialStockService.getStocksByMaterialId(materialId);
    }
}
