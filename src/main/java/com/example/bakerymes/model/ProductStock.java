package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 제품의 재고인지
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // 현재 재고 수량
    private Long quantity;

    // 마지막 변경일
    private LocalDateTime lastUpdatedDate;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdatedDate = LocalDateTime.now();
    }
}