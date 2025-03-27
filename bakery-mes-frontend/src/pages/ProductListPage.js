import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductListPage.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        categoryId: '',
        description: ''
    });
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:8080/api/products');
        setProducts(res.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProducts();

                const categoryRes = await axios.get('http://localhost:8080/api/categories?type=PRODUCT');
                setCategories(categoryRes.data);
            } catch (e) {
                alert('카테고리 로딩 실패');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: form.name,
            category: form.categoryId ? { id: form.categoryId } : null,
            description: form.description
        };

        try {
            await axios.post('http://localhost:8080/api/products', data);
            setForm({ name: '', categoryId: '', description: '' });
            fetchProducts();
        } catch (err) {
            alert('등록 실패');
        }
    };

    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(p.category?.id) === searchCategory;
        return nameMatch && categoryMatch;
    });

    return (
        <div className="page-container">
            <div className="product-list">
                <h2>📋 제품 목록</h2>
                <div className="product-search">
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
                        <th>카테고리</th>
                        <th>이름</th>
                        <th>설명</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id}>
                            <td>{p.code}</td>
                            <td>{p.category?.name}</td>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="product-form">
                <h2>➕ 제품 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        제품 종류
                        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                            <option value="">선택</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        제품 이름
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    </label>
                    <label>
                        설명
                        <input type="text" name="description" value={form.description} onChange={handleChange} />
                    </label>
                    <button type="submit">등록</button>
                </form>
            </div>
        </div>
    );
};

export default ProductListPage;
