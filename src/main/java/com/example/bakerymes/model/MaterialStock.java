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
public class MaterialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // (자재는 여러 재고를 가질 수 있음)
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    // 현재 재고 수량
    @Column(nullable = false)
    private double quantity;

    // 단위
    @Column(nullable = false)
    private String unit;

    // 마지막 입고일
    @Column(nullable = false)
    private LocalDate lastInboundDate;
}
