import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/users/login', {
                userId,
                password
            });
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/main');
        } catch (err) {
            alert('로그인 실패');
        }
    };

    return (
        <div className="login-container">
            <h2>🔐 Bakery MES 로그인</h2>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    className="login-input"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="login-button" type="submit">로그인</button>
            </form>
        </div>
    );
};

export default LoginPage;
