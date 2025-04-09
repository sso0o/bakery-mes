package com.example.bakerymes.repository;

import com.example.bakerymes.model.WorkOrder;
import com.example.bakerymes.model.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {


    List<WorkOrder> findByStatusNotAndOrderDateLessThanEqual(WorkOrderStatus status, LocalDate today);

    WorkOrder findByPlan_Id(Long planId);
}