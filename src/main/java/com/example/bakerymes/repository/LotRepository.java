package com.example.bakerymes.repository;

import com.example.bakerymes.model.Lot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LotRepository extends JpaRepository<Lot, Long> {
    int countByLotNumberStartingWith(String prefix);
}