import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductionPlanPage.css';
import {Button} from "react-bootstrap";

const ProductionPlanPage = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productSummary, setProductSummary] = useState(null);
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

    // // 제품 선택 시 수주량 정보 로딩
    // useEffect(() => {
    //     if (selectedProduct) {
    //         fetchOrderSummary();
    //     } else {
    //         setOrderMap({});
    //     }
    // }, [selectedProduct]);

    const fetchPlans = async (productId) => {
        const planRes = await axios.get(`http://localhost:8080/api/production-plans/${productId}`);
        setPlans(planRes.data);
    };

    const fetchOrderSummary = async (product) => {
        if (!product || !product.id) return;

        const orderRes = await axios.get(`http://localhost:8080/api/orders/summary`, {
            params: { productId: product.id }
        });

        setOrders(orderRes.data.orders);
        setProductSummary(orderRes.data);

        // orders 붙여서 selectedProduct 갱신
        setSelectedProduct({
            ...product,
            orders: orderRes.data.orders
        });
    };

    const handleProductClick = async (product) => {
        setSelectedProduct(product);

        await fetchPlans(product.id);
        await fetchOrderSummary(product); // selectedProduct 사용 안 함!
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
                        <th colSpan={2}>분류</th>
                        <th colSpan={2}>코드</th>
                        <th colSpan={2}>제품명</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(p => (
                        <React.Fragment key={p.id}>
                            <tr onClick={() => handleProductClick(p)}
                                style={{ backgroundColor: selectedProduct?.id === p.id ? '#e6f7ff' : '' }}>
                                <td colSpan={2}>{p.category?.name}</td>
                                <td colSpan={2}>{p.code}</td>
                                <td colSpan={2}>{p.name}</td>
                            </tr>

                            {selectedProduct?.id === p.id && (() => {
                                let hasRenderedHeader = false;

                                return orders.map((o, idx) => {
                                    const matchedItem = o.items.find(item => item.product.id === p.id);

                                    const renderHeader = !hasRenderedHeader && (matchedItem != null);
                                    if (renderHeader) hasRenderedHeader = true;

                                    return (
                                        <React.Fragment key={`order-${o.id}`}>
                                            {renderHeader && (
                                                <tr>
                                                    <th>수주번호</th>
                                                    <th>수주처</th>
                                                    <th>수주일</th>
                                                    <th>납기일</th>
                                                    <th>수주량</th>
                                                </tr>
                                            )}
                                            {matchedItem && (
                                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                                    <td>{o.orderNo}</td>
                                                    <td>{o.customerName}</td>
                                                    <td>{o.orderDate}</td>
                                                    <td>{o.dueDate}</td>
                                                    <td>{matchedItem.quantity}</td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                });
                            })()}

                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

            </div>

            {/* 가운데 영역 - 생산계획 입력 */}
            <div className="center-section">
                <h2>🗓 생산 계획</h2>
                <div className="summary-box">
                    <table>
                        <thead>
                        <tr>
                            <th>수주량</th>
                            <th>현재 재고</th>
                            <th>필요 생산량</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productSummary ? (
                            <tr>
                                <td>{productSummary.totalOrderQuantity}</td>
                                <td>{productSummary.totalStockQuantity}</td>
                                <td>{productSummary.totalOrderQuantity - productSummary.totalStockQuantity}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={3}></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

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
                            필요 수량
                            대비: {Math.min(100, Math.round((getTotalPlanQuantity() / ((orderMap[selectedProduct.id] || 0) - (stockMap[selectedProduct.id] || 0))) * 100))}%
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
