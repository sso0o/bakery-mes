import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonStyle.css';
import {Button} from "react-bootstrap";

const ProcessResultPage = () => {
    const [selectedLot, setSelectedLot] = useState(null);
    const [workOrders, setWorkOrder] = useState([]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [resultForm, setResultForm] = useState({ quantity: '', note: '' });
    const [form, setForm] = useState({
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
    const handleWorkOrderClick = async (wo) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/product-process/${wo.product.id}`);
            setSelectedWorkOrder(wo)
            setProcesses(res.data);
            console.log(res.data);
            setForm({
                output: '',
                defect: '',
                note: ''
            });
        } catch (e) {
            alert('공정 정보 로딩 실패');
        }

    }

    const handleProcessSelect = async (processId) => {
        setSelectedProcess(processId);
        setForm({ output: '', defect: '', note: '' });

        // 공정별 소요 자재 목록 가져오기
        try {
            const res = await axios.get(`/api/process-materials/by-process/${processId}`);
            setRequiredMaterials(res.data);

            // 각 자재의 사용가능한 LOT 목록 가져오기
            const lotMap = {};
            for (const mat of res.data) {
                const lotRes = await axios.get(`/api/material-stocks/available-lots/${mat.material.id}`);
                lotMap[mat.material.id] = lotRes.data;
            }
            setMaterialLots(lotMap);
            setMaterialUsages({});
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
        if (!selectedLot || !selectedProcess) return;

        const data = {
            workOrderId: selectedLot.id,
            processId: selectedProcess.id,
            output: form.output,
            defect: form.defect,
            note: form.note
        };

        try {
            await axios.post('http://localhost:8080/api/process-results', data);
            alert('실적 등록 완료');
            setForm({ output: '', defect: '', note: '' });
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
                            <tr
                                onClick={() => toggleLots(wo.id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: openWorkOrderId === wo.id ? '#f0f8ff' : ''
                                }}
                            >
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
                                    onClick={() => handleWorkOrderClick(wo)}
                                    style={{cursor: 'pointer',}} >
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
            <div className="form-section">
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
                        <select name="processId" value={form.processId} onChange={e => handleProcessSelect(e.target.value)} required>
                            <option value="">선택</option>
                            {processes.map(p => (
                                <option key={p.id} value={p.id}>{p.process.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        생산 수량
                        <input type="number" name="output" value={form.output} onChange={handleChange}
                               required/>
                    </label>
                    <label>
                        불량 수량
                        <input type="number" name="defect" value={form.defect} onChange={handleChange}/>
                    </label>
                    <label>
                        비고
                        <input type="text" name="note" value={form.note} onChange={handleChange}/>
                    </label>
                    <Button type="submit" className="form-action-button" variant="primary">
                        {form.id ? '수정' : '등록'}
                    </Button>
                </form>

                <h4>📦 자재 투입</h4>
                {requiredMaterials.map(mat => (
                    <div key={mat.material.id} style={{ marginBottom: '1rem' }}>
                        <strong>{mat.material.name}</strong>
                        <div>
                            <label>자재 LOT</label>
                            <select onChange={e => handleMaterialChange(mat.material.id, 'lotId', e.target.value)}>
                                <option value="">-- LOT 선택 --</option>
                                {(materialLots[mat.material.id] || []).map(lot => (
                                    <option key={lot.id} value={lot.id}>{lot.lotNumber} ({lot.stockQuantity})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>투입 수량</label>
                            <input
                                type="number"
                                value={materialUsages[mat.material.id]?.quantity || ''}
                                onChange={e => handleMaterialChange(mat.material.id, 'quantity', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                {/*{selectedProcess ? (*/}
                {/*    <form onSubmit={handleSubmit}>*/}
                {/*        <label>*/}
                {/*            상세 공정*/}
                {/*            <select name="processId" value={form.processId} onChange={handleChange} required>*/}
                {/*                <option value="">선택</option>*/}
                {/*                {processes.map(p => (*/}
                {/*                    <option key={p.id} value={p.id}>{p.name}</option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*        </label>*/}
                {/*        <label>*/}
                {/*            생산 수량*/}
                {/*            <input type="number" name="output" value={form.output} onChange={handleChange}*/}
                {/*                   required/>*/}
                {/*        </label>*/}
                {/*        <label>*/}
                {/*            불량 수량*/}
                {/*            <input type="number" name="defect" value={form.defect} onChange={handleChange}/>*/}
                {/*        </label>*/}
                {/*        <label>*/}
                {/*            비고*/}
                {/*            <input type="text" name="note" value={form.note} onChange={handleChange}/>*/}
                {/*        </label>*/}
                {/*        <Button type="submit" className="form-action-button" variant="primary">*/}
                {/*            {form.id ? '수정' : '등록'}*/}
                {/*        </Button>*/}
                {/*    </form>*/}
                {/*) : <p>공정을 선택해주세요</p>}*/}

                <div>

                </div>
            </div>
        </div>
    );
};

export default ProcessResultPage;
