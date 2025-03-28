package com.example.bakerymes.controller;

import com.example.bakerymes.model.MaterialInbound;
import com.example.bakerymes.service.MaterialInboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/inbound")
@RequiredArgsConstructor
public class MaterialInboundController {

    private final MaterialInboundService inboundService;

    @GetMapping
    public List<MaterialInbound> getInbounds(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        LocalDate start = (startDate != null) ? LocalDate.parse(startDate) : LocalDate.now();  // 날짜가 없으면 오늘 날짜
        LocalDate end = (endDate != null) ? LocalDate.parse(endDate) : LocalDate.now();  // 날짜가 없으면 오늘 날짜

        // 날짜가 없으면 전체 입고 내역을 반환, 있으면 날짜 범위에 맞게 필터링
        return inboundService.getInboundsByDateRange(start, end);
    }

    // 입고처리 + 재고 반영 + 롯트 생성
    @PostMapping
    public ResponseEntity<MaterialInbound> saveInbound(@RequestBody MaterialInbound inbound) {
        MaterialInbound mi = inboundService.processInbound(inbound); // 입고 저장 + 재고 반영
        return ResponseEntity.ok(mi);
    }

    // 입고 수정 + 재고 반영
    @PutMapping("/{id}")
    public ResponseEntity<MaterialInbound> updateInbound(@PathVariable Long id, @RequestBody MaterialInbound inbound) {
        MaterialInbound updatedInbound = inboundService.updateInbound(id, inbound);
        return ResponseEntity.ok(updatedInbound);
    }

    // 입고 취소 + 롯트 반영 + 재고 반영
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        inboundService.cancelInbound(id); // 입고 취소 + 재고 반영
    }
}
