package com.example.bakerymes.controller;

import com.example.bakerymes.model.ProcessMaterial;
import com.example.bakerymes.service.ProcessMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/process-materials")
public class ProcessMaterialController {

    private final ProcessMaterialService processMaterialService;

    @GetMapping("/{productProcessId}")
    public List<ProcessMaterial> getByProductProcess(@PathVariable Long productProcessId) {
        return processMaterialService.getByProductProcess(productProcessId);
    }

    @PostMapping
    public ProcessMaterial create(@RequestBody ProcessMaterial pm) {
        return processMaterialService.save(pm);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        processMaterialService.delete(id);
    }
}
