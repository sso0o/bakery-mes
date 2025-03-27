package com.example.bakerymes.service;

import com.example.bakerymes.dto.ProductProcessRequest;
import com.example.bakerymes.model.Category;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.ProductProcess;
import com.example.bakerymes.repository.CategoryRepository;
import com.example.bakerymes.repository.ProductProcessRepository;
import com.example.bakerymes.repository.ProductRepository;
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

    // 전체 공정 조회 (제품별)
    public List<ProductProcess> getProcessesByProduct(Long productId) {
        return ppRepository.findByProductIdOrderByStepOrder(productId);
    }

    public ProductProcess findById(Long id) {
        return ppRepository.findById(id).orElse(null);
    }

    // 공정 등록
    public ProductProcess addProcessToProduct(ProductProcessRequest dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("제품 없음"));

        Category process = categoryRepository.findById(dto.getProcessId())
                .orElseThrow(() -> new IllegalArgumentException("공정 없음"));

        ProductProcess pp = ProductProcess.builder()
                .product(product)
                .process(process)
                .stepOrder(dto.getStepOrder())
                .estimatedMinutes(dto.getEstimatedMinutes())
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

    public ProductProcess updateProcess(Long id, ProductProcessRequest dto) {
        ProductProcess target = ppRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 공정을 찾을 수 없습니다."));

        Category process = categoryRepository.findById(dto.getProcessId())
                .orElseThrow(() -> new IllegalArgumentException("공정을 찾을 수 없습니다."));

        target.setProcess(process);
        target.setStepOrder(dto.getStepOrder());
        target.setEstimatedMinutes(dto.getEstimatedMinutes());

        return ppRepository.save(target);
    }


}
