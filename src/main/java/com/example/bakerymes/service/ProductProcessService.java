package com.example.bakerymes.service;

import com.example.bakerymes.dto.ProductProcessRequest;
import com.example.bakerymes.model.*;
import com.example.bakerymes.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductProcessService {

    private final ProductProcessRepository ppRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final LotRepository lotRepository;
    private final WorkOrderRepository woRepository;

    // 전체 공정 조회 (제품별)
    public List<ProductProcess> getProcessesByProduct(Long productId) {
        return ppRepository.findByProductIdOrderByStepOrder(productId);
    }

    public ProductProcess findById(Long id) {
        return ppRepository.findById(id).orElse(null);
    }

    // 공정 등록
    public ProductProcess addProcessToProduct(ProductProcessRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("제품 없음"));

        Category process = categoryRepository.findById(req.getProcessId())
                .orElseThrow(() -> new IllegalArgumentException("공정 없음"));

        ProductProcess pp = ProductProcess.builder()
                .product(product)
                .process(process)
                .stepOrder(req.getStepOrder())
                .estimatedMinutes(req.getEstimatedMinutes())
                .build();

        return ppRepository.save(pp);
    }


    @Transactional
    public void copyProcesses(Long fromProductId, Long toProductId) {
        Product from = productRepository.findById(fromProductId).orElseThrow();
        Product to = productRepository.findById(toProductId).orElseThrow();

        List<ProductProcess> sourceList = ppRepository.findByProductIdOrderByStepOrder(from.getId());

        for (ProductProcess original : sourceList) {
            ProductProcess copied = ProductProcess.builder()
                    .product(to)
                    .process(original.getProcess())
                    .stepOrder(original.getStepOrder())
                    .estimatedMinutes(original.getEstimatedMinutes())
                    .build();
            ppRepository.save(copied);
        }
    }


    public void deleteProcess(Long id) {
        ppRepository.deleteById(id);
    }

    public ProductProcess updateProcess(Long id, ProductProcessRequest req) {
        ProductProcess target = ppRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 공정을 찾을 수 없습니다."));

        Category process = categoryRepository.findById(req.getProcessId())
                .orElseThrow(() -> new IllegalArgumentException("공정을 찾을 수 없습니다."));

        target.setProcess(process);
        target.setStepOrder(req.getStepOrder());
        target.setEstimatedMinutes(req.getEstimatedMinutes());

        return ppRepository.save(target);
    }


    public List<ProductProcess> getProcessesByLotId(Long lotId) {
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new IllegalArgumentException("해당 LOT이 존재하지 않습니다."));

        WorkOrder wo = woRepository.findById(lot.getWorkOrder().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 작업이 존재하지 않습니다."));

        Product product = productRepository.findById(wo.getProduct().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 제품이 존재하지 않습니다."));

        return ppRepository.findByProductIdOrderByStepOrder(product.getId());




    }
}
