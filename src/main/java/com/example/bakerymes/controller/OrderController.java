package com.example.bakerymes.controller;

import com.example.bakerymes.dto.OrderRequest;
import com.example.bakerymes.dto.OrderSummaryResponse;
import com.example.bakerymes.model.Order;
import com.example.bakerymes.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    // 수주 전체 조회 (간단 리스트)
    @GetMapping
    public ResponseEntity<List<Order>> getOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 수주 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return orderService.getOrder(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // 수주 등록
    @PostMapping
    public ResponseEntity<Order> save(@RequestBody OrderRequest request) {
        Order savedOrder = orderService.saveOrder(request);
        return ResponseEntity.ok(savedOrder);
    }

    // 수주 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateOrder(@PathVariable Long id, @RequestBody OrderRequest request) {
        orderService.updateOrder(id, request);
        return ResponseEntity.ok().build();
    }

    // 수주 취소 처리
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<OrderSummaryResponse> getOrderSummary(@RequestParam Long productId) {
        return ResponseEntity.ok(orderService.getOrderSummary(productId));
    }


}
