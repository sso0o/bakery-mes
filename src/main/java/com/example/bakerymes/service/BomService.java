package com.example.bakerymes.service;

import com.example.bakerymes.dto.BOMItemResponse;
import com.example.bakerymes.model.ProcessMaterial;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductProcess;
import com.example.bakerymes.repository.ProcessMaterialRepository;
import com.example.bakerymes.repository.ProductProcessRepository;
import com.example.bakerymes.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BomService {

    private final ProductProcessRepository ppRepository;
    private final ProcessMaterialRepository pmRepository;


    public List<BOMItemResponse> getBOMByProduct(Long productId) {
        List<ProductProcess> processes = ppRepository.findByProductIdOrderByStepOrder(productId);
        List<BOMItemResponse> result = new ArrayList<>();

        for (ProductProcess pp : processes) {
            List<ProcessMaterial> materials = pmRepository.findByProductProcess(pp);
            for (ProcessMaterial pm : materials) {
                result.add(new BOMItemResponse(
                        pp.getId(),
                        pp.getProcess().getName(),
                        pp.getStepOrder(),
                        pm.getMaterial().getId(),
                        pm.getMaterial().getCode(),
                        pm.getMaterial().getName(),
                        pm.getQuantity(),
                        pm.getUnit()
                ));
            }
        }
        return result;
    }
}
