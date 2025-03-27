package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Product product;

    @ManyToOne(optional = false)
    private Category process; // type = PROCESS 인 Category

    @Column(nullable = false)
    private int stepOrder; // 공정 순서

    private Integer estimatedMinutes; // 소요 시간 (선택)
}
