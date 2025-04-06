package com.example.bakerymes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BOMItemResponse {
    private Long processId;
    private String processName;
    private int stepOrder;

    private Long materialId;
    private String materialCode;
    private String materialName;
    private double quantity;
    private String unit;
}
