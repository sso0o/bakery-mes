import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductProcessPage.css';

const ProductProcessPage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productProcesses, setProductProcesses] = useState([]);
    const [selectedProcessId, setSelectedProcessId] = useState(null);
    const [processMaterials, setProcessMaterials] = useState([]);


    const [form, setForm] = useState({
        processId: '',
        stepOrder: '',
        estimatedMinutes: ''
    });
    const [materialForm, setMaterialForm] = useState({
        materialId: '',
        quantity: '',
        unit: ''
    });


    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    const [fromProductId, setFromProductId] = useState('');
    const [toProductId, setToProductId] = useState('');

    const [editingId, setEditingId] = useState(null); // 현재 수정 중인 공정 ID


    // 제품 목록 + 공정 카테고리 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await axios.get('http://localhost:8080/api/categories?type=PRODUCT');
                setCategories(categoryRes.data);

                const productRes = await axios.get('http://localhost:8080/api/products');
                setProducts(productRes.data);

                const processRes = await axios.get('http://localhost:8080/api/categories?type=PROCESS');
                setProcesses(processRes.data);

                const materialRes = await axios.get('http://localhost:8080/api/materials');
                setMaterials(materialRes.data);

            } catch (e) {
                alert('데이터 로딩 실패');
            }
        };
        fetchData();
    }, []);

    // 제품별 공정 조회
    const fetchProductProcesses = async (productId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/product-process/${productId}`);
            setProductProcesses(res.data);
        } catch (e) {
            alert('제품별 공정 조회 실패');
        }
    };

    // 공정별 자재 조회
    const fetchProcessMaterials = async (processId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/process-materials/${processId}`);
            setProcessMaterials(res.data);
        } catch (e) {
            alert('공정별 자재 조회 실패');
        }
    };

    // 공정 등록

    // 제품 선택 핸들러
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        fetchProductProcesses(product.id);
        setForm({ processId: '', stepOrder: '', estimatedMinutes: '' });
        setSelectedProcessId(null);  // 공정 선택 초기화
        setProcessMaterials([]); // 자재 목록 초기화
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleMaterialChange = (e) => {
        const { name, value } = e.target; // 입력된 이름(name)과 값(value)을 추출
        setMaterialForm(prev => ({ ...prev, [name]: value })); // 기존 상태를 복사하고, 해당 name 필드를 업데이트

        // 자재 선택 시 단위 자동 설정
        if (name === 'materialId') {
            const selected = materials.find(m => m.id === parseInt(value));
            if (selected) {
                setMaterialForm(prev => ({ ...prev, unit: selected.unit }));
            }
        }
    };

    // 공정 저장
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return alert('제품을 선택해주세요');

        const data = {
            productId: selectedProduct.id,
            processId: form.processId,
            stepOrder: parseInt(form.stepOrder),
            estimatedMinutes: form.estimatedMinutes ? parseInt(form.estimatedMinutes) : null
        };

        try {
            if (editingId) {
                // 수정
                await axios.put(`http://localhost:8080/api/product-process/${editingId}`, data);
                setEditingId(null);
            } else {
                // 신규 등록
                await axios.post('http://localhost:8080/api/product-process', data);
            }

            setForm({ processId: '', stepOrder: '', estimatedMinutes: '' });
            fetchProductProcesses(selectedProduct.id);
        } catch (err) {
            alert('저장 실패');
        }
    };


    // 공정 복사
    const handleCopy = async () => {
        if (!fromProductId || !toProductId) return alert('제품을 선택하세요');
        if (fromProductId === toProductId) return alert('같은 제품끼리는 복사할 수 없어요');

        try {
            await axios.post(`http://localhost:8080/api/product-process/copy`, null, {
                params: {
                    fromProductId,
                    toProductId
                }
            });
            alert('복사 완료');
            // 현재 선택 중인 제품이 대상이면 새로고침
            if (selectedProduct?.id === parseInt(toProductId)) {
                fetchProductProcesses(toProductId);
            }
        } catch (e) {
            alert('복사 실패');
        }
    };

    // 공정 삭제
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/product-process/${id}`);

            // 삭제 후 최신 공정 목록 다시 불러오기
            const res = await axios.get(`http://localhost:8080/api/product-process/${selectedProduct.id}`);
            const reOrdered = res.data.map((p, idx) => ({
                ...p,
                stepOrder: idx + 1
            }));

            setProductProcesses(reOrdered);

            // 순서 업데이트 백엔드에 반영
            await axios.put('http://localhost:8080/api/product-process/reorder', reOrdered);
        } catch (e) {
            alert('삭제 실패');
        }
    };

    // 공정 목록에서 행 클릭 시 해당 공정 데이터를 폼에 세팅하도록 처리
    const handleRowClick = (item) => {
        setSelectedProcessId(item.id);
        setForm({
            processId: item.process.id,
            stepOrder: item.stepOrder,
            estimatedMinutes: item.estimatedMinutes ?? ''
        });

        setMaterialForm({ materialId: '', quantity: '', unit: '' });
        fetchProcessMaterials(item.id); // 공정별 자재 조회
    };


    // 자재 소모 등록
    const handleMaterialSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !selectedProcessId) return alert('공정을 먼저 선택해주세요');

        const data = {
            productProcess: { id: selectedProcessId },  // productProcessId만 전송
            material: { id: materialForm.materialId }, // materialId만 전송
            quantity: parseFloat(materialForm.quantity),
            unit: materialForm.unit
        };

        try {
            await axios.post('http://localhost:8080/api/process-materials', data);
            alert('자재 소모 등록 완료');
            setMaterialForm({ materialId: '', quantity: '', unit: '' });
            fetchProcessMaterials(selectedProcessId); // 공정별 자재 조회
        } catch (e) {
            alert('등록 실패');
        }
    };

    // 제품 필터링
    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(p.category?.id) === searchCategory;
        return nameMatch && categoryMatch;
    });


    return (
        <div className="page-container">
            {/* 왼쪽: 제품 목록 */}
            <div className="product-list">
                <h2>📦 제품 목록</h2>
                <div className="process-copy-box">
                    <h3>📋 공정 복사</h3>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <select value={fromProductId} onChange={e => setFromProductId(e.target.value)}>
                            <option value="">원본 제품 선택</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        →
                        <select value={toProductId} onChange={e => setToProductId(e.target.value)}>
                            <option value="">대상 제품 선택</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <button onClick={handleCopy}>복사</button>
                    </div>
                </div>
                <div className="product-search">
                    <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                        <option value="">전체 분류</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="이름 검색"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>코드</th>
                        <th>이름</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id} onClick={() => handleProductClick(p)}
                            style={{cursor: 'pointer', backgroundColor: selectedProduct?.id === p.id ? '#e6f7ff' : ''}}>
                            <td>{p.code}</td>
                            <td>{p.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 가운데: 제품 공정 목록 */}
            <div className="process-list">
                <div className="product-process">
                    <h2>🔧 제품 공정 순서</h2>
                    {selectedProduct ? (
                        <table>
                            <thead>
                            <tr>
                                <th>순서</th>
                                <th>공정명</th>
                                <th>예상시간</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productProcesses.map(p => (
                                <tr
                                    key={p.id}
                                    onClick={() => handleRowClick(p)} // 행 클릭 시 폼에 데이터 세팅
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selectedProcessId === p.id ? '#e6f7ff' : ''
                                    }}
                                >
                                    <td>{p.stepOrder}</td>
                                    <td>{p.process?.name}</td>
                                    <td>{p.estimatedMinutes ?? '-'} 분</td>
                                    <td>
                                        <div className="manage-buttons">
                                            <button
                                                className="delete"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>제품을 선택해주세요</p>
                    )}
                </div>
                <div className="process-material">
                    <h2>🔧 공정별 자재</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>코드</th>
                            <th>이름</th>
                            <th>소모량</th>
                            <th>단위</th>
                        </tr>
                        </thead>
                        <tbody>
                        {processMaterials.map((material) => (
                            <tr key={material.id}>
                                <td>{material.quantity}</td>
                                {/* 자재 코드 */}
                                <td>{material.quantity}</td>
                                {/* 자재 이름 */}
                                <td>{material.quantity}</td>
                                {/* 소모량 */}
                                <td>{material.unit}</td>
                                {/* 단위 */}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 오른쪽: 공정 등록 폼 */}
            <div className="process-form">
                <div className="product-process">
                    <h2>➕ 공정 등록</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            공정 선택
                            <select name="processId" value={form.processId} onChange={handleChange} required>
                                <option value="">선택</option>
                                {processes.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                        순서
                            <input type="number" name="stepOrder" value={form.stepOrder} onChange={handleChange} required/>
                        </label>
                        <label>
                            예상 소요 시간 (분)
                            <input type="number" name="estimatedMinutes" value={form.estimatedMinutes} onChange={handleChange}/>
                        </label>
                        <button type="submit">등록</button>
                    </form>
                </div>
                <div className="process-material">
                    <h2>🔩 자재 소모 등록</h2>
                    <form onSubmit={handleMaterialSubmit}>
                        <label>
                            공정 선택
                            <select value={selectedProcessId} onChange={e => setSelectedProcessId(e.target.value)} required>
                                <option value="">선택</option>
                                {productProcesses.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.stepOrder}단계 - {p.process.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            자재
                            <select name="materialId" value={materialForm.materialId} onChange={handleMaterialChange}
                                    required>
                                <option value="">선택</option>
                                {materials.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            수량
                            <input type="number" name="quantity" value={materialForm.quantity}
                                   onChange={handleMaterialChange} required/>
                        </label>
                        <label>
                            단위
                            <input type="text" name="unit" value={materialForm.unit} readOnly/>
                        </label>
                        <button type="submit">등록</button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default ProductProcessPage;
