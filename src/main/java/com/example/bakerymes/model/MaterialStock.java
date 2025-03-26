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

    @OneToOne(optional = false)
    private Material material;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private LocalDate lastInboundDate;
}

