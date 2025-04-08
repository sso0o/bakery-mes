package com.example.bakerymes.dto;

import com.example.bakerymes.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class OrderSummaryResponse {
    private Long productId;
    private String productName;
    private List<Order> orders;
    private Long totalOrderQuantity;
    private Long totalStockQuantity;
}