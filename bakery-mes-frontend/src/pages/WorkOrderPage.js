import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/CommonStyle.css";
import {Button} from "react-bootstrap";

const WorkOrderPage = () => {
    const [workOrders, setWorkOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        id: '',
        productId: '',
        orderDate: new Date().toISOString().split("T")[0],
        cycle: 1,
        unitOutput: 0,
        quantity: 0,
        status: 'ORDERED'
    });
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchWorkOrders();
        fetchProducts();
    }, []);

    const fetchWorkOrders = async () => {
        const res = await axios.get("http://localhost:8080/api/work-orders");
        setWorkOrders(res.data);
    };

    const fetchProducts = async () => {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            productId: form.productId,
            orderDate: form.orderDate,
            cycle: parseInt(form.cycle)
        };

        try {
            if (form.id) {
                alert("작업지시는 수정할 수 없습니다.");
            } else {
                await axios.post("http://localhost:8080/api/work-orders", data);
                alert("작업지시가 등록되었습니다.");
                handleReset();
                fetchWorkOrders();
            }
        } catch (err) {
            alert("작업지시 등록 실패");
        }
    };

    const handleReset = () => {
        setForm({
            id: '',
            productId: '',
            orderDate: new Date().toISOString().split("T")[0],
            cycle: 1,
            unitOutput: 0,
            quantity: 0,
            status: 'ORDERED'
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("정말 취소하시겠습니까?")) return;

        try {
            await axios.put(`http://localhost:8080/api/work-orders/${id}/cancel`);
            alert("작업지시가 취소되었습니다.");
            fetchWorkOrders();
        } catch (err) {
            alert("작업지시 취소 실패");
        }
    }

    const handleRowClick = (order) => {
        // 취소된 건 무시
        if (order.status === 'CANCELED') return;

        setForm({
            id: order.id,
            productId: order.product.id,
            orderDate: order.orderDate,
            cycle: order.cycle,
            unitOutput: order.product.unitOutput || 0,
            quantity: (order.cycle * (order.product.unitOutput || 0)),
            status: order.status
        });
    };

    const filtered = workOrders.filter(w => {
        const nameMatch = w.product.name.includes(searchName);
        const statusMatch = statusFilter === "" || w.status === statusFilter;
        return nameMatch && statusMatch;
    });

    return (
        <div className="page-container">
            {/* 좌측: 작업지시 목록 */}
            <div className="list-section">
                <h2>📋 작업지시 목록</h2>
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="제품명 검색"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">전체 상태</option>
                        <option value="ORDERED">지시됨</option>
                        <option value="IN_PROGRESS">진행중</option>
                        <option value="COMPLETED">완료</option>
                    </select>
                </div>
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
                    {filtered.map(order => (
                        <tr
                            key={order.id}
                            className={order.status === 'CANCELED' ? 'list-row-canceled' : ''}
                            onClick={() => handleRowClick(order)}
                            style={{cursor: 'pointer', background: form.id === order.id ? '#e6f7ff' : ''}} >
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

            {/* 우측: 작업지시 등록/상세 폼 */}
            <div className="form-section">
                <h2>{form.id ? '📝 작업지시 상세' : '➕ 작업지시 등록'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        제품 선택
                        <select name="productId" value={form.productId} onChange={handleChange} required disabled={form.id ? true : false}>
                            <option value="">선택</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        지시일
                        <input type="date" name="orderDate" value={form.orderDate} onChange={handleChange} required disabled={form.id ? true : false}/>
                    </label>
                    <label>
                        회전수
                        <input type="number" name="cycle" value={form.cycle} onChange={handleChange} required disabled={form.id ? true : false} />
                    </label>
                    <label>
                        총 예상 수량
                        <input type="number" value={form.quantity} readOnly />
                    </label>
                    <Button type="submit" className="form-action-button" variant="primary">
                        {form.id ? '수정' : '등록'}
                    </Button>
                </form>
                {form.id && (
                    <>
                        <Button
                            type="button"
                            onClick={handleReset}
                            variant="success"
                            className="form-action-button">
                            폼 리셋
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            variant="danger"
                            className="form-action-button">
                            취소
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkOrderPage;