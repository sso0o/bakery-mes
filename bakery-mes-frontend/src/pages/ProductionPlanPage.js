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
    const [newPlan, setNewPlan] = useState({ productId: '', planDate: '', quantity: '' });

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
        // 이미 선택된 제품이면 선택 해제
        if (selectedProduct?.id === product.id) {
            setSelectedProduct(null);
            setOrders([]);
            setProductSummary(null);
            setPlans([]);
            setNewPlan(prev => ({ ...prev, productId: '' })); // 초기화
            return;
        }
        // 새 제품 선택
        setSelectedProduct(product);
        setNewPlan(prev => ({ ...prev, productId: product.id })); // 선택 시 자동 세팅
        await fetchPlans(product.id);
        await fetchOrderSummary(product);
    };

    const handlePlanAdd = async () => {
        if (!newPlan.productId || !newPlan.planDate || !newPlan.quantity) {
            alert('모든 값을 입력해주세요.');
            return;
        }

        await axios.post('http://localhost:8080/api/production-plans', {
            productId: newPlan.productId,
            planDate: newPlan.planDate,
            quantity: parseInt(newPlan.quantity)
        });
        setNewPlan({ productId: newPlan.productId, planDate: '', quantity: '' });
        fetchPlans(selectedProduct.id);
    };

    const removePlan = async (planId) => {
        if (!window.confirm('정말 이 항목을 취소하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/production-plans/${planId}/cancel`);
            alert('취소되었습니다.');
            fetchPlans(selectedProduct.id);
        } catch (error) {
            console.error('취소 실패:', error);
            const msg = error.response?.data?.message || '취소 중 오류가 발생했습니다.';
            alert(msg);
        }
    }

    const convertPlan = async (planId) => {
        if (!window.confirm('이 생산계획을 작업지시로 전환하시겠습니까?')) return;

        try {
            await axios.post(`http://localhost:8080/api/work-orders/convert/${planId}`);
            alert('작업지시로 전환되었습니다.');
            fetchPlans(selectedProduct.id);
        } catch (error) {
            console.error('작업지시 전환 실패:', error);
            const msg = error.response?.data?.message || '작업지시 전환 중 오류가 발생했습니다.';
            alert(msg);
        }

    }

    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(p.category?.id) === searchCategory;
        return nameMatch && categoryMatch;
    });

    return (
        <div className="page-container">
            {/* 왼쪽 영역 - 제품 목록 + 수요 정보 */}
            <div className="first-section">
                <h2>📋 제품 목록</h2>
                <div className="search-section">
                    <select value={searchCategory} onChange={e => {
                        setSearchCategory(e.target.value);
                        setSelectedProduct(null); // 제품 선택 해제
                        setProductSummary(null); // 제품 상태 해제
                    }}>
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
            <div className="second-section">
                <div className="top-div">
                    <h2>📦 제품 현황</h2>
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
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bottom-div">
                    <h2>🗓 생산 계획</h2>
                    <div className="plan-input">
                        {/* 내부적으로 productId는 숨겨서 저장 */}
                        <input type="hidden" name="productId" value={selectedProduct?.id || ''} />
                        <input type="text" name="productName" value={selectedProduct?.name || '제품을 선택해주세요'} style={{ textAlign: 'center' }} readOnly />
                        <input type="date" name="planDate" value={newPlan.planDate}
                               onChange={e => setNewPlan(prev => ({...prev, planDate: e.target.value}))}/>
                        <input type="number" min="1" value={newPlan.quantity}
                               onChange={e => setNewPlan(prev => ({...prev, quantity: e.target.value}))}/>
                        <Button onClick={handlePlanAdd}>추가</Button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>제품</th>
                            <th>작업일자</th>
                            <th>수량(사이클)</th>
                            <th>상태</th>
                            <th>전환</th>
                        </tr>
                        </thead>
                        <tbody>
                        {plans.map(p => (
                            <tr key={p.id}>
                                <td>{selectedProduct?.name || ''}</td>
                                <td>{p.planDate}</td>
                                <td>{p.quantity}</td>
                                <td>{p.status}</td>
                                <td>
                                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                        <Button type="button"
                                                variant="primary"
                                                onClick={() => convertPlan(p.id)}
                                                disabled={p.status !== 'PLANNED'}>
                                        작업 지시
                                        </Button>
                                        <Button type="button"
                                                variant="danger"
                                                onClick={() => removePlan(p.id)}
                                                disabled={p.status === 'ORDERED'}>
                                            삭제
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/*{selectedProduct && (*/}

                {/*)}*/}
            </div>


        </div>
    );
};

export default ProductionPlanPage;
