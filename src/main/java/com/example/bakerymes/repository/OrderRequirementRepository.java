package com.example.bakerymes.repository;

import com.example.bakerymes.model.OrderRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRequirementRepository extends JpaRepository<OrderRequirement, Long> {
}
