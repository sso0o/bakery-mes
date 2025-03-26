package com.example.bakerymes.repository;

import com.example.bakerymes.model.MaterialInbound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MaterialInboundRepository extends JpaRepository<MaterialInbound, Long> {
    List<MaterialInbound> findByInboundDateBetween(LocalDate startDate, LocalDate endDate);
}