package com.example.bakerymes.service;

import com.example.bakerymes.model.Lot;
import com.example.bakerymes.model.Status;
import com.example.bakerymes.model.WorkOrder;
import com.example.bakerymes.repository.LotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class LotService {

    private final LotRepository lotRepository;

    // 롯트번호 자동 생성 메서드
    public String createLotNumber(String code, LocalDate inboundDate) {

        String datePart = inboundDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 예: 20250328
        String prefix = code + "-" + datePart;

        int count = lotRepository.countByLotNumberStartingWith(prefix); // 예: 이미 2건 → 다음은 003
        String sequence = String.format("%03d", count + 1);

        return prefix + "-" + sequence; // 예: PTP001-20250328-003
    }

    // 제품 작업지시 LOT 생성
    public void createProductLots(WorkOrder workOrder) {
        int cycle = workOrder.getCycle();
        String productCode = workOrder.getProduct().getCode();
        LocalDate orderDate = workOrder.getOrderDate();

        for (int i = 1; i <= cycle; i++) {
            String lotNumber = String.format("%s-%s-%03d",
                    productCode,
                    orderDate.toString().replace("-", ""),
                    i);

            Lot lot = Lot.builder()
                    .lotNumber(lotNumber)
                    .workOrder(workOrder)
                    .cycle(i)
                    .createdDate(LocalDate.now())
                    .status(Status.ACTIVE)
                    .build();

            lotRepository.save(lot);
        }
    }

}
