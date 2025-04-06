import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonStyle.css';
import {Button} from "react-bootstrap";

const OrderRegisterPage = () => {
    const [productList, setProductList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [form, setForm] = useState({
        id: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        orderDate: '',
        dueDate: '',
        status: 'RECEIVED', // 기본값 추가
        items: [{ productId: '', quantity: 1 }],
    });

    // 제품 목록 조회
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productRes =  await axios.get('http://localhost:8080/api/products');
            setProductList(productRes.data)

            const orderRes = await axios.get('http://localhost:8080/api/orders');
            setOrderList(orderRes.data);

        } catch (error) {
            console.error("데이터 로딩 실패", error);
        }
    };

    const handleRowClick = (order) => {
        setForm({
            id: order.id,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            orderDate: order.orderDate,
            dueDate: order.dueDate,
            status: order.status,
            items: order.items.map(item => ({
                productId: item.product?.id || '',
                quantity: item.quantity
            })),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...form.items];
        updatedItems[index][field] = value;
        setForm(prev => ({ ...prev, items: updatedItems }));
    };

    const addItem = () => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, { productId: '', quantity: 1 }],
        }));
    };

    const removeItem = (index) => {
        const updatedItems = [...form.items];
        updatedItems.splice(index, 1);
        setForm(prev => ({ ...prev, items: updatedItems }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.id && form.status !== 'RECEIVED') {
            alert('RECEIVED 상태의 수주만 수정할 수 있습니다.');
            return;
        }

        try {
            const data = {
                ...form,
                items: form.items.filter(i => i.productId && i.quantity > 0),
            };

            await axios.post('http://localhost:8080/api/orders', data);
            alert('수주 등록 완료');
            handleReset();

        } catch (error) {
            console.error('수주 등록 실패:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleReset = () => {
        setForm({
            id: '',
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            orderDate: '',
            dueDate: '',
            status: 'RECEIVED',
            items: [{ productId: '', quantity: 1 }],
        });
    };

    const handleCancel = async () => {
        if (!form.id) return;
        if (!window.confirm('정말 이 수주를 취소하시겠습니까?')) return;

        try {
            await axios.put(`http://localhost:8080/api/orders/${form.id}/cancel`);
            alert('수주가 취소되었습니다.');
            fetchData(); // 목록 새로고침
            handleReset(); // 폼 초기화
        } catch (error) {
            console.error('수주 취소 실패:', error);
            alert('취소 중 오류가 발생했습니다.');
        }
    };



    return (
        <div className="page-container">
            {/* 왼쪽 - 수주 목록 */}
            <div className="list-section">
                <h2>📦 수주 목록</h2>
                <table>
                    <thead>
                    <tr>
                        <th>수주번호</th>
                        <th>고객명</th>
                        <th>전화번호</th>
                        <th>이메일</th>
                        <th>수주일</th>
                        <th>납기일</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderList.map(order => (
                            <tr key={order.id} onClick={() => handleRowClick(order)}
                                className={order.status === 'CANCELED' ? 'list-row-canceled' : ''} >
                            <td>{order.orderNo}</td>
                            <td>{order.customerName}</td>
                            <td>{order.customerPhone}</td>
                            <td>{order.customerEmail}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.dueDate}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 오른쪽 - 수주 등록 */}
            <div className="form-section">
                <h2>➕ 수주 {form.id ? '수정' : '등록'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        고객명
                        <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required/>
                    </label>
                    <label>
                        연락처
                        <input type="text" name="customerPhone" value={form.customerPhone} onChange={handleChange}/>
                    </label>
                    <label>
                        이메일
                        <input type="text" name="customerEmail" value={form.customerEmail} onChange={handleChange}/>
                    </label>
                    <label>
                        수주일자
                        <input type="date" name="orderDate" value={form.orderDate} onChange={handleChange}/>
                    </label>
                    <label>
                        납기일자
                        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}/>
                    </label>
                    <label>
                        제품 목록
                        {form.items.map((item, idx) => (
                            <div key={idx} className="row-inline">
                                <select value={item.productId}
                                        onChange={e => handleItemChange(idx, 'productId', e.target.value)}>
                                    <option value="">제품 선택</option>
                                    {productList.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <input type="number" min="1" value={item.quantity}
                                       onChange={e => handleItemChange(idx, 'quantity', e.target.value)}/>
                                <Button type="button" onClick={() => removeItem(idx)}
                                        variant="danger"
                                        disabled={form.id && form.status !== 'RECEIVED'}>삭제</Button>
                            </div>
                        ))}
                        <Button type="button" onClick={addItem}
                                variant="secondary"
                                style={{ marginTop: '10px' }}
                                disabled={form.id && form.status !== 'RECEIVED'}>
                            제품 추가</Button>
                    </label>

                    <Button type="submit" className="form-action-button" variant="primary"
                            disabled={form.id && form.status !== 'RECEIVED'}>
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
                            onClick={handleCancel}
                            variant="danger"
                            className="form-action-button" disabled={form.id && form.status !== 'RECEIVED'}>
                            수주 취소
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderRegisterPage;