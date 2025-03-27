package com.example.bakerymes.repository;

import com.example.bakerymes.model.ProcessMaterial;
import com.example.bakerymes.model.ProductProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessMaterialRepository extends JpaRepository<ProcessMaterial, Long> {
    List<ProcessMaterial> findByProductProcess(ProductProcess productProcess);
}
