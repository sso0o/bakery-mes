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
    public List<MaterialInbound> getAllInbounds(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end
    ) {
        LocalDate s = (start != null) ? LocalDate.parse(start) : null;
        LocalDate e = (end != null) ? LocalDate.parse(end) : null;
        return inboundService.getAllInbounds(s, e);
    }

    // 입고처리 ( 입고 + 재고추가 )
    @PostMapping
    public ResponseEntity<MaterialInbound> saveInbound(@RequestBody MaterialInbound inbound) {
        inboundService.processInbound(inbound); // 입고 저장 + 재고 반영
        return ResponseEntity.ok(inbound);
    }
}
