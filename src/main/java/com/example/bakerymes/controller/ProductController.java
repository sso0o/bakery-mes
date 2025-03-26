package com.example.bakerymes.controller;

import com.example.bakerymes.model.Product;
import com.example.bakerymes.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @GetMapping("/generate-code")
    public String generateCode(@RequestParam Long categoryId) {
        return productService.generateCode(categoryId);
    }
}
