package com.example.bakerymes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderSummaryResponse {
    private Long productId;
    private String productName;
    private Long totalOrderQuantity;

}