package com.example.bakerymes.controller;

import com.example.bakerymes.model.Lot;
import com.example.bakerymes.service.LotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lots")
public class LotController {

    private final LotService lotService;

    // 생산실적용 유효 LOT 목록 조회
    @GetMapping("/valid-for-result")
    public List<Lot> getValidLotsForResult() {
        return lotService.getValidLotsForProductionResult();
    }

}