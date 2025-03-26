package com.example.bakerymes.service;

import com.example.bakerymes.model.Material;
import com.example.bakerymes.model.MaterialInbound;
import com.example.bakerymes.repository.MaterialInboundRepository;
import com.example.bakerymes.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialInboundService {

    private final MaterialInboundRepository inboundRepository;
    private final MaterialRepository materialRepository;

    // 입고 목록 조회
    public List<MaterialInbound> getAll(LocalDate start, LocalDate end) {
        if (start != null && end != null) {
            return inboundRepository.findByInboundDateBetween(start, end);
        }
        return inboundRepository.findAll();
    }

    // 입고 등록
    public MaterialInbound create(MaterialInbound inbound) {
        Material material = materialRepository.findById(inbound.getMaterial().getId())
                .orElseThrow(() -> new RuntimeException("해당 재료가 존재하지 않습니다."));

        inbound.setMaterial(material);

        if (inbound.getInboundDate() == null) {
            inbound.setInboundDate(LocalDate.now());
        }

        return inboundRepository.save(inbound);
    }
}
