import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // react-modal 패키지 import
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import '../styles/WorkerList.css';

Modal.setAppElement('#root');  // 접근성을 위한 설정

const WorkerListPage = () => {
    const [workers, setWorkers] = useState([]);
    const [form, setForm] = useState({ name: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태 관리
    const navigate = useNavigate();  // useNavigate 훅을 호출하여 navigate 함수 사용

    useEffect(() => {
        fetchWorkers();
    }, []);

    // 작업자 목록 조회
    const fetchWorkers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/users?role=WORKER');
            setWorkers(res.data);
        } catch (err) {
            console.error('작업자 목록 로딩 실패:', err);
        }
    };

    // 작업자 등록
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/users', {
            ...form,
            role: 'WORKER',
        })
            .then(() => {
                alert('작업자가 등록되었습니다!');
                setForm({ name: '' });
                fetchWorkers();
                setIsModalOpen(false); // 작업자 등록 후 모달 닫기
            })
            .catch(err => alert('작업자 등록 실패'));
    };

    // 홈으로 가는 버튼 클릭 처리
    const goToHome = () => {
        navigate('/main');  // 홈 페이지로 이동
    };

    // 모달 열기
    const openModal = () => setIsModalOpen(true);

    // 모달 닫기
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="worker-list-container">
            <div className="go-home-button">
                <button onClick={goToHome}>홈으로 가기</button>
            </div>

            <div className="worker-list">
                <h2>🛠 작업자 목록
                    {/* 타이틀 옆에 버튼 추가 */}
                    {/*<button onClick={openModal} style={{*/}
                    {/*    marginLeft: '20px',*/}
                    {/*    padding: '10px',*/}
                    {/*    backgroundColor: '#4caf50',*/}
                    {/*    color: 'white',*/}
                    {/*    borderRadius: '5px'*/}
                    {/*}}>작업자 등록*/}
                    {/*</button>*/}
                    <button onClick={openModal} className="worker-register-button">작업자 등록</button>
                </h2>
                <table border="1" cellPadding="10">
                    <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>권한</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workers.map(worker => (
                        <tr key={worker.id}>
                            <td>{worker.userId}</td>
                            <td>{worker.name}</td>
                            <td>{worker.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 모달창 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="작업자 등록"
                className="modal-overlay"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>작업자 등록</h3>
                        {/* 상단 닫기 버튼 */}
                        <button onClick={closeModal} className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <input
                                name="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="이름"
                                required
                            />
                            <br />
                            <button type="submit" className="modal-footer-button">등록</button>
                        </form>
                    </div>
                    {/* 추가 닫기 버튼 제거 */}
                </div>
            </Modal>


        </div>
    );
};

export default WorkerListPage;
