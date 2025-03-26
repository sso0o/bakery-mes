package com.example.bakerymes.controller;

import com.example.bakerymes.model.MaterialInbound;
import com.example.bakerymes.service.MaterialInboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/inbound")
@RequiredArgsConstructor
public class MaterialInboundController {

    private final MaterialInboundService inboundService;

    @GetMapping
    public List<MaterialInbound> getAll(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end
    ) {
        LocalDate s = (start != null) ? LocalDate.parse(start) : null;
        LocalDate e = (end != null) ? LocalDate.parse(end) : null;
        return inboundService.getAll(s, e);
    }

    @PostMapping
    public ResponseEntity<MaterialInbound> createMaterialInbound(@RequestBody MaterialInbound inbound) {
        // 받은 inbound 객체에서 receivedBy 값 확인
        System.out.println("입고 처리 담당자: " + inbound.getReceivedBy());  // 로그로 확인

        MaterialInbound savedInbound = inboundService.create(inbound);
        return ResponseEntity.ok(savedInbound);
    }
}
