package com.example.bakerymes.controller;

import com.example.bakerymes.dto.MaterialStockResponse;
import com.example.bakerymes.model.MaterialStock;
import com.example.bakerymes.repository.MaterialStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/materials/stocks")
public class MaterialStockController {

    private final MaterialStockRepository stockRepository;

    @GetMapping
    public List<MaterialStockResponse> getAllStocks() {
        List<MaterialStock> stocks = stockRepository.findAll();

        return stocks.stream().map(stock -> {
            var material = stock.getMaterial();
            return MaterialStockResponse.builder()
                    .materialId(material.getId())
                    .code(material.getCode())
                    .name(material.getName())
                    .manufacturer(material.getManufacturer())
                    .unit(material.getUnit())
                    .categoryName(material.getCategory() != null ? material.getCategory().getName() : null)
                    .quantity(stock.getQuantity())
                    .lastInboundDate(stock.getLastInboundDate())
                    .build();
        }).collect(Collectors.toList());
    }
}
