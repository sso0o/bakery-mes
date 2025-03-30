package com.example.bakerymes.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkOrderRequest {
    private Long productId;
    private LocalDate orderDate;
    private Integer cycle; // 회전 수 입력
}
