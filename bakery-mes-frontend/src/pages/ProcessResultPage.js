import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonStyle.css';
import {Button} from "react-bootstrap";

const ProcessResultPage = () => {
    const [workOrders, setWorkOrder] = useState([]);
    // const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
    // const [selectedProduct, setProduct] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [form, setForm] = useState({
        id: '',
        output: '',
        defect: '',
        note: ''
    });

    const [requiredMaterials, setRequiredMaterials] = useState([]);
    const [materialUsages, setMaterialUsages] = useState({}); // { materialId: { lotId, quantity } }
    const [materialLots, setMaterialLots] = useState({}); // { materialId: Lot[] }


    const [openWorkOrderId, setOpenWorkOrderId] = useState(null);

    const toggleLots = (workOrderId) => {
        setOpenWorkOrderId(prev => prev === workOrderId ? null : workOrderId);
    };

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const workOrderRes = await axios.get(`http://localhost:8080/api/work-orders`);
            setWorkOrder(workOrderRes.data);

            const workersRes = await axios.get(`http://localhost:8080/api/users`);
            setWorkers(workersRes.data);


        } catch (error) {
            console.error("데이터 로딩 실패", error);
        }
    };

    // 작업지시(롯트) 클릭 핸들러
    const handleWorkOrderClick = async (lot) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/product-process/by-lot/${lot.id}`);
            setProcesses(res.data);
            setForm({
                id: lot.id,
                output: '',
                defect: '',
                note: ''
            });
        } catch (e) {
            alert('공정 정보 로딩 실패');
        }

    }

    // 상세 공정 클릭시
    const handleProcessSelect = async (processId) => {
        setSelectedProcess(processId);
        setForm({ output: '', defect: '', note: '' });

        // 공정별 소요 자재 목록 가져오기
        try {
            const res = await axios.get(`http://localhost:8080/api/process-materials/${processId}`);
            setRequiredMaterials(res.data);

            // 자재별 LOT 목록도 모두 비동기로 로딩
            for (let mat of res.data) {
                await loadMaterialLots(mat.material.id);
            }

        } catch (e) {
            alert('공정 자재 정보 로딩 실패');
        }
    };

    const handleMaterialChange = (materialId, field, value) => {
        setMaterialUsages(prev => ({
            ...prev,
            [materialId]: {
                ...prev[materialId],
                [field]: value
            }
        }));
    };

    const loadMaterialLots = async (materialId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/material-stocks/by-material/${materialId}`);
            setMaterialLots(prev => ({ ...prev, [materialId]: res.data }));
        } catch (e) {
            alert("자재 LOT 조회 실패");
        }
    };


    // const handleProcessClick = (process) => {
    //     setSelectedProcess(process);
    //     setForm({
    //         output: '',
    //         defect: '',
    //         note: ''
    //     });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!selectedLot || !selectedProcess) return;

        const data = {
            // workOrderId: selectedLot.id,
            processId: selectedProcess.id,
            output: form.output,
            defect: form.defect,
            note: form.note
        };

        try {
            await axios.post('http://localhost:8080/api/process-results', data);
            alert('실적 등록 완료');
            setForm({ id: '', output: '', defect: '', note: '' });
        } catch {
            alert('실적 등록 실패');
        }
    };


    return (
        <div className="page-container">
            {/* 왼쪽: 작업지시 목록 */}
            <div className="list-section">
                <h2>📋 작업지시</h2>
                {/* 작업지시 테이블 들어갈 자리 */}
                <table>
                    <thead>
                    <tr>
                        <th>제품</th>
                        <th>지시일</th>
                        <th>회차</th>
                        <th>LOT</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workOrders.map(wo => (
                        <React.Fragment key={wo.id}>
                            {/* 작업지시 한 줄 */}
                            <tr onClick={() => toggleLots(wo.id)}
                                className={wo.status === 'CANCELED' ? 'list-row-canceled' : ''}
                                style={{cursor: 'pointer', backgroundColor: openWorkOrderId === wo.id ? '#f0f8ff' : '' }}>
                                <td>{wo.product?.name}</td>
                                <td>{wo.orderDate}</td>
                                <td>{wo.cycle}</td>
                                <td></td>
                                <td>{wo.status}</td>
                            </tr>

                            {/* 하위 LOT들 */}
                            {openWorkOrderId === wo.id && wo.lots?.map(lot => (
                                <tr
                                    key={lot.id}
                                    onClick={() => handleWorkOrderClick(lot)}
                                    style={{cursor: 'pointer', background: form.id === lot.id ? '#e6f7ff' : ''}} >
                                    <td></td>
                                    <td>{wo.orderDate}</td>
                                    <td>{lot.cycle}/{wo.cycle}</td>
                                    <td>{lot.lotNumber}</td>
                                    <td>{wo.status}</td>

                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>


            {/* 오른쪽: 선택된 공정의 생산실적 폼 */}
            <div className="form-section" style={{display: 'flex',flexDirection: 'column',gap: '20px' }}>
                <div className="form-section-box" style={{minHeight: '35vh', maxHeight: '40vh'}}>
                    <h2>📦 자재 투입</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>자재</th>
                            <th>자재 LOT</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requiredMaterials.map((mat) => (
                            <tr key={mat.id}>
                                <td>{mat.material.name}</td>
                                <td>
                                    <select>
                                        <option value="">선택</option>
                                        {(materialLots[mat.material.id] || []).map((lot) => (
                                            <option key={lot.id} value={lot.id}>
                                                {lot.lotNumber || `LOT-${lot.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-section-box" style={{maxHeight: '50vh'}}>
                    <h2>✅ 생산 실적 등록</h2>
                    {/* 생산실적 등록 폼 */}
                    <form onSubmit={handleSubmit}>

                        <label>
                            작업자
                            <select name="workerId" value={form.workerId} onChange={handleChange} required>
                                <option value="">선택</option>
                                {workers.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            상세 공정
                            <select name="processId" value={form.processId}
                                    onChange={e => handleProcessSelect(e.target.value)} required>
                                <option value="">선택</option>
                                {processes.map(p => (
                                    <option key={p.id} value={p.id}>{p.process.name}</option>
                                ))}
                            </select>
                        </label>
                        <div className="row-inline">
                            <label>
                                생산 수량
                                <input type="number" name="output" value={form.output} onChange={handleChange}
                                       required/>
                            </label>
                            <label>
                                불량 수량
                                <input type="number" name="defect" value={form.defect} onChange={handleChange}/>
                            </label>
                        </div>
                        <label>
                            비고
                            <input type="text" name="note" value={form.note} onChange={handleChange}/>
                        </label>
                        <Button type="submit" className="form-action-button" variant="primary">
                            {form.id ? '수정' : '등록'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProcessResultPage;
