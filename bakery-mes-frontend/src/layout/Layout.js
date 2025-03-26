import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ProductList from '../pages/ProductList';
import EntityManager from '../pages/EntityManager';


const Layout = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoginPage = location.pathname === '/';

    return (
        <div style={{ padding: '20px' }}>
            {!isLoginPage && user && (
                <nav>
                    <Link to="/main">홈</Link> |{" "}
                    <Link to="/products">제품</Link> |{" "}
                    <Link to="/categories/product">제품 카테고리</Link> |{" "}
                    <Link to="/categories/process">공정 카테고리</Link> |{" "}
                    <Link to="/categories/status">상태 카테고리</Link>
                </nav>
            )}

            <Routes>
                <Route path="/main" element={<MainPage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/categories/product" element={<EntityManager type="PRODUCT" />} />
                <Route path="/categories/process" element={<EntityManager type="PROCESS" />} />
                <Route path="/categories/status" element={<EntityManager type="STATUS" />} />
            </Routes>
        </div>
    );
};

export default Layout;
