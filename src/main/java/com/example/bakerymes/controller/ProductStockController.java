package com.example.bakerymes.controller;

import com.example.bakerymes.service.ProductStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product-stocks")
public class ProductStockController {
    private final ProductStockService psService;


}
