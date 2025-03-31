package com.example.bakerymes.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String lotNumber; // 자동 생성 예: PTP001-001

    @OneToOne
    @JoinColumn(name = "inbound_id")
    @JsonBackReference("inbound-lot")
    private MaterialInbound inbound; // 자재용일 경우만 연결

    @ManyToOne
    @JoinColumn(name = "work_order_id")
    @JsonBackReference("workorder-lot")
    private WorkOrder workOrder; // 제품용일 경우만 연결

    @Column(nullable = true)
    private Integer cycle; // 제품용 LOT에만 사용

    @Column(nullable = false)
    private LocalDate createdDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status; // 예: ACTIVE, CANCELED

    @ManyToOne
    @JoinColumn(name = "previous_lot_id")
    private Lot previousLot;

}