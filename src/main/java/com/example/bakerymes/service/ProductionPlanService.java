package com.example.bakerymes.service;

import com.example.bakerymes.dto.ProductionPlanRequest;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductionPlan;
import com.example.bakerymes.model.WorkOrder;
import com.example.bakerymes.repository.ProductRepository;
import com.example.bakerymes.repository.ProductionPlanRepository;
import com.example.bakerymes.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductionPlanService {

    private final ProductionPlanRepository ppRepository;
    private final ProductRepository productRepository;
    private final WorkOrderRepository woRepository;

    public List<ProductionPlan> getPlansByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("제품을 찾을 수 없습니다"));
        return ppRepository.findByProductOrderByPlanDate(product);
    }

    public ProductionPlan savePlan(ProductionPlanRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("제품을 찾을 수 없습니다"));
        ProductionPlan plan = ProductionPlan.builder()
                .product(product)
                .planDate(req.getPlanDate())
                .quantity(req.getQuantity())
                .status("PLANNED")
                .build();
        return ppRepository.save(plan);
    }

    public void deletePlan(Long id) {
        ProductionPlan plan = ppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 생산계획을 찾을 수 없습니다"));

        if ("ORDERED".equals(plan.getStatus())) {
            throw new IllegalStateException("작업지시로 전환된 계획은 삭제할 수 없습니다.");
        }

        WorkOrder order = woRepository.findByPlan_Id(id);
        if (order != null) {
            order.setPlan(null);
            woRepository.save(order);
        }

        ppRepository.delete(plan);
    }

    public int getTotalPlannedQuantity(Long productId) {
        Integer total = ppRepository.getTotalPlannedQuantity(productId);
        return total != null ? total : 0;
    }
}