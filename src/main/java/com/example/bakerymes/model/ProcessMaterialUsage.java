package com.example.bakerymes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessMaterialUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 작업지시에 대해
    @ManyToOne
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    // 어떤 공정에서
    @ManyToOne
    @JoinColumn(name = "process_id", nullable = false)
    private Category process; // type = PROCESS

    // 어떤 자재를
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    // 어떤 자재 LOT을 사용했는지
    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    // 사용 수량
    @Column(nullable = false)
    private double quantity;
}