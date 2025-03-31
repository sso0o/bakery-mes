import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonStyle2.css';
import {Button} from "react-bootstrap";

const ProcessResultPage = () => {
    const [workOrders, setWorkOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [form, setForm] = useState({
        output: '',
        defect: '',
        note: ''
    });

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const workOrdersRes = await axios.get('http://localhost:8080/api/work-orders');
            setWorkOrders(workOrdersRes.data);


        } catch (error) {
            console.error("데이터 로딩 실패", error);
        }
    };



    const handleOrderClick = async (order) => {
        setSelectedOrder(order);
        setSelectedProcess(null);
        setForm({ output: '', defect: '', note: '' });

        try {
            const res = await axios.get(`http://localhost:8080/api/product-process/${order.product.id}`);
            setProcesses(res.data);
        } catch {
            alert('공정 목록 로딩 실패');
        }
    };

    const handleProcessClick = (process) => {
        setSelectedProcess(process);
        setForm({ output: '', defect: '', note: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOrder || !selectedProcess) return;

        const data = {
            workOrderId: selectedOrder.id,
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
            <div className="list1-section">
                <h2>📋 작업지시</h2>
                {/* 작업지시 테이블 들어갈 자리 */}
                <table>
                    <thead>
                    <tr>
                        <th>제품</th>
                        <th>지시일</th>
                        <th>회전수</th>
                        <th>예상수량</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workOrders.map(order => (
                        <tr
                            key={order.id}
                            className={order.status === 'CANCELED' ? 'list-row-canceled' : ''}
                            onClick={() => handleOrderClick(order)}
                            style={{cursor: 'pointer', background: form.id === order.id ? '#e6f7ff' : ''}}>
                            <td>{order.product.name}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.cycle}</td>
                            <td>{order.cycle * order.product.unitOutput}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 가운데: 작업지시 상세 + 공정 목록 */}
            <div className="list2-section">
                <h2>🔢 작업지시 상세</h2>
                {/* 선택된 작업지시 정보 표시 */}
                {selectedOrder && (
                    <div>
                        <p><strong>제품:</strong> {selectedOrder.product.name}</p>
                        <p><strong>날짜:</strong> {selectedOrder.orderDate}</p>
                        <p><strong>회전수:</strong> {selectedOrder.cycle}</p>

                        <h4>공정 목록</h4>
                        <ul>
                            {processes.map(p => (
                                <li key={p.id} onClick={() => handleProcessClick(p)}
                                    className={selectedProcess?.id === p.id ? 'selected' : ''}>
                                    {p.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 오른쪽: 선택된 공정의 생산실적 폼 */}
            <div className="form-section">
                <h2>✅ 생산 실적 등록</h2>
                {/* 생산실적 등록 폼 */}
                {selectedProcess ? (
                    <form onSubmit={handleSubmit}>
                        <label>
                            생산 수량
                            <input type="number" name="output" value={form.output} onChange={handleChange} required/>
                        </label>
                        <label>
                        불량 수량
                            <input type="number" name="defect" value={form.defect} onChange={handleChange} required />
                        </label>
                        <label>
                            비고
                            <input type="text" name="note" value={form.note} onChange={handleChange} />
                        </label>
                        <Button type="submit" className="form-action-button" variant="primary">
                            {form.id ? '수정' : '등록'}
                        </Button>
                    </form>
                ) : <p>공정을 선택해주세요</p>}
            </div>
        </div>
    );
};

export default ProcessResultPage;
