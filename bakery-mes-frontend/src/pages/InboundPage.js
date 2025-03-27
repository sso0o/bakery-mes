import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/InboundPage.css';

export default function InboundPage() {
    const [inbounds, setInbounds] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [form, setForm] = useState({
        materialId: '',
        quantity: '',
        unit: '',
        inboundDate: '',
        receivedBy: '',
        note: ''
    });
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');

    const [searchName, setSearchName] = useState(''); // 자재 이름 검색어 상태
    const [searchCategory, setSearchCategory] = useState(''); // 자재 카테고리 검색어 상태
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (yyyy-mm-dd)

    // 입고 목록 및 자재 목록 API 호출
    useEffect(() => {
        setStartDate(today); // 시작일 초기값 설정
        setEndDate(today);   // 종료일 초기값 설정

        // 로그인한 사용자 정보와 오늘 날짜를 폼에 자동 세팅
        setForm({
            materialId: '',
            quantity: '',
            unit: '',
            inboundDate: today,
            receivedBy: user ? user.name : '',  // 로그인한 사용자 이름 세팅
            note: ''  // 비고 값 초기화
        });

        const fetchData = async () => {
            try {
                const materialsRes = await axios.get('http://localhost:8080/api/materials');
                setMaterials(materialsRes.data);

                const inboundsRes = await axios.get('http://localhost:8080/api/inbound');
                setInbounds(inboundsRes.data);

                const categoriesRes = await axios.get('http://localhost:8080/api/categories?type=MTP');
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error("데이터 로딩 실패", error);
            }
        };

        fetchData();
    }, []);

    // 자재 입고 목록 필터링 (이름과 카테고리 기준)
    const filteredInbounds = inbounds.filter(i => {
        const nameMatch = i.material.name.toLowerCase().includes(searchName.toLowerCase()); // 자재 이름 필터링
        const categoryMatch = searchCategory === '' || String(i.material.category?.id) === searchCategory; // 카테고리 필터링
        const dateMatch =
            (startDate === '' || new Date(i.inboundDate) >= new Date(startDate)) &&
            (endDate === '' || new Date(i.inboundDate) <= new Date(endDate)); // 날짜 범위 필터링
        return nameMatch && categoryMatch && dateMatch; // 세 조건 모두 만족할 때만 반환
    });


    // 자재 목록 필터링 (이름과 카테고리 기준)
    const filteredMaterials = materials.filter(m => {
        const nameMatch = m.name.toLowerCase().includes(searchName.toLowerCase()); // 자재 이름 필터링
        const categoryMatch = searchCategory === '' || String(m.category?.id) === searchCategory; // 카테고리 필터링
        return nameMatch && categoryMatch; // 두 조건이 모두 참일 때만 해당 자재를 반환
    });

    // 카테고리 선택 시 폼 값 초기화
    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setCategoryId(value);  // 카테고리 선택 값 설정
        setSearchCategory(value);  // 검색 카테고리도 동기화

        // 카테고리 변경 시 폼 값 초기화 (categoryId 제외)
        const user = JSON.parse(localStorage.getItem('user')); // 로그인한 사용자 정보
        setForm({
            materialId: '',
            quantity: '',
            unit: '',
            inboundDate: today,  // 오늘 날짜 유지
            receivedBy: user ? user.name : '',  // 로그인한 사용자 이름 유지
            note: form.note  // 기존 비고 값 유지
        });
    };


    // 자재 입력 시 폼 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // 자재 선택 시 단위 자동 설정
        if (name === 'materialId') {
            const selected = materials.find(m => m.id === parseInt(value));
            if (selected) {
                setForm(prev => ({ ...prev, unit: selected.unit }));
            }
        }
    };



    // 입고 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inbound = {
            material: { id: form.materialId },
            quantity: parseFloat(form.quantity),
            unit: form.unit,
            inboundDate: form.inboundDate || null,
            receivedBy: form.receivedBy,
            note: form.note
        };

        if (!form.unit) {
            alert('단위가 비어 있습니다. 다시 선택해 주세요.');
            return;
        }

        await axios.post('http://localhost:8080/api/inbound', inbound);
        setForm({ materialId: '', quantity: '', unit: '', note: '' });


        const updated = await axios.get('http://localhost:8080/api/inbound');
        setInbounds(updated.data);
    };


    return (
        <div className="inbound-page-container">
            {/* 왼쪽: 자재 현황 */}
            <div className="inbound-list">
                <h2>📦 자재 입고 현황</h2>
                <div className="material-search">
                    <select value={categoryId} onChange={handleCategoryChange} required>
                        <option value="">전체 카테고리</option>
                        {categories.map(c => (
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
                        <th>담당자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInbounds.map(i => (
                        <tr key={i.id}>
                            <td>{i.material.category.name}</td>
                            <td>{i.material.manufacturer}</td>
                            <td>{i.material.name}</td>
                            <td>{i.quantity}</td>
                            <td>{i.unit}</td>
                            <td>{i.inboundDate}</td>
                            <td>{i.receivedBy}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 오른쪽: 자재 입고 폼 */}
            <div className="inbound-form">
                <h2>➕ 자재 입고 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        자재 카테고리
                        <select value={categoryId} onChange={handleCategoryChange} required>
                            <option value="">선택</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                    자재 선택
                        <select name="materialId" value={form.materialId} onChange={handleChange} required>
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
                    <button type="submit">입고 등록</button>
                </form>
            </div>
        </div>
    );
}
