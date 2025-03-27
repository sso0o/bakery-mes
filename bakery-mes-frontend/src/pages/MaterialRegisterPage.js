import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/MaterialRegisterPage.css';

const MaterialRegisterPage = () => {
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [form, setForm] = useState({
        name: '',
        categoryId: '',
        unit: '',
        manufacturer: '',
        description: ''
    });

    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    const navigate = useNavigate();

    const fetchMaterials = async () => {
        const res = await axios.get('http://localhost:8080/api/materials');
        setMaterials(res.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchMaterials();

                const categoryRes = await axios.get('http://localhost:8080/api/categories?type=MTP');
                setCategories(categoryRes.data);

                const unitRes = await axios.get('http://localhost:8080/api/categories?type=UNIT');
                setUnits(unitRes.data);
            } catch (e) {
                alert('카테고리 또는 단위 로딩 실패');
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
            unit: form.unit,
            manufacturer: form.manufacturer,
            category: form.categoryId ? { id: form.categoryId } : null,
            description: form.description
        };

        try {
            await axios.post('http://localhost:8080/api/materials', data);
            const move = window.confirm('자재가 등록되었습니다.\n입고 처리를 하시겠습니까?');
            if (move) {
                navigate('/inbound');
            } else {
                setForm({ name: '', categoryId: '', unit: '', manufacturer: '' });
                fetchMaterials();
            }
        } catch (err) {
            alert('등록 실패');
        }
    };

    const filteredMaterials = materials.filter(m => {
        const nameMatch = m.name.toLowerCase().includes(searchName.toLowerCase());
        const categoryMatch = searchCategory === '' || String(m.category?.id) === searchCategory;
        return nameMatch && categoryMatch;
    });

    return (
        <div className="page-container">
            <div className="material-list">
                <h2>📋 자재 목록</h2>

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
                        <th>코드</th>
                        <th>카테고리</th>
                        <th>이름</th>
                        <th>회사</th>
                        <th>단위</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMaterials.map(m => (
                        <tr key={m.id}>
                            <td>{m.code}</td>
                            <td>{m.category?.name}</td>
                            <td>{m.name}</td>
                            <td>{m.manufacturer}</td>
                            <td>{m.unit}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="material-form">
                <h2>➕ 자재 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        카테고리
                        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                            <option value="">선택</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        자재 이름
                        <input type="text" name="name" value={form.name} onChange={handleChange} required/>
                    </label>
                    <label>
                        제조사 / 공급업체
                        <input type="text" name="manufacturer" value={form.manufacturer} onChange={handleChange} required/>
                    </label>
                    <label>
                        단위
                        <select name="unit" value={form.unit} onChange={handleChange} required>
                            <option value="">선택</option>
                            {units.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        설명
                        <input type="text" name="description" value={form.description} onChange={handleChange} required/>
                    </label>
                    <button type="submit">등록</button>
                </form>
            </div>
        </div>
    );
};

export default MaterialRegisterPage;
