package com.example.bakerymes.service;

import com.example.bakerymes.dto.OrderItemRequest;
import com.example.bakerymes.dto.OrderRequest;
import com.example.bakerymes.dto.OrderSummaryResponse;
import com.example.bakerymes.model.*;
import com.example.bakerymes.repository.OrderRepository;
import com.example.bakerymes.repository.ProcessMaterialRepository;
import com.example.bakerymes.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProcessMaterialRepository pmRepository;

    // 수주 등록 처리 메서드
    @Transactional
    public Order saveOrder(OrderRequest request) {
        Order order = Order.builder()
                .orderNo(generateOrderNo())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .orderDate(request.getOrderDate())
                .dueDate(request.getDueDate())
                .status("RECEIVED")
                .items(new ArrayList<>())
                .build();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 제품"));

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .orderRequirements(new ArrayList<>())
                    .build();

            // BOM 조회
            List<ProcessMaterial> bom = pmRepository.findByProduct(product);
            for (ProcessMaterial pm : bom) {
                Material material = pm.getMaterial();
                double requiredQty = pm.getQuantity() * itemReq.getQuantity();

                OrderRequirement requirement = OrderRequirement.builder()
                        .orderItem(item)
                        .material(material)
                        .requiredQuantity(requiredQty)
                        .build();

                item.getOrderRequirements().add(requirement);
            }

            order.getItems().add(item);
        }

        return orderRepository.save(order);
    }

    // 오더 넘버 생성
    private String generateOrderNo() {
        long count = orderRepository.count() + 1;
        return String.format("ORD%05d", count); // 예: ORD00001
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrder(Long id) {
        return orderRepository.findById(id);
    }

    // 수주 취소 비즈니스 로직
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("수주를 찾을 수 없습니다."));

        if (!order.getStatus().equals("RECEIVED")) {
            throw new IllegalStateException("RECEIVED 상태만 취소할 수 있습니다.");
        }

        order.setStatus("CANCELED");
        orderRepository.save(order);
    }


    public OrderSummaryResponse getOrderSummary(Long productId) {
        return orderRepository.findOrderSummaryByProductId(productId);
    }

}
