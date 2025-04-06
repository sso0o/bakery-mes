package com.example.bakerymes.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private LocalDate orderDate;
    private LocalDate dueDate;
    private List<OrderItemRequest> items;
}
