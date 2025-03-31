import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";  // 스타일시트 불러오기
import '../styles/CommonStyle.css';
import {Button} from "react-bootstrap";

const CategoryManagerPage = () => {
    const { type } = useParams(); // URL에서 type 추출
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        id: '',
        name: '',
        codePrefix: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, [type]);


    // 공통 조회 함수
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/categories?type=${type}`);
            setCategories(res.data);
        } catch (err) {
            console.error('조회 오류', err);
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: form.name,
            codePrefix: form.codePrefix,
            description: form.description,
            type
        };

        try {
            if (form.id) {
                await axios.put(`http://localhost:8080/api/categories/${form.id}`, data);
                alert('카테고리 수정 완료');
            } else {
                await axios.post('http://localhost:8080/api/categories', data);
                alert('카테고리 등록 완료');
            }
            handleReset();
            fetchCategories();
        } catch (err) {

            alert('등록/수정 실패');
        }

    };

    const handleReset = () => {
        setForm({ id: '', name: '', codePrefix: '', description: '' });
    };


    const handleRowClick = (c) => {
        setForm({
            id: c.id,
            name: c.name,
            codePrefix: c.codePrefix,
            description: c.description
        });
    };



    // 화면에 type 이름 따라 제목 다르게 출력해도 되고
    const label =
        type === 'PROCESS' ? '공정' :
            type === 'UNIT' ? '단위' :
                type === 'STATUS' ? '상태' :
                    type === 'PRODUCT' ? '제품 분류' :
                        type === 'MATERIAL' ? '자재 분류' :
                    '카테고리';


    return (
        <div className="page-container">
            <div className="list-section">
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
                    {categories.map(c => (
                        <tr key={c.id} onClick={() => handleRowClick(c)}
                            style={{cursor: 'pointer', background: form.id === c.id ? '#e6f7ff' : ''}} >
                            <td>{c.name}</td>
                            <td>{c.codePrefix}</td>
                            <td>{c.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="form-section">
                <h2>➕ {label} 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        코드 (예: PTP011)
                        <input type="text" name="codePrefix" value={form.codePrefix} placeholder="자동 생성됩니다" readOnly/>
                    </label>
                    <label>
                        이름
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    </label>
                    <label>
                        설명
                        <input type="text" name="description" value={form.description} onChange={handleChange} />
                    </label>
                    <Button type="submit" className="form-action-button" variant="primary">
                        {form.id ? '수정' : '등록'}
                    </Button>
                </form>
            </div>
        </div>
    );
}


export default CategoryManagerPage;
