import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";  // 스타일시트 불러오기
import '../styles/CommonStyle2.css';
import {Button} from "react-bootstrap";

const BomPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bomList, setBOMList] = useState([]);
    const [categories, setCategories] = useState([]);

    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productRes = await axios.get('http://localhost:8080/api/products');
            setProducts(productRes.data);

            const categoryRes = await axios.get('http://localhost:8080/api/categories?type=PRODUCT');
            setCategories(categoryRes.data);

        } catch (e) {
            alert('목록 조회 실패');
        }
    };

    useEffect(() => {
        fetchBOM();
    }, [selectedProductId]);

    const fetchBOM = async () => {
        if (!selectedProductId) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/boms/${selectedProductId}`);
            setBOMList(res.data);
        } catch (e) {
            alert('BOM 조회 실패');
        }
    };

    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(p.category?.id) === searchCategory;
        return nameMatch && categoryMatch;
    });




    return (
        <div className="page-container">
            {/* 왼쪽: 제품 목록 */}
            <div className="list1-section">
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
                        <th>코드</th>
                        <th>이름</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id}
                            style={{cursor: 'pointer', backgroundColor: selectedProductId === p.id ? '#e6f7ff' : ''}}
                            onClick={() => setSelectedProductId(p.id)}>
                            <td>{p.code}</td>
                            <td>{p.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 오른쪽: BOM 테이블 */}
            <div className="list2-section">
                <h2>🧾 BOM (공정별 자재)</h2>
                {bomList.length === 0 ? (
                    <p>제품을 선택해주세요</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>공정명</th>
                            <th>순서</th>
                            <th>자재코드</th>
                            <th>자재명</th>
                            <th>소모량</th>
                            <th>단위</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bomList.map((item, idx) => {
                            const isFirst =
                                idx === 0 ||
                                item.processName !== bomList[idx - 1].processName ||
                                item.stepOrder !== bomList[idx - 1].stepOrder;

                            const rowSpan = bomList.filter(
                                (b) =>
                                    b.processName === item.processName &&
                                    b.stepOrder === item.stepOrder
                            ).length;

                            return (
                                <tr key={idx}>
                                    {isFirst && (
                                        <>
                                            <td rowSpan={rowSpan}>{item.processName}</td>
                                            <td rowSpan={rowSpan}>{item.stepOrder}</td>
                                        </>
                                    )}
                                    {!isFirst && null}
                                    <td>{item.materialCode}</td>
                                    <td>{item.materialName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};


export default BomPage;
