import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/MaterialRegisterPage.css';

const MaterialRegisterPage = () => {
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [form, setForm] = useState({
        id: '',
        name: '',
        categoryId: '',
        unit: '',
        itemsPerUnit: 1,
        outUnit:'',
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

    const handleRowClick = (m) => {
        // 행을 클릭하면 해당 자재 데이터를 폼에 세팅
        setForm({
            id: m.id, // id를 추가하여 수정 모드로 설정
            name: m.name,
            categoryId: m.category?.id || '',
            unit: m.unit,
            itemsPerUnit: m.itemsPerUnit,
            outUnit: m.outUnit || '',
            manufacturer: m.manufacturer,
            description: m.description || ''
        });
    };

    // 폼 초기화
    const handleReset = () => {
        setForm({
            id: '',
            name: '',
            categoryId: '',
            unit: '',
            itemsPerUnit: 1,
            outUnit:'',
            manufacturer: '',
            description: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: form.name,
            unit: form.unit,
            itemsPerUnit: form.itemsPerUnit,
            outUnit: form.outUnit,
            manufacturer: form.manufacturer,
            category: form.categoryId ? { id: form.categoryId } : null,
            description: form.description
        };

        try {
            if (form.id) {
                // 수정
                await axios.put(`http://localhost:8080/api/materials/${form.id}`, data);
                alert('자재가 수정되었습니다.');
            } else {
                // 등록
                await axios.post('http://localhost:8080/api/materials', data);
                const move = window.confirm('자재가 등록되었습니다.\n입고 처리를 하시겠습니까?');
                if (move) {
                    navigate('/inbound');
                } else {
                    setForm({ id:'', name: '', categoryId: '', unit: '', itemsPerUnit:1, outUnit:'', manufacturer: '', description: '' });
                }
            }
            fetchMaterials();

        } catch (err) {
            alert('등록 실패');
        }
    };

    const handleDelete = async () => {
        if (!form.id) {
            alert('삭제할 자재를 선택하세요.');
            return;
        }

        const confirmDelete = window.confirm('정말로 자재를 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/materials/${form.id}`);
            alert('자재가 삭제되었습니다.');
            setForm({ id:'', name: '', categoryId: '', unit: '', itemsPerUnit:1, outUnit:'', manufacturer: '', description: '' });
            fetchMaterials(); // 자재 목록 새로고침
        } catch (err) {
            alert('삭제 실패');
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
                        <th>입고단위</th>
                        <th>소모단위</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMaterials.map(m => (
                        <tr key={m.id} onClick={() => handleRowClick(m)} style={{cursor: 'pointer'}}>
                            <td>{m.code}</td>
                            <td>{m.category?.name}</td>
                            <td>{m.name}</td>
                            <td>{m.manufacturer}</td>
                            <td>{m.unit} {m.itemsPerUnit > 1 ? `(${m.itemsPerUnit})` : '' }</td>
                            <td>{m.outUnit}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="material-form">
                <h2>➕ 자재 {form.id ? '수정' : '등록'}</h2>
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
                        <input type="text" name="manufacturer" value={form.manufacturer} onChange={handleChange}
                               required/>
                    </label>
                    <label>
                        입고 단위
                        <select name="unit" value={form.unit} onChange={handleChange} required>
                            <option value="">선택</option>
                            {units.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        단위당 갯수
                        <input type="number" name="itemsPerUnit" value={form.itemsPerUnit} onChange={handleChange} required/>
                    </label>
                    <label>
                        소모 단위
                        <select name="outUnit" value={form.outUnit} onChange={handleChange} required>
                            <option value="">선택</option>
                            {units.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        설명
                        <input type="text" name="description" value={form.description} onChange={handleChange}/>
                    </label>
                    <button type="submit">{form.id ? '수정' : '등록'}</button>
                </form>
                {/* 리셋, 삭제 버튼 추가 */}
                {form.id && (
                    <>
                        <button type="button" onClick={handleReset}
                                style={{backgroundColor: 'green', color: 'white', marginTop: '10px', width: '100%'}}>
                            폼 리셋
                        </button>
                        <button type="button" onClick={handleDelete}
                                style={{backgroundColor: 'red', color: 'white', marginTop: '10px', width: '100%'}}>
                            삭제
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MaterialRegisterPage;
