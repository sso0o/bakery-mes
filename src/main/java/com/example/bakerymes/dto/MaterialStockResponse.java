package com.example.bakerymes.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialStockResponse {
    private Long materialId;
    private String code;
    private String name;
    private String manufacturer;
    private String unit;
    private double itemsPerUnit;
    private String categoryName;
    private double quantity; // 재고 수량
    private double totalQuantity; // 입고 수량 * itemsPerUnit
    private LocalDate lastInboundDate;

}
