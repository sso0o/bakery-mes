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
public class MaterialInbound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 입고 대상 재료
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    // 입고 수량
    @Column(nullable = false)
    private double quantity;

    // 입고 단위 (kg, L 등) – Material.unit과 동일하게 맞춰야 함
    @Column(nullable = false)
    private String unit;

    // 입고 일자
    @Column(nullable = false)
    private LocalDate inboundDate;

    // 입고 담당자 (선택)
    @Column
    private String receivedBy;

    // 비고
    @Column
    private String note;
}
