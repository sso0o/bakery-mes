import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

import '../styles/MainPage.css';

// MainPage: 로그인 후 사용자 역할에 따라 다른 메뉴 제공
const MainPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        navigate('/');
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="main-container">
            <h2 className="main-title">{user.name}님 환영합니다!</h2>
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>

            {user.role === 'ADMIN' && (
                <div className="menu-block">
                    <h3 className="menu-title">📂 관리자 메뉴</h3>
                    <div className="menu-list">
                        <Link to="/categories/PRODUCT">
                            <button>제품 분류 등록</button>
                        </Link>
                        <Link to="/categories/PROCESS">
                            <button>공정 등록</button>
                        </Link>
                        <Link to="/categories/STATUS">
                            <button>상태 등록</button>
                        </Link>
                        <Link to="/work-orders">
                            <button>작업 지시</button>
                        </Link>
                        <Link to="/workers">
                            <button>작업자 등록</button>
                        </Link>
                        <Link to="/products">
                            <button>제품 등록</button>
                        </Link>
                        <Link to="/products-process">
                            <button>제품별 공정 등록</button>
                        </Link>
                    </div>
                </div>
            )}

            {user.role === 'WORKER' && (
                <div className="menu-block">
                    <h3 className="menu-title">🛠 작업자 메뉴</h3>
                    <div className="menu-list">
                        <Link to="/material/register">
                            <button>자재 등록</button>
                        </Link>
                        <Link to="/inbounds">
                            <button>자재 입고</button>
                        </Link>
                        <Link to="/stocks">
                            <button>자재 조회</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
