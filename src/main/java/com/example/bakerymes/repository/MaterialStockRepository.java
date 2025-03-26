package com.example.bakerymes.repository;

import com.example.bakerymes.model.Material;
import com.example.bakerymes.model.MaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaterialStockRepository extends JpaRepository<MaterialStock, Long> {
    Optional<MaterialStock> findByMaterial(Material material);
}
