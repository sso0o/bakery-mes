import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MaterialStockPage() {
    const [stocks, setStocks] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [stockRes, categoryRes] = await Promise.all([
            axios.get('http://localhost:8080/api/materials/stocks'),
            axios.get('http://localhost:8080/api/materials/categories')
        ]);
        setStocks(stockRes.data);
        setCategories(categoryRes.data);
    };

    const filtered = stocks.filter(s => {
        const nameMatch = s.materialName.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(s.categoryId) === searchCategory;
        return nameMatch && categoryMatch;
    });

    return (
        <div className="page-container">
            <div className="stock-list">
                <h2>📦 자재 재고 현황</h2>

                <div className="material-search">
                    <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                        <option value="">전체 카테고리</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="자재 이름 검색"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>자재</th>
                        <th>제조사</th>
                        <th>재고량</th>
                        <th>단위</th>
                        <th>최종입고일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(s => (
                        <tr key={s.materialId}>
                            <td>{s.categoryName}</td>
                            <td>{s.materialName}</td>
                            <td>{s.manufacturer}</td>
                            <td>{s.quantity}</td>
                            <td>{s.unit}</td>
                            <td>{s.updatedAt?.split('T')[0]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
