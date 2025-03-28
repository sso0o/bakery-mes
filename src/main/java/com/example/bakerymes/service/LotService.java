package com.example.bakerymes.service;

import com.example.bakerymes.repository.LotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class LotService {

    private final LotRepository lotRepository;

    // 롯트번호 자동 생성 메서드
    public String generateLotNumber(String code, LocalDate inboundDate) {

        String datePart = inboundDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 예: 20250328
        String prefix = code + "-" + datePart;

        int count = lotRepository.countByLotNumberStartingWith(prefix); // 예: 이미 2건 → 다음은 003
        String sequence = String.format("%03d", count + 1);

        return prefix + "-" + sequence; // 예: MTP001-20250328-003
    }

    // 🔢 롯트번호 자동 생성 메서드
//    public String generateLotNumber() {
//        Material material = materialRepository.findById(inbound.getMaterial().getId())
//                .orElseThrow(() -> new IllegalArgumentException("해당 자재 없음"));
//        String datePart = inboundDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 예: 20250328
//        String prefix = materialCode + "-" + datePart;
//
//        int count = lotRepository.countByLotNumberStartingWith(prefix); // 예: 이미 2건 → 다음은 003
//        String sequence = String.format("%03d", count + 1);
//
//        return prefix + "-" + sequence; // 예: MTP001-20250328-003
//    }
}
