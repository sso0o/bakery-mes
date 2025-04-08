package com.example.bakerymes.repository;

import com.example.bakerymes.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderRepository extends JpaRepository<Order, Long> {


}
