package com.example.bakerymes.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProductionPlanRequest {
    private Long productId;
    private LocalDate planDate;
    private int quantity;
}