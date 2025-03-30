import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductListPage.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        id: '',
        name: '',
        categoryId: '',
        unitOutput: 1,
        description: ''
    });
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');


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

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:8080/api/products');
        setProducts(res.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: form.name,
            category: form.categoryId ? { id: form.categoryId } : null,
            unitOutput: parseInt(form.unitOutput),
            description: form.description
        };

        try {
            if (form.id) {
                await axios.put(`http://localhost:8080/api/products/${form.id}`, data);
                alert('수정되었습니다');
            } else {
                await axios.post('http://localhost:8080/api/products', data);
                alert('등록되었습니다');
            }
            handleReset();
            fetchProducts();
        } catch (err) {
            alert('등록 실패');
        }
    };

    const handleReset = () => {
        setForm({ id: '', name: '', categoryId: '', unitOutput: 1, description: '' });
    };

    const handleRowClick = (product) => {
        setForm({
            id: product.id,
            name: product.name,
            categoryId: product.category?.id || '',
            unitOutput: product.unitOutput || '',
            description: product.description || ''
        });
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
                        <th>1회 생산량</th>
                        <th>설명</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id} onClick={() => handleRowClick(p)} style={{cursor: 'pointer'}}>
                            <td>{p.code}</td>
                            <td>{p.category?.name}</td>
                            <td>{p.name}</td>
                            <td>{p.unitOutput}</td>
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
                        <select name="categoryId" value={form.categoryId} onChange={handleChange}
                                disabled={form.id ? true : false}
                                required>
                            <option value="">선택</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        제품 이름
                        <input type="text" name="name" value={form.name} onChange={handleChange} required/>
                    </label>
                    <label>
                        1회 생산량
                        <input type="number" name="unitOutput" value={form.unitOutput} onChange={handleChange}
                               required/>
                    </label>
                    <label>
                        설명
                        <input type="text" name="description" value={form.description} onChange={handleChange}/>
                    </label>
                    <button type="submit">{form.id ? '수정' : '등록'}</button>
                </form>
                {form.id && (
                    <button type="button" onClick={handleReset}
                            style={{backgroundColor: 'green', color: 'white', marginTop: '10px', width: '100%'}}>
                        폼 리셋
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
