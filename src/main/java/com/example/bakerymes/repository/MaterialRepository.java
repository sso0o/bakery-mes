package com.example.bakerymes.repository;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    long countByCategory(Category category);

    @Query("SELECT m.code FROM Material m WHERE m.category = :category ORDER BY m.code DESC LIMIT 1")
    String findLastCodeByCategory(@Param("category") Category category);
}