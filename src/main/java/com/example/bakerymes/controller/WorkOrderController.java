package com.example.bakerymes.controller;

import com.example.bakerymes.dto.WorkOrderRequest;
import com.example.bakerymes.model.WorkOrder;
import com.example.bakerymes.service.WorkOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.getAllWorkOrders();
    }

    @PostMapping
    public WorkOrder saveWorkOrder(@RequestBody WorkOrderRequest req) {
        return workOrderService.createWorkOrder(req);
    }

    @PostMapping("/convert/{planId}")
    public WorkOrder convertToWorkOrder(@PathVariable Long planId) {
        return workOrderService.convertPlan(planId); // planId 기반으로 WorkOrder + LOT 생성
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelWorkOrder(@PathVariable Long id) {
        workOrderService.cancelWorkOrder(id);
        return ResponseEntity.ok().build();
    }


}