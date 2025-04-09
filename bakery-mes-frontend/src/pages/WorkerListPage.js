import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/CommonStyle.css";

const WorkerListPage = () => {
    const [workers, setWorkers] = useState([]);
    const [form, setForm] = useState({ name: '' });

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
            })
            .catch(err => alert('작업자 등록 실패'));
    };



    return (
        <div className="page-container">
            <div className="list-section">
                <h2>🛠 작업자 목록</h2>
                <table>
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

            <div className="form-section">
                <h2>🛠 작업자 등록</h2>
            </div>


        </div>
    );
};

export default WorkerListPage;
