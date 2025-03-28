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
    public List<MaterialInbound> getInboundsByDateRange(LocalDate start, LocalDate end) {
        return inboundRepository.findByInboundDateBetween(start, end);
    }


    // 입고처리 및 자재현황 테이블에 저장
    @Transactional
    public MaterialInbound processInbound(MaterialInbound inbound) {

        Material material = materialRepository.findById(inbound.getMaterial().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 자재 없음"));
        inboundRepository.save(inbound);

        // 재고 반영
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

        return inbound; // 입고 저장
    }



    // 입고 수정
    @Transactional
    public MaterialInbound updateInbound(Long id, MaterialInbound ni) {
        MaterialInbound oi = inboundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("입고 내역을 찾을 수 없습니다."));

        // 기존 수량 차이를 계산하여 재고를 수정
        double quantityDifference = ni.getQuantity() - oi.getQuantity();

        // 기존 입고 내역을 수정
        oi.setQuantity(ni.getQuantity());
        oi.setUnit(ni.getUnit());
        oi.setItemsPerUnit(ni.getItemsPerUnit());
        oi.setTotalQuantity(ni.getTotalQuantity());
        oi.setInboundDate(ni.getInboundDate());
        oi.setReceivedBy(ni.getReceivedBy());
        oi.setNote(ni.getNote());

        inboundRepository.save(oi); // 수정된 입고 내역 저장

        // 재고 업데이트
        Material material = oi.getMaterial();
        MaterialStock stock = stockRepository.findByMaterial(material)
                .orElseThrow(() -> new IllegalArgumentException("해당 자재의 재고 정보가 없습니다."));

        stock.setQuantity(stock.getQuantity() + quantityDifference);
        stock.setLastInboundDate(ni.getInboundDate());

        stockRepository.save(stock); // 재고 저장

        return oi;
    }

    @Transactional
    public void deleteInbound(Long id) {
        MaterialInbound inbound = inboundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 정보가 없습니다."));

        // 재고 조회
        Material material = inbound.getMaterial();
        MaterialStock stock = stockRepository.findByMaterial(material)
                .orElseThrow(() -> new IllegalArgumentException("해당 자재의 재고 정보가 없습니다."));

        // 재고에서 입고된 수량 차감
        double quantityToDeduct = inbound.getQuantity(); // 삭제된 입고 내역의 수량
        stock.setQuantity(stock.getQuantity() - quantityToDeduct); // 재고에서 차감

        // 재고 정보 저장
        stockRepository.save(stock);
        // 입고 내역 삭제
        inboundRepository.delete(inbound);
    }
}
