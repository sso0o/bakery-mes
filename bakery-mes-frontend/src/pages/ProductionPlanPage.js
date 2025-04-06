import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductionPlanPage.css';
import {Button} from "react-bootstrap";

const ProductionPlanPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockMap, setStockMap] = useState({});
    const [orderMap, setOrderMap] = useState({});
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ date: '', quantity: '' });

    const [categories, setCategories] = useState([]);

    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const productRes = await axios.get('http://localhost:8080/api/products');
        setProducts(productRes.data);

        const categoryRes = await axios.get('http://localhost:8080/api/categories?type=PRODUCT');
        setCategories(categoryRes.data);

        // const stockRes = await axios.get('http://localhost:8080/api/material-stocks');
        // setStockMap(stockRes.data);
    };

    // 제품 선택 시 수주량 정보 로딩
    useEffect(() => {
        if (selectedProduct) {
            const fetchOrderSummary = async () => {
                const orderRes = await axios.get(`http://localhost:8080/api/orders/summary`, {
                    params: { productId: selectedProduct.id }
                });
                setOrderMap(orderRes.data);
            };
            fetchOrderSummary();
        } else {
            setOrderMap({});
        }
    }, [selectedProduct]);

    const fetchPlans = async (productId) => {
        const res = await axios.get(`http://localhost:8080/api/production-plans/${productId}`);
        setPlans(res.data);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        // fetchPlans(product.id);
    };

    const handlePlanAdd = async () => {
        if (!newPlan.date || !newPlan.quantity) return;
        await axios.post('http://localhost:8080/api/production-plans', {
            productId: selectedProduct.id,
            date: newPlan.date,
            quantity: parseInt(newPlan.quantity)
        });
        setNewPlan({ date: '', quantity: '' });
        fetchPlans(selectedProduct.id);
    };

    const getTotalPlanQuantity = () => plans.reduce((sum, p) => sum + p.quantity, 0);

    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(p.category?.id) === searchCategory;
        return nameMatch && categoryMatch;
    });

    return (
        <div className="page-container">
            {/* 왼쪽 영역 - 제품 목록 + 수요 정보 */}
            <div className="left-section">
                <h2>📦 제품 목록</h2>
                <div className="search-section">
                    <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                        <option value="">전체 카테고리</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="제품 이름 검색"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>분류</th>
                        <th>코드</th>
                        <th>제품명</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(p => {
                        const orderQty = orderMap[p.id] || 0;
                        const stockQty = stockMap[p.id] || 0;
                        const needQty = orderQty - stockQty;
                        return (
                            <tr key={p.id} onClick={() => handleProductClick(p)}
                                style={{backgroundColor: selectedProduct?.id === p.id ? '#e6f7ff' : ''}}>
                                <td>{p.category?.name}</td>
                                <td>{p.code}</td>
                                <td>{p.name}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {selectedProduct && (
                    <div className="summary-box">
                        <p>수주량: {orderMap[selectedProduct.id] || 0}</p>
                        <p>현재 재고: {stockMap[selectedProduct.id] || 0}</p>
                        <p>필요 생산량: {(orderMap[selectedProduct.id] || 0) - (stockMap[selectedProduct.id] || 0)}</p>
                    </div>
                )}
            </div>

            {/* 가운데 영역 - 생산계획 입력 */}
            <div className="center-section">
                <h2>🗓 생산 계획</h2>
                {selectedProduct && (
                    <>
                        <div className="plan-input">
                            <input type="date" value={newPlan.date}
                                   onChange={e => setNewPlan(prev => ({...prev, date: e.target.value}))}/>
                            <input type="number" min="1" value={newPlan.quantity}
                                   onChange={e => setNewPlan(prev => ({...prev, quantity: e.target.value}))}/>
                            <button onClick={handlePlanAdd}>추가</button>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>날짜</th>
                                <th>수량</th>
                            </tr>
                            </thead>
                            <tbody>
                            {plans.map(p => (
                                <tr key={p.id}>
                                    <td>{p.date}</td>
                                    <td>{p.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="plan-summary">
                            총 계획 수량: {getTotalPlanQuantity()}<br/>
                            필요 수량 대비: {Math.min(100, Math.round((getTotalPlanQuantity() / ((orderMap[selectedProduct.id] || 0) - (stockMap[selectedProduct.id] || 0))) * 100))}%
                        </div>
                    </>
                )}
            </div>

            {/* 오른쪽 영역 - 요약 및 작업지시 전환 */}
            <div className="right-section">
                <h2>📋 계획 요약</h2>
                {selectedProduct && (
                    <>
                        <p>총 계획 수량: {getTotalPlanQuantity()}</p>
                        <p>필요 수량: {(orderMap[selectedProduct.id] || 0) - (stockMap[selectedProduct.id] || 0)}</p>
                        <button onClick={() => alert('작업지시로 전환 기능은 추후 구현')}>작업지시로 전환</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductionPlanPage;
