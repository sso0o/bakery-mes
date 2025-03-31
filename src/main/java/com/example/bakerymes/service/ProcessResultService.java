package com.example.bakerymes.service;

import com.example.bakerymes.model.Lot;
import com.example.bakerymes.model.ProcessResult;
import com.example.bakerymes.model.WorkOrder;
import com.example.bakerymes.repository.LotRepository;
import com.example.bakerymes.repository.ProcessResultRepository;
import com.example.bakerymes.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessResultService {

    private final ProcessResultRepository resultRepository;
    private final WorkOrderRepository workOrderRepository;
    private final LotRepository lotRepository;

    // 공정 결과 등록
    public ProcessResult save(ProcessResult result, Long workOrderId, Long inputLotId, Long outputLotId) {
        WorkOrder order = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("작업지시 없음"));
        Lot inputLot = lotRepository.findById(inputLotId)
                .orElseThrow(() -> new IllegalArgumentException("투입 LOT 없음"));
        Lot outputLot = lotRepository.findById(outputLotId)
                .orElseThrow(() -> new IllegalArgumentException("생성된 LOT 없음"));

        result.setWorkOrder(order);
//        result.setInputLot(inputLot);
//        result.setOutputLot(outputLot);

        return resultRepository.save(result);
    }

    // 작업지시별 결과 조회
    public List<ProcessResult> getByWorkOrder(Long workOrderId) {
        return resultRepository.findByWorkOrderId(workOrderId);
    }

    // 전체 조회
    public List<ProcessResult> getAll() {
        return resultRepository.findAll();
    }
}