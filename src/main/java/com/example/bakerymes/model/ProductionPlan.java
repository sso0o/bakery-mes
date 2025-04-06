package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Product product;

    @Column(nullable = false)
    private LocalDate planDate;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String status; // 예: PLANNED, ORDERED
}