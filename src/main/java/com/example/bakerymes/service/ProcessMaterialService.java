package com.example.bakerymes.service;

import com.example.bakerymes.model.Material;
import com.example.bakerymes.model.ProcessMaterial;
import com.example.bakerymes.model.ProductProcess;
import com.example.bakerymes.repository.MaterialRepository;
import com.example.bakerymes.repository.ProcessMaterialRepository;
import com.example.bakerymes.repository.ProductProcessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessMaterialService {

    private final ProcessMaterialRepository processMaterialRepository;
    private final ProductProcessRepository productProcessRepository;
    private final MaterialRepository materialRepository;

    public List<ProcessMaterial> getByProductProcess(Long productProcessId) {
        ProductProcess pp = productProcessRepository.findById(productProcessId)
                .orElseThrow(() -> new IllegalArgumentException("해당 제품 공정 없음"));
        return processMaterialRepository.findByProductProcess(pp);
    }

    public ProcessMaterial save(ProcessMaterial pm) {
        Material material = materialRepository.findById(pm.getMaterial().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 자재 없음"));

        ProductProcess productProcess = productProcessRepository.findById(pm.getProductProcess().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 공정 없음"));

        // ProcessMaterial에 찾은 Material과 ProductProcess 설정
        pm.setMaterial(material);
        pm.setProductProcess(productProcess);

        // ProcessMaterial 저장
        return processMaterialRepository.save(pm);
    }

    public void delete(Long id) {
        processMaterialRepository.deleteById(id);
    }
}
