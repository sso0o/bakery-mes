package com.example.bakerymes.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialInbound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 입고 대상 재료
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    // 입고 수량
    @Column(nullable = false)
    private double quantity;

    // 입고 단위 (kg, L 등) – Material.unit과 동일하게 맞춰야 함
    @Column(nullable = false)
    private String unit;

    // 박스 당 자재 개수 (예: 한 박스에 20개씩 들어 있음)
    @Column(nullable = false)
    private double itemsPerUnit;

    // 총 입고 개수 (박스 수량에 해당하는 자재 개수)
    @Column(nullable = false)
    private double totalQuantity;  // 총 개수 (박스 수량 * 박스 당 자재 수, kg이면 단순 수량)

    // 입고 일자
    @Column(nullable = false)
    private LocalDate inboundDate;

    // 입고 담당자 (선택)
    @Column
    private String receivedBy;

    // 비고
    @Column
    private String note;

    @OneToOne(mappedBy = "inbound", cascade = CascadeType.ALL)
    @JsonManagedReference("inbound-lot")
    private Lot lot;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status; // 예: ACTIVE, CANCELED
}
