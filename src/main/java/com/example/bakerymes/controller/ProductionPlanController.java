package com.example.bakerymes.controller;

import com.example.bakerymes.dto.ProductionPlanDto;
import com.example.bakerymes.model.ProductionPlan;
import com.example.bakerymes.service.ProductionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/production-plans")
public class ProductionPlanController {

    private final ProductionPlanService productionPlanService;

    @GetMapping("/{productId}")
    public List<ProductionPlan> getPlans(@PathVariable Long productId) {
        return productionPlanService.getPlansByProduct(productId);
    }

    @PostMapping
    public ProductionPlan createPlan(@RequestParam Long productId,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate planDate,
                                     @RequestParam int quantity) {
        return productionPlanService.savePlan(productId, planDate, quantity);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {
        productionPlanService.deletePlan(id);
    }

    @GetMapping("/{productId}/total")
    public int getTotal(@PathVariable Long productId) {
        return productionPlanService.getTotalPlannedQuantity(productId);
    }
}