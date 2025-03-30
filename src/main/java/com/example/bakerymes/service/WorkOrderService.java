package com.example.bakerymes.service;

import com.example.bakerymes.dto.WorkOrderRequest;
import com.example.bakerymes.model.Product;
import com.example.bakerymes.model.WorkOrder;
import com.example.bakerymes.model.WorkOrderStatus;
import com.example.bakerymes.repository.ProductRepository;
import com.example.bakerymes.repository.WorkOrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final ProductRepository productRepository;

//    // lot 자동 생성
//    public String generateProductLotNumber(Product product, LocalDate orderDate) {
//        String productCode = product.getCode(); // 예: PRD001
//        String datePart = orderDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
//        String prefix = productCode + "-" + datePart;
//
//        int count = workOrderRepository.countByProductLotNumberStartingWith(prefix);
//        String sequence = String.format("%03d", count + 1); // 001, 002...
//
//        return prefix + "-" + sequence; // 예: PRD001-20250328-001
//    }


    // 작업지시 생성
    @Transactional
    public WorkOrder createWorkOrder(WorkOrderRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("제품 없음"));


        WorkOrder order = WorkOrder.builder()
                .product(product)
                .orderDate(req.getOrderDate())
                .cycle(req.getCycle())
                .status(WorkOrderStatus.ORDERED)
                .build();

        return workOrderRepository.save(order);
    }

    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate", "id"));
    }
}
