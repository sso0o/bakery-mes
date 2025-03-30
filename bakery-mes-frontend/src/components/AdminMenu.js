import React from 'react';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
    return (
        <>
            <Link to="/categories/PRODUCT">
                <button>제품 분류 등록</button>
            </Link>
            <Link to="/categories/MATERIAL">
                <button>자재 분류 등록</button>
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
        </>
    );
};

export default AdminMenu;
