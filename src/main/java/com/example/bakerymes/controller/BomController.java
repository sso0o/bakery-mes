package com.example.bakerymes.controller;

import com.example.bakerymes.dto.BOMItemResponse;
import com.example.bakerymes.service.BomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boms")
public class BomController {

    private final BomService bomService;

    @GetMapping("/{productId}")
    public List<BOMItemResponse> getBOMByProduct(@PathVariable Long productId) {
        return bomService.getBOMByProduct(productId);
    }

}
