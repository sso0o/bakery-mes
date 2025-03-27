package com.example.bakerymes.controller;

import com.example.bakerymes.dto.ProductProcessRequest;
import com.example.bakerymes.model.ProductProcess;
import com.example.bakerymes.service.ProductProcessService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product-process")
public class ProductProcessController {

    private final ProductProcessService ppService;

    @GetMapping("/{productId}")
    public List<ProductProcess> getByProduct(@PathVariable Long productId) {
        return ppService.getProcessesByProduct(productId);
    }

    @PostMapping
    public ProductProcess register(@RequestBody ProductProcessRequest request) {
        return ppService.addProcessToProduct(request);
    }

    @PutMapping("/reorder")
    @Transactional
    public void reorder(@RequestBody List<ProductProcess> list) {
        for (ProductProcess updated : list) {
            ProductProcess target = ppService.findById(updated.getId());
            target.setStepOrder(updated.getStepOrder());
        }
    }

    @PostMapping("/copy")
    public ResponseEntity<?> copyProcess(
            @RequestParam Long fromProductId,
            @RequestParam Long toProductId
    ) {
        ppService.copyProcesses(fromProductId, toProductId);
        return ResponseEntity.ok("복사 완료");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ppService.deleteProcess(id);
    }

    @PutMapping("/{id}")
    public ProductProcess update(@PathVariable Long id, @RequestBody ProductProcessRequest dto) {
        return ppService.updateProcess(id, dto);
    }



}
