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
    private String lotNumber; // 자동 생성 예: MTP001-001

    @OneToOne
    @JoinColumn(name = "inbound_id", nullable = false)
    @JsonBackReference
    private MaterialInbound inbound; // 어떤 입고 이력에 해당하는지

    @Column(nullable = false)
    private LocalDate createdDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status; // 예: ACTIVE, CANCELED

}