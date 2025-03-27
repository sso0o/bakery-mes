import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";  // 스타일시트 불러오기
import '../styles/CategoryManagerPage.css';

const CategoryManagerPage = () => {
    const { type } = useParams(); // URL에서 type 추출
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '', codePrefix: '', description: '' });

    // 공통 조회 함수
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/categories?type=${type}`);
            setItems(res.data);
        } catch (err) {
            console.error('조회 오류', err);
        }
    }

    // useEffect에서 type 기반으로 fetch
    useEffect(() => {
        fetchCategories();
    }, [type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            type: type,
            name: form.name,
            description: form.description
        };
        try {
            await axios.post('http://localhost:8080/api/categories', data);
            setForm({ name: '', codePrefix: '', description: '' });
            fetchCategories();
        } catch (err) {
            alert('등록 실패');
        }
    };

    // 화면에 type 이름 따라 제목 다르게 출력해도 되고
    const label =
        type === 'PROCESS' ? '공정' :
            type === 'UNIT' ? '단위' :
                type === 'STATUS' ? '상태' :
                    type === 'PRODUCT' ? '제품' :
                    '카테고리';


    return (
        <div className="page-container">
            <div className="category-list">
                <h2>📋 {label} 관리</h2>
                <table>
                    <thead>
                    <tr>
                        <th>코드</th>
                        <th>이름</th>
                        <th>설명</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(p => (
                        <tr key={p.id}>
                            <td>{p.codePrefix}</td>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="category-form">
                <h2>➕ 공정 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        코드 (예: PRC011)
                        <input type="text" name="codePrefix" value={form.codePrefix} placeholder="자동 생성됩니다" readOnly />
                    </label>
                    <label>
                        이름
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
}


export default CategoryManagerPage;
