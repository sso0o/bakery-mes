package com.example.bakerymes.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 제품을 만들지
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 작업일자 (지시 생성일)
    @Column(nullable = false)
    private LocalDate orderDate;

    // 몇 회전 생산할 건지
    @Column(nullable = false)
    private Integer cycle;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkOrderStatus status;

    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL)
    @JsonManagedReference("workorder-lot")
    private List<Lot> lots; // 해당 작업지시로 생성된 제품 LOT 목록
}