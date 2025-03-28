import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

import '../styles/MainPage.css';
import CommonMenu from '../components/CommonMenu'; // 공통 메뉴 컴포넌트 import
import AdminMenu from '../components/AdminMenu';   // 관리자 메뉴 컴포넌트 import
import WorkerMenu from '../components/WorkerMenu'; // 작업자 메뉴 컴포넌트 import


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

            <div className="menu-list">

                {/* 관리자 메뉴 */}
                {user.role === 'ADMIN' && <AdminMenu />}

                {/* 공통 메뉴 */}
                <CommonMenu />

                {/* 작업자 메뉴 */}
                {user.role === 'WORKER' && <WorkerMenu />}

            </div>

            {/*{user.role === 'ADMIN' && (*/}
            {/*    <div className="menu-block">*/}
            {/*        <h3 className="menu-title">📂 관리자 메뉴</h3>*/}

            {/*    </div>*/}
            {/*)}*/}

            {/*{user.role === 'WORKER' && (*/}
            {/*    <div className="menu-block">*/}
            {/*        <h3 className="menu-title">🛠 작업자 메뉴</h3>*/}
            {/*        <div className="menu-list">*/}
            {/*            <Link to="/material/register">*/}
            {/*                <button>자재 등록</button>*/}
            {/*            </Link>*/}
            {/*            <Link to="/inbounds">*/}
            {/*                <button>자재 입고</button>*/}
            {/*            </Link>*/}
            {/*            <Link to="/stocks">*/}
            {/*                <button>자재 조회</button>*/}
            {/*            </Link>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default MainPage;
