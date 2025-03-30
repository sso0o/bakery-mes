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

    @Column(nullable = true)
    private Double capacity; // 자재 용량 (예: 20kg, 500ml 등)


    @Column(nullable = false)
    private String unit; // 입고 단위: kg, 봉지, L 등

    @Column(nullable = false)
    private double itemsPerUnit; // 박스 당 자재 개수 (예: 한 박스에 20개씩 들어 있음)

    @Column(nullable = true)
    private String inUnit; // 입고 단위

    @Column(nullable = true)
    private String outUnit; // 사용 단위

    @Column
    private String description; // 비고 또는 설명 (선택)
}
