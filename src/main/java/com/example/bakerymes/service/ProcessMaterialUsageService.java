package com.example.bakerymes.service;

import com.example.bakerymes.dto.ProcessMaterialUsageRequest;
import com.example.bakerymes.model.*;
import com.example.bakerymes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProcessMaterialUsageService {

    private final WorkOrderRepository workOrderRepository;
    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;
    private final LotRepository lotRepository;
    private final ProcessMaterialUsageRepository usageRepository;

    public ProcessMaterialUsage createUsage(ProcessMaterialUsageRequest req) {
        WorkOrder workOrder = workOrderRepository.findById(req.getWorkOrderId())
                .orElseThrow(() -> new IllegalArgumentException("작업지시 없음"));
        Category process = categoryRepository.findById(req.getProcessId())
                .orElseThrow(() -> new IllegalArgumentException("공정 없음"));
        Material material = materialRepository.findById(req.getMaterialId())
                .orElseThrow(() -> new IllegalArgumentException("자재 없음"));
        Lot lot = lotRepository.findById(req.getLotId())
                .orElseThrow(() -> new IllegalArgumentException("자재 롯트 없음"));

        ProcessMaterialUsage usage = ProcessMaterialUsage.builder()
                .workOrder(workOrder)
                .process(process)
                .material(material)
                .lot(lot)
                .quantity(req.getQuantity())
                .build();

        return usageRepository.save(usage);
    }
}
