package com.example.bakerymes.repository;

import com.example.bakerymes.model.Order;
import com.example.bakerymes.model.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderItem oi WHERE oi.order.id = :orderId")
    void deleteByOrderId(@Param("orderId") Long orderId);


    @Query("SELECT DISTINCT oi.order FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.status = 'RECEIVED'")
    List<Order> findOrdersByProductId(@Param("productId") Long productId);

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.status = 'RECEIVED'")
    Long sumQuantityByProductId(@Param("productId") Long productId);
}
