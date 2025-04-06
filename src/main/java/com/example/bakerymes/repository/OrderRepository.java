package com.example.bakerymes.repository;

import com.example.bakerymes.dto.OrderSummaryResponse;
import com.example.bakerymes.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT new com.example.bakerymes.dto.OrderSummaryResponse(i.product.id, i.product.name, SUM(i.quantity)) " +
            "FROM Order o JOIN o.items i " +
            "WHERE i.product.id = :productId AND o.status != 'CANCELLED' " +
            "GROUP BY i.product.id, i.product.name")
    OrderSummaryResponse findOrderSummaryByProductId(@Param("productId") Long productId);
}
