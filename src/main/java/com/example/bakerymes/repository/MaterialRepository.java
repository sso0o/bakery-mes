package com.example.bakerymes.repository;

import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    long countByCategory(Category category);
    // 필요시 이름으로 조회 등 추가 가능
}