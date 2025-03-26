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

    @Lob
    private String recipeInfo; // 반죽량, 발효시간 등 (선택)
}
