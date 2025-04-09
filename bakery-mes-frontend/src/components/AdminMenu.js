import React from 'react';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
    return (
        <>
            <Link to="/orders">
                <button>수주 관리</button>
            </Link>
            <Link to="/production-plans">
                <button>생산 관리</button>
            </Link>
            <Link to="/categories">
                <button>카테고리 관리</button>
            </Link>
            {/*<Link to="/categories/MATERIAL">*/}
            {/*    <button>자재 분류 등록</button>*/}
            {/*</Link>*/}
            {/*<Link to="/categories/PROCESS">*/}
            {/*    <button>공정 등록</button>*/}
            {/*</Link>*/}
            {/*<Link to="/categories/STATUS">*/}
            {/*    <button>상태 등록</button>*/}
            {/*</Link>*/}
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
                <button>BOM 등록</button>
            </Link>
            <Link to="/boms">
                <button>BOM 조회</button>
            </Link>
        </>
    );
};

export default AdminMenu;
