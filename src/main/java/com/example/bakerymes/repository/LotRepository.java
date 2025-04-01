package com.example.bakerymes.repository;

import com.example.bakerymes.model.Lot;
import com.example.bakerymes.model.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LotRepository extends JpaRepository<Lot, Long> {
    Optional<Lot> findTopByLotNumberStartingWithOrderByLotNumberDesc(String prefix);

    int countByLotNumberStartingWith(String prefix);

    List<Lot> findByWorkOrder(WorkOrder workOrder);

    @Query("SELECT l FROM Lot l " +
            "JOIN FETCH l.workOrder wo " +
            "JOIN FETCH wo.product p " +
            "WHERE l.status != 'DONE' " +
            "AND wo.status != 'CANCELED' " +
            "AND wo.orderDate <= :today")
    List<Lot> findValidLotsForProductionResult(@Param("today") LocalDate today);


}