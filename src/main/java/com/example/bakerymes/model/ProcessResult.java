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
public class ProcessResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 작업지시에 대한 공정 수행인지
    @ManyToOne
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    // 어떤 공정인지 (Category.type = PROCESS)
    @ManyToOne
    @JoinColumn(name = "process_id", nullable = false)
    private Category process;

    // 어떤 LOT에 대해 수행한 공정인지
    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Double outputQuantity;    // 실제 생산 수량
    private Double defectQuantity;    // 불량 수량

    private String operator;          // 작업자 이름
    private String note;

    @Enumerated(EnumType.STRING)
    private Status status;            // ACTIVE, CANCELED
}
