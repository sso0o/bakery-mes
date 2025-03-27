package com.example.bakerymes.repository;

import com.example.bakerymes.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByType(String type);

    long countByType(String type);

    Optional<Category> findTopByTypeOrderByCodePrefixDesc(String type);
}