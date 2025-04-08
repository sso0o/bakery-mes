package com.example.bakerymes.repository;

import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductionPlanRepository extends JpaRepository<ProductionPlan, Long> {
    List<ProductionPlan> findByProduct(Product product);

    List<ProductionPlan> findByProductOrderByPlanDate(Product product);

    @Query("SELECT SUM(p.quantity) FROM ProductionPlan p WHERE p.product.id = :productId")
    Integer getTotalPlannedQuantity(@Param("productId") Long productId);
}