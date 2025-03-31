package com.example.bakerymes.repository;

import com.example.bakerymes.model.ProcessResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessResultRepository extends JpaRepository<ProcessResult, Long> {
    List<ProcessResult> findByWorkOrderId(Long workOrderId);
}