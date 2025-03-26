import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/CategoryManager.css';  // 스타일시트 불러오기

const CategoryManager = () => {
    const { type } = useParams();  // URL에서 'type' 파라미터를 가져옴
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', codePrefix: '', description: '' });

    const fetchCategories = () => {
        axios.get(`http://localhost:8080/api/categories?type=${type}`)
            .then(res => setCategories(res.data));
    };

    useEffect(() => {
        fetchCategories();
    }, [type]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/categories', {
            ...form,
            type
        }).then(() => {
            setForm({ name: '', codePrefix: '', description: '' });
            fetchCategories();
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('정말 삭제할까요?')) return;
        axios.delete(`http://localhost:8080/api/categories/${id}`)
            .then(() => fetchCategories())
            .catch((err) => {
                console.error(err);
                alert('삭제 실패');
            });
    };

    return (
        <div className="container">
            {/* 테이블을 왼쪽에 배치 */}
            <div className="table-container">
                <h2>{type} 카테고리 관리</h2>
                {/* 카테고리 목록 테이블 */}
                <table>
                    <thead>
                    <tr>
                        <th>이름</th>
                        <th>Prefix</th>
                        <th>설명</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.codePrefix}</td>
                            <td>{c.description}</td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 폼을 오른쪽에 배치 */}
            <div className="form-container">
                {/* 카테고리 등록 폼 */}
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="이름"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="codePrefix"
                        placeholder="코드 Prefix"
                        value={form.codePrefix}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="설명"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <button type="submit">등록</button>
                </form>
            </div>
        </div>
    );
};

export default CategoryManager;
