package com.example.bakerymes.service;

import com.example.bakerymes.model.*;
import com.example.bakerymes.repository.LotRepository;
import com.example.bakerymes.repository.MaterialInboundRepository;
import com.example.bakerymes.repository.MaterialRepository;
import com.example.bakerymes.repository.MaterialStockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialInboundService {

    private final MaterialInboundRepository inboundRepository;
    private final MaterialRepository materialRepository;
    private final MaterialStockRepository stockRepository;
    private final LotRepository lotRepository;

    private final LotService lotService;

    // 입고 목록 조회
    public List<MaterialInbound> getInboundsByDateRange(LocalDate start, LocalDate end) {
        return inboundRepository.findByInboundDateBetween(start, end);
    }


    // 입고처리 및 자재현황 테이블에 저장
    @Transactional
    public MaterialInbound processInbound(MaterialInbound inbound) {

        Material material = materialRepository.findById(inbound.getMaterial().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 자재 없음"));
        inbound.setStatus(Status.ACTIVE);
        inboundRepository.save(inbound);

        // 롯트 번호 prefix 생성
        String datePart = inbound.getInboundDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "LOT" + material.getCode() + "-" + datePart;

        // 롯트 번호 생성
        String lotNumber = lotService.createLotNumber(prefix);

        // 롯드 생성 후 저장
        Lot lot = Lot.builder()
                .lotNumber(lotNumber)
                .inbound(inbound)
                .status(Status.ACTIVE)
                .createdDate(LocalDate.now())
                .build();
        lotRepository.save(lot);
        inbound.setLot(lot); // 양방향 연결


        // 재고 반영
        MaterialStock stock = stockRepository.findByMaterial(material)
                .orElseGet(() -> MaterialStock.builder()
                        .material(material)
                        .quantity(0.0)
                        .unit(material.getUnit())
                        .lastInboundDate(inbound.getInboundDate())
                        .build());
        stock.setQuantity(stock.getQuantity() + (inbound.getQuantity() * inbound.getMaterial().getCapacity()));
        stock.setLastInboundDate(inbound.getInboundDate());

        stockRepository.save(stock);

        return inbound; // 입고 저장
    }



    // 입고 수정
    @Transactional
    public MaterialInbound updateInbound(Long id, MaterialInbound ni) {
        MaterialInbound oi = inboundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("입고 내역을 찾을 수 없습니다."));

        // 자재 수정 불가
        if (!oi.getMaterial().getId().equals(ni.getMaterial().getId())) {
            throw new IllegalArgumentException("자재는 수정할 수 없습니다. 롯트와 연결되어 있습니다.");
        }
        // 입고일 수정 불가
        if (!oi.getInboundDate().equals(ni.getInboundDate())) {
            throw new IllegalArgumentException("입고일은 수정할 수 없습니다. 롯트와 연결되어 있습니다.");
        }

        // 기존 수량 차이를 계산하여 재고를 수정
        double quantityDifference = ni.getQuantity() - oi.getQuantity();

        // 기존 입고 내역을 수정
        oi.setQuantity(ni.getQuantity());
        oi.setUnit(ni.getUnit());
        oi.setItemsPerUnit(ni.getItemsPerUnit());
        oi.setTotalQuantity(ni.getTotalQuantity());
        oi.setReceivedBy(ni.getReceivedBy());
        oi.setNote(ni.getNote());

        inboundRepository.save(oi); // 수정된 입고 내역 저장

        // 재고 업데이트
        Material material = oi.getMaterial();
        MaterialStock stock = stockRepository.findByMaterial(material)
                .orElseThrow(() -> new IllegalArgumentException("해당 자재의 재고 정보가 없습니다."));

        double capacity = material.getCapacity() != null ? material.getCapacity() : 1.0;
        stock.setQuantity(stock.getQuantity() + (quantityDifference * capacity));
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

    // 입고 취소
    @Transactional
    public void cancelInbound(Long inboundId) {
        MaterialInbound inbound = inboundRepository.findById(inboundId)
                .orElseThrow(() -> new IllegalArgumentException("입고 내역을 찾을 수 없습니다."));

        // 이미 취소된 경우 방지
        if (inbound.getStatus() == Status.CANCELED) {
            throw new IllegalStateException("이미 취소된 입고입니다.");
        }
        inbound.setStatus(Status.CANCELED);
        inboundRepository.save(inbound);


        // 롯트 상태 변경
        Lot lot = inbound.getLot();
        if (lot != null) {
            lot.setStatus(Status.CANCELED);
            lotRepository.save(lot);
        }

        // 재고 차감
        MaterialStock stock = stockRepository.findByMaterial(inbound.getMaterial())
                .orElseThrow(() -> new IllegalArgumentException("해당 자재의 재고 정보가 없습니다."));

        stock.setQuantity(stock.getQuantity() - inbound.getQuantity());
        stockRepository.save(stock);
    }
}
