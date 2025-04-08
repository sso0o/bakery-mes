package com.example.bakerymes.service;

import com.example.bakerymes.dto.OrderItemRequest;
import com.example.bakerymes.dto.OrderRequest;
import com.example.bakerymes.dto.OrderSummaryResponse;
import com.example.bakerymes.model.*;
import com.example.bakerymes.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository oiRepository;
    private final OrderRequirementRepository orRepository;
    private final ProductRepository productRepository;
    private final ProcessMaterialRepository pmRepository;
    private final ProductStockRepository psRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrder(Long id) {
        return orderRepository.findById(id);
    }

    // 오더 넘버 생성
    private String generateOrderNo() {
        long count = orderRepository.count() + 1;
        return String.format("ORD%05d", count); // 예: ORD00001
    }

    public OrderSummaryResponse getOrderSummary(Long productId) {
        // 제품 정보
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 제품입니다 "));

        // 해당 제품을 포함한 수주 목록
        List<Order> orders = oiRepository.findOrdersByProductId(productId);
        // 해당 제품의 총 수주 수량 계산
        Long totalOrderQuantity = oiRepository.sumQuantityByProductId(productId);
        // 재고 수량 (예: MaterialStock or ProductStock 기준)
        Long totalStockQuantity = psRepository.sumStockByProductId(productId);

        return new OrderSummaryResponse(
                productId,
                product.getName(),
                orders,
                totalOrderQuantity != null ? totalOrderQuantity : 0,
                totalStockQuantity != null ? totalStockQuantity : 0
        );
    }


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
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 제품입니다 "));

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


    // 수주 취소 비즈니스 로직
    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("수주를 찾을 수 없습니다."));

        if (!order.getStatus().equals("RECEIVED")) {
            throw new IllegalStateException("RECEIVED 상태만 취소할 수 있습니다.");
        }

        order.setStatus("CANCELED");
        orderRepository.save(order);
    }



    @Transactional
    public void updateOrder(Long id, OrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("수주를 찾을 수 없습니다."));

        if (!"RECEIVED".equals(order.getStatus())) {
            throw new IllegalStateException("RECEIVED 상태만 수정할 수 있습니다.");
        }

        // 기존 수주 정보 업데이트
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setOrderDate(request.getOrderDate());
        order.setDueDate(request.getDueDate());


        // 기존 아이템 삭제 후 다시 등록
        deleteItemsByOrderId(order.getId());    // 기존 아이템 삭제
        List<OrderItem> newItems = request.getItems().stream()
                .map(dto -> {
                    // 제품 조회
                    Product product = productRepository.findById(dto.getProductId())
                            .orElseThrow(() -> new RuntimeException("제품 없음"));

                    // 새 OrderItem 생성
                    OrderItem item = OrderItem.builder()
                            .order(order)
                            .product(product)
                            .quantity(dto.getQuantity())
                            .orderRequirements(new ArrayList<>())  // OrderItem에 자재 요구사항을 위한 리스트 초기화
                            .build();

                    // BOM을 조회하고 자재 요구사항을 추가
                    List<ProcessMaterial> bom = pmRepository.findByProduct(product);
                    for (ProcessMaterial pm : bom) {
                        Material material = pm.getMaterial();
                        double requiredQty = pm.getQuantity() * dto.getQuantity(); // 제품 수량에 맞춰 자재 소요량 계산

                        // 새로운 OrderRequirement 생성 및 추가
                        OrderRequirement requirement = OrderRequirement.builder()
                                .orderItem(item)
                                .material(material)
                                .requiredQuantity(requiredQty)
                                .build();
                        item.getOrderRequirements().add(requirement);  // OrderItem에 자재 요구사항 추가
                    }

                    return item;
                })
                .collect(Collectors.toList());

        order.setItems(newItems);  // 새로운 OrderItems 설정

        // 저장
        orderRepository.save(order);
    }


    @Transactional
    public void deleteItemsByOrderId(Long orderId) {
        // 먼저 orderId로 연결된 OrderItem의 OrderRequirement 삭제
        List<OrderItem> items = oiRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            // 해당 OrderItem에 연결된 모든 OrderRequirement 삭제
            orRepository.deleteAll(item.getOrderRequirements());
        }

        // 그 후 OrderItem 삭제
        oiRepository.deleteByOrderId(orderId);
    }
}
