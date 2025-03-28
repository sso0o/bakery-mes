package com.example.bakerymes.repository;

import com.example.bakerymes.dto.MaterialStockResponse;
import com.example.bakerymes.model.Material;
import com.example.bakerymes.model.MaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MaterialStockRepository extends JpaRepository<MaterialStock, Long> {
    Optional<MaterialStock> findByMaterial(Material material);

    // 자재와 재고 테이블을 조인해서 조회
    @Query("SELECT new com.example.bakerymes.dto.MaterialStockResponse(" +
            "m.id, " +
            "m.code, " +
            "m.name, " +
            "m.manufacturer, " +
            "m.unit, " +
            "COALESCE(i.itemsPerUnit, 0), " +  // itemsPerUnit은 입고 정보
            "m.category.name, " +  // 카테고리명
            "COALESCE(s.quantity, 0), " +  // 재고 수량, 없으면 0
            "COALESCE(s.quantity * COALESCE(i.itemsPerUnit, 0), 0), " +  // 총 수량, itemsPerUnit이 null인 경우 0으로 계산
            "s.lastInboundDate) " +  // 마지막 입고일
            "FROM Material m " +
            "LEFT JOIN MaterialInbound i on m.id = i.material.id " +
            "LEFT JOIN MaterialStock s ON m.id = s.material.id")
    List<MaterialStockResponse> getMaterialStockWithOptionalInbound();
}
