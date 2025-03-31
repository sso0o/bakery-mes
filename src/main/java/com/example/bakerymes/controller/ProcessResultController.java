package com.example.bakerymes.controller;

import com.example.bakerymes.model.ProcessResult;
import com.example.bakerymes.service.ProcessResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/process-results")
public class ProcessResultController {

    private final ProcessResultService resultService;

    // 등록
    @PostMapping
    public ResponseEntity<ProcessResult> save(
            @RequestParam Long workOrderId,
            @RequestParam Long inputLotId,
            @RequestParam Long outputLotId,
            @RequestBody ProcessResult result
    ) {
        return ResponseEntity.ok(resultService.save(result, workOrderId, inputLotId, outputLotId));
    }

    // 전체 조회
    @GetMapping
    public ResponseEntity<List<ProcessResult>> getAll() {
        return ResponseEntity.ok(resultService.getAll());
    }

    // 특정 작업지시 기준 조회
    @GetMapping("/work-order/{workOrderId}")
    public ResponseEntity<List<ProcessResult>> getByWorkOrder(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(resultService.getByWorkOrder(workOrderId));
    }
}