package com.example.bakerymes.service;

import com.example.bakerymes.dto.WorkOrderRequest;
import com.example.bakerymes.model.*;
import com.example.bakerymes.repository.LotRepository;
import com.example.bakerymes.repository.ProductRepository;
import com.example.bakerymes.repository.WorkOrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final ProductRepository productRepository;
    private final LotRepository lotRepository;
    private final LotService lotService;

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

        workOrderRepository.save(order);

        // LOT 번호 prefix 생성
        String prefix = product.getCode() + "-" + req.getOrderDate().toString().replace("-", "");

        // 회전 수만큼 제품 롯트 생성
        for (int i = 1; i <= req.getCycle(); i++) {
            String lotNumber = lotService.createLotNumber(prefix);

            Lot lot = Lot.builder()
                    .lotNumber(lotNumber)
                    .workOrder(order)
                    .cycle(i)
                    .createdDate(LocalDate.now())
                    .status(Status.ACTIVE)
                    .build();

            lotRepository.save(lot);
        }

        return order;
    }

    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate", "id"));
    }

    // 작업지시 취소
    @Transactional
    public void cancelWorkOrder(Long workOrderId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("작업지시 없음"));

        // 이미 취소되었으면 예외 방지
        if (workOrder.getStatus() == WorkOrderStatus.CANCELED) {
            throw new IllegalStateException("이미 취소된 작업지시입니다.");
        }

        // 상태 변경
        workOrder.setStatus(WorkOrderStatus.CANCELED);
        workOrderRepository.save(workOrder);

        // 연결된 LOT도 취소 처리
        List<Lot> lots = lotRepository.findByWorkOrder(workOrder);
        for (Lot lot : lots) {
            lot.setStatus(Status.CANCELED);
        }
        lotRepository.saveAll(lots);
    }
}
