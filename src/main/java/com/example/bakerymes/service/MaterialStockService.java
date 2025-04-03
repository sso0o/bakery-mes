package com.example.bakerymes.service;

import com.example.bakerymes.dto.MaterialStockResponse;
import com.example.bakerymes.model.MaterialStock;
import com.example.bakerymes.repository.MaterialStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialStockService {

    private final MaterialStockRepository stockRepository;

    // 자재 테이블을 기준으로 재고 정보와 입고 처리 정보를 가져오는 메서드
    public List<MaterialStockResponse> getAllStocks() {
        return stockRepository.getMaterialStockWithOptionalInbound();
    }

    public List<MaterialStock> getStocksByMaterialId(Long materialId) {

        return stockRepository.findByMaterialId(materialId);
    }
}
