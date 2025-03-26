import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ type = 'PRODUCT' }) => {
    const [items, setItems] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [form, setForm] = useState({
        code: '',
        name: '',
        category: '',
        recipeInfo: ''
    });

    // 목록 불러오기
    const fetchItems = () => {
        axios.get(`http://localhost:8080/api/products`) // 이 부분은 type 따라 분기 가능
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchItems();

        axios.get(`http://localhost:8080/api/categories?type=${type}`)
            .then(res => setCategoryList(res.data))
            .catch(err => console.error(err));
    }, [type]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/products', form) // 이 부분도 type 따라 변경 가능
            .then(() => {
                alert(`${type}가 등록되었습니다!`);
                setForm({ code: '', name: '', category: '', recipeInfo: '' });
                fetchItems();
            })
            .catch(err => {
                console.error(err);
                alert('등록 실패');
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>{type} 목록</h2>
            <table border="1" cellPadding="10">
                <thead>
                <tr>
                    <th>타입</th>
                    <th>코드</th>
                    <th>이름</th>
                    <th>카테고리</th>
                    <th>레시피</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.category?.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.category?.name}</td>
                        <td>{item.recipeInfo}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>➕ {type} 등록</h3>
            <form onSubmit={handleSubmit}>
                <input
                    name="code"
                    value={form.code}
                    placeholder="자동 생성"
                    readOnly
                />
                <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />

                <select
                    name="category"
                    value={form.category?.id || ''}
                    onChange={(e) => {
                        const selected = categoryList.find(c => c.id === Number(e.target.value));
                        setForm(prev => ({
                            ...prev,
                            category: selected,
                            code: ''
                        }));

                        axios.get(`http://localhost:8080/api/products/generate-code?categoryId=${selected.id}`)
                            .then(res => {
                                setForm(prev => ({ ...prev, code: res.data }));
                            })
                            .catch(err => alert('코드 생성 실패'));
                    }}
                    required
                >
                    <option value="">카테고리 선택</option>
                    {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <br />
                <textarea
                    name="recipeInfo"
                    placeholder="레시피 정보"
                    value={form.recipeInfo}
                    onChange={handleChange}
                    rows={4} cols={50}
                />
                <br />
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default ProductList;