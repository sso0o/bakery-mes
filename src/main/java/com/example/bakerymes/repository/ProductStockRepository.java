package com.example.bakerymes.repository;

import com.example.bakerymes.model.ProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {

    @Query("SELECT SUM(ps.quantity) FROM ProductStock ps WHERE ps.product.id = :productId")
    Long sumStockByProductId(@Param("productId") Long productId);
}