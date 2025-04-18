package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // 예: CR01, SB01

    @Column(nullable = false)
    private String name; // 예: 크루아상, 식빵

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; // 예: 케이크류, 쿠키류 등 제품 분류

    @Column(nullable = true)
    private Integer unitOutput; // 제품 1회 생산 기준 수량

    @Lob
    private String description; // 설명


}
