package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 제품 공정
    @ManyToOne(optional = false)
    private ProductProcess productProcess;

    // 소모되는 자재
    @ManyToOne(optional = false)
    private Material material;

    // 소모 수량
    @Column(nullable = false)
    private double quantity;

    // 단위 (Material.unit 복사해도 되고 직접 관리해도 됨)
    @Column(nullable = false)
    private String unit;
}
