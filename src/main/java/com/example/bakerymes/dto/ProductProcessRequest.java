package com.example.bakerymes.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductProcessRequest {
    private Long productId;
    private Long processId;
    private int stepOrder;
    private Integer estimatedMinutes;
}
