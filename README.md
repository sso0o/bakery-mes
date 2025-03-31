# 🍞 제과공장 생산관리 MES 시스템 (Spring Boot + React)

제과 공장의 생산 이력 추적 및 작업지시 관리를 위한 Java 기반 MES 시스템

## 💻 기술 스택

- **Backend**: Java, Spring Boot, JPA (Hibernate), MySQL
- **Frontend**: React
- **Build Tool**: Gradle


## 주요 기능

- 제품 등록 (코드 자동생성: PRD001 형식)
- 공정 등록 (표준 생산량 설정 가능)
- 자재 등록 (공급업체, 코드 자동생성: MTP001-001 형식)
- 작업자 등록 (사번 기반 ID 자동생성)
- 작업지시 등록 (사이클 수 입력 → 제품 LOT 자동생성)
- 제품별 공정 등록 및 자재 소모 등록
- 공정별 생산 실적 등록
- 자재 재고 관리
- 자재 입고 처리
- 작업지시 실행 및 공정별 생산 결과 등록


## 🧱 DB 구조 (요약)

> 핵심 테이블 요약

- `Product` – 제품 정보 
- `Category` – 공정, 자재 등 공통 분류
- `ProcessMaterial` – 공정별 자재 소모 정보
- `Lot` – 제품 LOT 정보 (작업지시 시 생성)
- `ProcessResult` – 공정별 실적
- `MaterialStock` – 자재 재고 및 입고 이력
