package com.example.bakerymes.service;

import com.example.bakerymes.dto.ProductionPlanDto;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductionPlan;
import com.example.bakerymes.repository.ProductRepository;
import com.example.bakerymes.repository.ProductionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionPlanService {

    private final ProductionPlanRepository productionPlanRepository;
    private final ProductRepository productRepository;

    public List<ProductionPlan> getPlansByProduct(Long productId) {
        return productionPlanRepository.findByProductIdOrderByPlanDate(productId);
    }

    public ProductionPlan savePlan(Long productId, LocalDate date, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("제품을 찾을 수 없습니다"));
        ProductionPlan plan = ProductionPlan.builder()
                .product(product)
                .planDate(date)
                .quantity(quantity)
                .build();
        return productionPlanRepository.save(plan);
    }

    public void deletePlan(Long id) {
        productionPlanRepository.deleteById(id);
    }

    public int getTotalPlannedQuantity(Long productId) {
        Integer total = productionPlanRepository.getTotalPlannedQuantity(productId);
        return total != null ? total : 0;
    }
}