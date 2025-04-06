package com.example.bakerymes.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionPlanDto {
    private Long id;
    private Long productId;
    private String productName;
    private LocalDate planDate;
    private int quantity;
    private String status;
}
