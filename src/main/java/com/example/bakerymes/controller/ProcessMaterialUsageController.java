package com.example.bakerymes.controller;

import com.example.bakerymes.dto.ProcessMaterialUsageRequest;
import com.example.bakerymes.model.ProcessMaterialUsage;
import com.example.bakerymes.service.ProcessMaterialUsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/process-usage")
public class ProcessMaterialUsageController {

    private final ProcessMaterialUsageService usageService;

    @PostMapping
    public ProcessMaterialUsage createUsage(@RequestBody ProcessMaterialUsageRequest req) {
        return usageService.createUsage(req);
    }
}