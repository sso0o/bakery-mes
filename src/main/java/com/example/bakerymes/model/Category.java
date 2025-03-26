package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // 예: PRODUCT, DEFECT, PROCESS

    @Column(nullable = false)
    private String name;

    private String codePrefix;

    private String description;
}