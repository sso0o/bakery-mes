package com.example.bakerymes.dto;

import lombok.Data;

@Data
public class ProcessMaterialUsageRequest {
    private Long workOrderId;
    private Long processId;     // Category ID, type = PROCESS
    private Long materialId;
    private Long lotId;
    private double quantity;
}