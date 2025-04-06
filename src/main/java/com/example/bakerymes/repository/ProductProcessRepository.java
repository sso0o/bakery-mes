package com.example.bakerymes.repository;

import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductProcessRepository extends JpaRepository<ProductProcess, Long> {
    List<ProductProcess> findByProductIdOrderByStepOrder(Long productId);

}
