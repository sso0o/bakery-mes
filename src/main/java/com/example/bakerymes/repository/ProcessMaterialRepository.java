package com.example.bakerymes.repository;

import com.example.bakerymes.model.ProcessMaterial;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProcessMaterialRepository extends JpaRepository<ProcessMaterial, Long> {
    List<ProcessMaterial> findByProductProcess(ProductProcess productProcess);

    @Query("SELECT pm FROM ProcessMaterial pm WHERE pm.productProcess.product = :product")
    List<ProcessMaterial> findByProduct(@Param("product") Product product);




}
