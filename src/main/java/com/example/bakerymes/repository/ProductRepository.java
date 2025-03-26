package com.example.bakerymes.repository;

import com.example.bakerymes.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCode(String code);

    long countByCodeStartingWith(String prefix);

}