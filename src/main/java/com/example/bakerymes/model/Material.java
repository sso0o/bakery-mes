package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // 예: M001, M002

    @Column(nullable = false)
    private String name; // 예: 밀가루, 설탕

    @Column(nullable = false)
    private String manufacturer; // 공급 회사명

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; // 재료 종류 (Category.type = "MaterialType")

    @Column(nullable = false)
    private String unit; // 단위: kg, 봉지, L 등

    @Column
    private String description; // 비고 또는 설명 (선택)
}
