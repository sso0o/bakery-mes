package com.example.bakerymes.repository;

import com.example.bakerymes.model.Lot;
import com.example.bakerymes.model.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LotRepository extends JpaRepository<Lot, Long> {
    Optional<Lot> findTopByLotNumberStartingWithOrderByLotNumberDesc(String prefix);

    int countByLotNumberStartingWith(String prefix);

    List<Lot> findByWorkOrder(WorkOrder workOrder);
}