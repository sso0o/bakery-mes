import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonStyle.css'
import {Button} from "react-bootstrap";

export default function MaterialInboundPage() {
    const [inbounds, setInbounds] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [form, setForm] = useState({
        id:'',
        categoryId:'',
        materialId: '',
        capacity: '',
        unit: '',
        itemsPerUnit: '',
        quantity: '',
        totalQuantity: '',
        inboundDate: '',
        receivedBy: '',
        note: ''
    });

    const [searchCategories, setSearchCategories] = useState([]); // 자재 카테고리
    const [searchCategoryId, setSearchCategoryId] = useState(''); // 자재 카테고리 값
    const [searchName, setSearchName] = useState(''); // 자재 이름 검색어 상태

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7); // 오늘에서 7일 빼기

    const todayFormatted = today.toISOString().split('T')[0]; // yyyy-mm-dd 형식
    const startDateFormatted = startOfWeek.toISOString().split('T')[0]; // yyyy-mm-dd 형식

    // 입고 목록 및 자재 목록 API 호출
    useEffect(() => {
        setStartDate(startDateFormatted); // 시작일 초기값 설정
        setEndDate(todayFormatted);   // 종료일 초기값 설정

        // 로그인한 사용자 정보와 오늘 날짜를 폼에 자동 세팅
        setForm({
            id:'',
            categoryId:'',
            materialId: '',
            capacity: '',
            unit: '',
            itemsPerUnit: '',
            quantity: '',
            totalQuantity: '',
            inboundDate: todayFormatted,
            receivedBy: user ? user.name : '',  // 로그인한 사용자 이름 세팅
            note: ''  // 비고 값 초기화
        });

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const materialsRes = await axios.get('http://localhost:8080/api/materials');
            setMaterials(materialsRes.data);

            // 날짜 범위에 맞는 입고 목록 조회
            const inboundsRes = await axios.get('http://localhost:8080/api/inbound', {
                params: {
                    startDate: startDateFormatted,
                    endDate: todayFormatted
                }
            });
            setInbounds(inboundsRes.data);

            const categoriesRes = await axios.get('http://localhost:8080/api/categories?type=MATERIAL');
            setCategories(categoriesRes.data);
            setSearchCategories(categoriesRes.data);
        } catch (error) {
            console.error("데이터 로딩 실패", error);
        }
    };

    const handleRowClick = (i) => {
        // 취소된 건 무시
        if (i.status === 'CANCELED') return;

        setForm({
            id: i.id,
            materialId: String(i.material.id),
            categoryId: String(i.material.category.id),
            capacity: i.material.capacity,
            unit: i.unit,
            itemsPerUnit: i.itemsPerUnit,
            quantity: i.quantity,
            totalQuantity: i.totalQuantity,
            inboundDate: i.inboundDate,
            receivedBy: i.receivedBy,
            note: i.note || ''
        });
        setCategoryId(String(i.material.category.id)); // 자재 필터 유지
    };



    // 자재 입력 시 폼 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => {
            const updatedForm = { ...prev, [name]: value };

            // 자재 선택 시 단위 자동 설정
            if (name === 'materialId') {
                const selected = materials.find(m => m.id === parseInt(value));
                if (selected) {
                    updatedForm.capacity = selected.capacity; // 용량 자동 설정
                    updatedForm.unit = selected.unit;  // 자재의 단위 자동 설정
                    updatedForm.itemsPerUnit = selected.itemsPerUnit;  // itemsPerUnit 자동 설정
                }
            }

            // quantity 또는 itemsPerUnit이 변경되면 totalQuantity 자동 계산
            if (name === 'quantity' || name === 'itemsPerUnit') {
                const quantity = parseFloat(updatedForm.quantity) || 1;
                const itemsPerUnit = parseInt(updatedForm.itemsPerUnit) || 1;
                updatedForm.totalQuantity = quantity * itemsPerUnit;  // totalQuantity 계산
            }

            return updatedForm;
        });
    };

    // 입고 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            material: { id: form.materialId },
            quantity: parseFloat(form.quantity),
            capacity: form.capacity,
            unit: form.unit,
            itemsPerUnit: parseInt(form.itemsPerUnit),
            totalQuantity: parseFloat(form.totalQuantity),
            inboundDate: form.inboundDate || null,
            receivedBy: form.receivedBy,
            note: form.note
        };

        try {
            if (form.id) {
                // 수정 요청 (PUT)
                await axios.put(`http://localhost:8080/api/inbound/${form.id}`, data);
                alert('입고 정보가 수정되었습니다.');
            } else {
                // 신규 등록
                await axios.post('http://localhost:8080/api/inbound', data);
                alert('입고 정보가 등록되었습니다.');
            }
        } catch (error) {
            alert('입고 등록/수정 실패');
        }

        // 등록 및 수정 후 폼 초기화
        handleReset()
        // 입고 목록 갱신
        const updated = await axios.get('http://localhost:8080/api/inbound', {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        setInbounds(updated.data);
    };

    // 폼 초기화
    const handleReset = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        setForm({
            id: '',
            categoryId: '',
            materialId: '',
            capacity: '',
            unit: '',
            itemsPerUnit: '',
            quantity: '',
            totalQuantity: '',
            inboundDate: todayFormatted,  // 오늘 날짜 유지
            receivedBy: user ? user.name : '',
            note: ''
        });
        setCategoryId('');  // 카테고리 선택 초기화
    };

    // 입고 취소
    const handleCancel = async () => {
        if (!form.id) {
            alert('취소할 입고 내역을 선택하세요.');
            return;
        }

        const confirmDelete = window.confirm('정말로 취소하시겠습니까?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/inbound/${form.id}`);
            alert('취소되었습니다.');
            // 삭제 후 폼 리셋 및 입고 목록 갱신
            handleReset();  // 폼 초기화
            const updatedInbounds = await axios.get('http://localhost:8080/api/inbound', {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
            setInbounds(updatedInbounds.data);  // 입고 목록 갱신
        } catch (err) {
            alert('취소 실패');
        }
    };


    // 카테고리 선택 시 폼 값 초기화
    const handleCategoryChange = (e) => {
        const { value } = e.target;
        handleReset()
        setCategoryId(value);  // 카테고리 선택 값 설정
    };

    // 자재 입고 목록 필터링 (이름과 카테고리 기준)
    const filteredInbounds = inbounds.filter(i => {
        const nameMatch = i.material.name.toLowerCase().includes(searchName.toLowerCase()); // 자재 이름 필터링
        const categoryMatch = searchCategoryId === '' || String(i.material.category?.id) === searchCategoryId; // 카테고리 필터링
        return nameMatch && categoryMatch; // 조건 모두 만족할 때만 반환
    });


    // 자재 목록 필터링 (이름과 카테고리 기준) <-
    const filteredMaterials = materials.filter(m => {
        const categoryMatch = categoryId === '' || String(m.category?.id) === categoryId; // 카테고리 필터링
        return categoryMatch; // 두 조건이 모두 참일 때만 해당 자재를 반환
    });


    return (
        <div className="page-container">
            {/* 왼쪽: 자재 현황 */}
            <div className="list-section">
                <h2>📦 자재 입고 현황</h2>
                <div className="search-section">
                    <select value={searchCategoryId} onChange={e => setSearchCategoryId(e.target.value)}>
                        <option value="">전체 카테고리</option>
                        {searchCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            placeholder="시작일"
                    /> ~
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        placeholder="종료일"
                    />
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
                        <th>제공업체</th>
                        <th>자재</th>
                        <th>용량</th>
                        <th>단위</th>
                        <th>수량</th>
                        <th>입고일</th>
                        <th>비고</th>
                        <th>담당자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInbounds.map(i => (
                        <tr key={i.id}
                            onClick={() => handleRowClick(i)}
                            style={{ cursor: i.status === 'CANCELED' ? 'default' : 'pointer' , background: form.id === i.id ? '#e6f7ff' : ''}}
                            className={i.status === 'CANCELED' ? 'inbound-row-canceled' : ''} >
                            <td>{i.material.category.name}</td>
                            <td>{i.material.manufacturer}</td>
                            <td>{i.material.name}</td>
                            <td>{i.material.capacity}</td>
                            <td>{i.unit}</td>
                            <td>{i.quantity}</td>
                            <td>{i.inboundDate}</td>
                            <td>{i.description}</td>
                            <td>{i.receivedBy}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 오른쪽: 자재 입고 폼 */}
            <div className="form-section">
                <h2>➕ 자재 입고 {form.id ? '수정' : '등록'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        자재 카테고리
                        <select value={categoryId} onChange={handleCategoryChange} disabled={form.id ? true : false}
                                required>
                            <option value="">선택</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        자재 선택
                        <select name="materialId" value={form.materialId} onChange={handleChange}
                                disabled={form.id ? true : false} required>
                            <option value="">선택</option>
                            {filteredMaterials.map(m => (
                                <option key={m.id} value={m.id}>[{m.manufacturer}] {m.name}</option>
                            ))}
                        </select>
                    </label>
                    <div className="row-inline">
                        <label>
                            용량
                            <input type="text" name="capacity" value={form.capacity} readOnly/>
                        </label>
                        <label>
                            단위
                            <input type="text" name="unit" value={form.unit} readOnly/>
                        </label>
                        <label>
                            단위당 갯수
                            <input type="number" name="itemsPerUnit" value={form.itemsPerUnit} onChange={handleChange}
                                   readOnly required/>
                        </label>
                    </div>
                    <div className="row-inline">
                        <label>
                            수량
                            <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
                                   required/>
                        </label>
                        <label>
                            총 수량
                            <input type="number" name="totalQuantity" value={form.totalQuantity} readOnly/>
                        </label>
                    </div>
                    <label>
                        입고일
                        <input type="date" name="inboundDate" value={form.inboundDate} onChange={handleChange}
                               disabled={form.id ? true : false} required/>
                    </label>
                    <label>
                        담당자
                        <input type="text" name="receivedBy" value={form.receivedBy} onChange={handleChange} required/>
                    </label>
                    <label>
                        비고
                        <input type="text" name="note" value={form.note} onChange={handleChange}/>
                    </label>
                    <Button type="submit" className="form-action-button" variant="primary">
                        입고 {form.id ? '수정' : '등록'}
                    </Button>
                </form>
                {/* 삭제 버튼 추가 */}
                {form.id && (
                    <>
                        <Button
                            type="button"
                            onClick={handleReset}
                            variant="success"
                            className="form-action-button">
                            폼 리셋
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="danger"
                            className="form-action-button">
                            입고 취소
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
