import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MaterialInboundPage.css';

export default function MaterialInboundPage() {
    const [inbounds, setInbounds] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [form, setForm] = useState({
        id:'',
        categoryId:'',
        materialId: '',
        quantity: 1,
        unit: '',
        itemsPerUnit:1,
        totalQuantity:1,
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
            quantity: 1,
            unit: '',
            itemsPerUnit:1,
            totalQuantity:1,
            inboundDate: todayFormatted,
            receivedBy: user ? user.name : '',  // 로그인한 사용자 이름 세팅
            note: ''  // 비고 값 초기화
        });

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

                const categoriesRes = await axios.get('http://localhost:8080/api/categories?type=MTP');
                setCategories(categoriesRes.data);
                setSearchCategories(categoriesRes.data);
            } catch (error) {
                console.error("데이터 로딩 실패", error);
            }
        };

        fetchData();
    }, []);


    // 자재 입력 시 폼 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => {
            const updatedForm = { ...prev, [name]: value };

            // 자재 선택 시 단위 자동 설정
            if (name === 'materialId') {
                const selected = materials.find(m => m.id === parseInt(value));
                if (selected) {
                    updatedForm.unit = selected.unit;  // 자재의 단위 자동 설정
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

    // 테이블 클릭 시 수정 폼에 해당 자재 정보 세팅
    const handleRowClick = (i) => {
        setForm({
            id:i.id,
            categoryId:i.material.category.id,
            materialId: i.material.id,
            quantity: i.quantity,
            unit: i.unit,
            itemsPerUnit: i.itemsPerUnit,
            totalQuantity: i.totalQuantity,
            inboundDate: i.inboundDate,
            receivedBy: i.receivedBy,
            note: i.note,
        });
        setCategoryId(i.material.category.id);  // 카테고리 아이디를 동기화

    };

    // 입고 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inbound = {
            material: { id: form.materialId },
            quantity: parseFloat(form.quantity),
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
                await axios.put(`http://localhost:8080/api/inbound/${form.id}`, inbound);
                alert('입고 정보가 수정되었습니다.');
            } else {
                // 신규 등록
                await axios.post('http://localhost:8080/api/inbound', inbound);
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
            materialId: '',
            quantity: 1,
            unit: '',
            itemsPerUnit: 1,
            totalQuantity: 1,
            inboundDate: todayFormatted,  // 오늘 날짜 유지
            receivedBy: user ? user.name : '',
            note: ''
        });
        setCategoryId('');  // 카테고리 선택 초기화
    };

    // 입고 삭제
    const handleDelete = async () => {
        if (!form.id) {
            alert('삭제할 자재를 선택하세요.');
            return;
        }

        const confirmDelete = window.confirm('정말로 자재를 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/inbound/${form.id}`);
            alert('자재가 삭제되었습니다.');
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
            alert('삭제 실패');
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
        <div className="inbound-page-container">
            {/* 왼쪽: 자재 현황 */}
            <div className="inbound-list">
                <h2>📦 자재 입고 현황</h2>
                <div className="material-search">
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
                        <th>수량</th>
                        <th>단위</th>
                        <th>입고일</th>
                        <th>비고</th>
                        <th>담당자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInbounds.map(i => (
                        <tr key={i.id} onClick={() => handleRowClick(i)}  style={{cursor: 'pointer'}} >
                            <td>{i.material.category.name}</td>
                            <td>{i.material.manufacturer}</td>
                            <td>{i.material.name}</td>
                            <td>{i.quantity}</td>
                            <td>{i.unit}</td>
                            <td>{i.inboundDate}</td>
                            <td>{i.description}</td>
                            <td>{i.receivedBy}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 오른쪽: 자재 입고 폼 */}
            <div className="inbound-form">
                <h2>➕ 자재 입고 {form.id ? '수정' : '등록'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        자재 카테고리
                        <select value={categoryId} onChange={handleCategoryChange} disabled={form.id ? true : false} required>
                            <option value="">선택</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        자재 선택
                        <select name="materialId" value={form.materialId} onChange={handleChange} disabled={form.id ? true : false} required>
                            <option value="">선택</option>
                            {filteredMaterials.map(m => (
                                <option key={m.id} value={m.id}>[{m.manufacturer}] {m.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        수량
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required/>
                    </label>
                    <label>
                        단위
                        <input type="text" name="unit" value={form.unit} readOnly/>
                    </label>
                    <label>
                        단위당 갯수
                        <input type="number" name="itemsPerUnit" value={form.itemsPerUnit} onChange={handleChange} required/>
                    </label>
                    <label>
                        총 수량
                        <input type="number" name="totalQuantity" value={form.totalQuantity} readOnly/>
                    </label>
                    <label>
                        입고일
                        <input type="date" name="inboundDate" value={form.inboundDate} onChange={handleChange}/>
                    </label>
                    <label>
                        담당자
                        <input type="text" name="receivedBy" value={form.receivedBy} onChange={handleChange} required/>
                    </label>
                    <label>
                        비고
                        <input type="text" name="note" value={form.note} onChange={handleChange}/>
                    </label>
                    <button type="submit">입고 {form.id ? '수정' : '등록'}</button>
                </form>
                {/* 삭제 버튼 추가 */}
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
}
