package com.example.bakerymes.controller;

import com.example.bakerymes.dto.ProductionPlanDto;
import com.example.bakerymes.dto.ProductionPlanRequest;
import com.example.bakerymes.model.ProductionPlan;
import com.example.bakerymes.service.ProductionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public ProductionPlan savePlan(@RequestBody ProductionPlanRequest req) {
        return productionPlanService.savePlan(req);
    }

    @DeleteMapping("/{id}/cancel")
    public void deletePlan(@PathVariable Long id) {
        productionPlanService.deletePlan(id);
    }

    @GetMapping("/{productId}/total")
    public int getTotal(@PathVariable Long productId) {
        return productionPlanService.getTotalPlannedQuantity(productId);
    }
}