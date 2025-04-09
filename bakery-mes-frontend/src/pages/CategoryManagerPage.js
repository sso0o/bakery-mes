import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonStyle.css';
import { Button, Tab, Tabs } from 'react-bootstrap';

const typeLabelMap = {
    PROCESS: '공정',
    UNIT: '단위',
    STATUS: '상태',
    PRODUCT: '제품 분류',
    MATERIAL: '자재 분류',
};

const tabTypes = Object.keys(typeLabelMap);

const CategoryManagerPage = () => {
    const [type, setType] = useState('PROCESS'); // 기본 탭
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


    return (
        <div style={{display: 'block', width: '100%'}}>
            <Tabs
                id="category-tab"
                activeKey={type}
                onSelect={(k) => setType(k)} >
                {tabTypes.map((t) => (
                    <Tab eventKey={t} title={typeLabelMap[t]} key={t}/>
                ))}
            </Tabs>

            <div className="page-container">
                <div className="list-section">
                    <h2>📋 {typeLabelMap[type]} 목록</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>이름</th>
                            <th>코드</th>
                            <th>설명</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map(c => (
                            <tr
                                key={c.id}
                                onClick={() => handleRowClick(c)}
                                style={{
                                    cursor: 'pointer',
                                    background: form.id === c.id ? '#e6f7ff' : '',
                                }}
                            >
                                <td>{c.name}</td>
                                <td>{c.codePrefix}</td>
                                <td>{c.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-section">
                    <h2>➕ {typeLabelMap[type]} 등록</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            코드
                            <input
                                type="text"
                                name="codePrefix"
                                value={form.codePrefix}
                                placeholder="자동 생성됩니다"
                                readOnly
                            />
                        </label>
                        <label>
                            이름
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            설명
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </label>
                        <Button type="submit" className="form-action-button" variant="primary">
                            {form.id ? '수정' : '등록'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
        // <div className="page-container">
        //
        //         {tabTypes.map((type) => (
        //             <Tab eventKey={type} title={typeLabelMap[type]} key={type}>
        //                 <div className="list-section">
        //                     <h2>📋 {typeLabelMap[type]} 목록</h2>
        //                     <table>
        //                         <thead>
        //                         <tr>
        //                             <th>이름</th>
        //                             <th>코드</th>
        //                             <th>설명</th>
        //                         </tr>
        //                         </thead>
        //                         <tbody>
        //                         {categories.map(c => (
        //                             <tr key={c.id} onClick={() => handleRowClick(c)}
        //                                 style={{ cursor: 'pointer', background: form.id === c.id ? '#e6f7ff' : '' }}>
        //                                 <td>{c.name}</td>
        //                                 <td>{c.codePrefix}</td>
        //                                 <td>{c.description}</td>
        //                             </tr>
        //                         ))}
        //                         </tbody>
        //                     </table>
        //                 </div>
        //                 <div className="form-section">
        //                     <h2>➕ {typeLabelMap[type]} 등록</h2>
        //                     <form onSubmit={handleSubmit}>
        //                         <label>
        //                             코드
        //                             <input type="text" name="codePrefix" value={form.codePrefix} placeholder="자동 생성됩니다" readOnly />
        //                         </label>
        //                         <label>
        //                             이름
        //                             <input type="text" name="name" value={form.name} onChange={handleChange} required />
        //                         </label>
        //                         <label>
        //                             설명
        //                             <input type="text" name="description" value={form.description} onChange={handleChange} />
        //                         </label>
        //                         <Button type="submit" className="form-action-button" variant="primary">
        //                             {form.id ? '수정' : '등록'}
        //                         </Button>
        //                     </form>
        //                 </div>
        //             </Tab>
        //         ))}
        //
        // </div>
    );


    // return (
    //     <div className="page-container">
    //         <div className="list-section">
    //             <h2>📋 {label} 관리</h2>
    //             <table>
    //                 <thead>
    //                 <tr>
    //                     <th>코드</th>
    //                     <th>이름</th>
    //                     <th>설명</th>
    //                 </tr>
    //                 </thead>
    //                 <tbody>
    //                 {categories.map(c => (
    //                     <tr key={c.id} onClick={() => handleRowClick(c)}
    //                         style={{cursor: 'pointer', background: form.id === c.id ? '#e6f7ff' : ''}} >
    //                         <td>{c.name}</td>
    //                         <td>{c.codePrefix}</td>
    //                         <td>{c.description}</td>
    //                     </tr>
    //                 ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //         <div className="form-section">
    //             <h2>➕ {label} 등록</h2>
    //             <form onSubmit={handleSubmit}>
    //                 <label>
    //                     코드 (예: PTP011)
    //                     <input type="text" name="codePrefix" value={form.codePrefix} placeholder="자동 생성됩니다" readOnly/>
    //                 </label>
    //                 <label>
    //                     이름
    //                     <input type="text" name="name" value={form.name} onChange={handleChange} required />
    //                 </label>
    //                 <label>
    //                     설명
    //                     <input type="text" name="description" value={form.description} onChange={handleChange} />
    //                 </label>
    //                 <Button type="submit" className="form-action-button" variant="primary">
    //                     {form.id ? '수정' : '등록'}
    //                 </Button>
    //             </form>
    //         </div>
    //     </div>
    // );
}


export default CategoryManagerPage;
