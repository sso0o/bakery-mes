package com.example.bakerymes.service;

import com.example.bakerymes.model.Material;
import com.example.bakerymes.model.MaterialInbound;
import com.example.bakerymes.model.MaterialStock;
import com.example.bakerymes.repository.MaterialInboundRepository;
import com.example.bakerymes.repository.MaterialRepository;
import com.example.bakerymes.repository.MaterialStockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialInboundService {

    private final MaterialInboundRepository inboundRepository;
    private final MaterialRepository materialRepository;
    private final MaterialStockRepository stockRepository;

    // 입고 목록 조회
    public List<MaterialInbound> getAllInbounds(LocalDate start, LocalDate end) {
        if (start != null && end != null) {
            return inboundRepository.findByInboundDateBetween(start, end);
        }
        return inboundRepository.findAll();
    }

    // 입고 등록
    public MaterialInbound saveInbound(MaterialInbound inbound) {
        Material material = materialRepository.findById(inbound.getMaterial().getId())
                .orElseThrow(() -> new RuntimeException("해당 재료가 존재하지 않습니다."));

        inbound.setMaterial(material);

        if (inbound.getInboundDate() == null) {
            inbound.setInboundDate(LocalDate.now());
        }

        return inboundRepository.save(inbound);
    }
    // 입고처리 및 자재현황 테이블에 저장
    @Transactional
    public void processInbound(MaterialInbound inbound) {

        Material material = materialRepository.findById(inbound.getMaterial().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 자재 없음"));

        inboundRepository.save(inbound);


        MaterialStock stock = stockRepository.findByMaterial(material)
                .orElseGet(() -> MaterialStock.builder()
                        .material(material)
                        .quantity(0.0)
                        .unit(material.getUnit())
                        .lastInboundDate(inbound.getInboundDate())
                        .build());
        stock.setQuantity(stock.getQuantity() + inbound.getQuantity());
        stock.setLastInboundDate(inbound.getInboundDate());

        stockRepository.save(stock);
    }

}
