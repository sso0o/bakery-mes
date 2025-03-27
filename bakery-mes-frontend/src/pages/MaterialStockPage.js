import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MaterialStockPage.css'; // CSS 불러오기

export default function MaterialStockPage() {
    const [stocks, setStocks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [stockRes, categoryRes] = await Promise.all([
                axios.get('http://localhost:8080/api/materials/stocks'),
                axios.get(`http://localhost:8080/api/categories?type=MTP`)
            ]);
            setStocks(stockRes.data);
            setCategories(categoryRes.data);
        } catch (e) {
            alert('데이터 불러오기 실패');
        }
    };

    const filtered = stocks.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = !searchCategory || s.categoryName === categories.find(c => c.id == searchCategory)?.name;
        return nameMatch && categoryMatch;
    });

    return (
        <div className="page-container">
            <div className="stock-table">
                <h2>📦 자재 재고 현황</h2>

                <div className="stock-search">
                    <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                        <option value="">전체 카테고리</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="자재명 검색"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>코드</th>
                        <th>카테고리</th>
                        <th>자재명</th>
                        <th>제조사</th>
                        <th>수량</th>
                        <th>단위</th>
                        <th>최종 입고일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(s => (
                        <tr key={s.materialId}>
                            <td>{s.code}</td>
                            <td>{s.categoryName}</td>
                            <td>{s.name}</td>
                            <td>{s.manufacturer}</td>
                            <td>{s.quantity}</td>
                            <td>{s.unit}</td>
                            <td>{s.lastInboundDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}
