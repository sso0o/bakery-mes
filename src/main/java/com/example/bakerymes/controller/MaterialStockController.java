package com.example.bakerymes.controller;

import com.example.bakerymes.dto.MaterialStockResponse;
import com.example.bakerymes.model.MaterialStock;
import com.example.bakerymes.repository.MaterialStockRepository;
import com.example.bakerymes.service.MaterialStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/materials/stocks")
public class MaterialStockController {

    private final MaterialStockService materialStockService;

    @GetMapping
    public List<MaterialStockResponse> getAllStocks() {
        List<MaterialStockResponse> stocks = materialStockService.getAllStocks();
        return stocks;
    }
}
