import React from 'react';
import { Link } from 'react-router-dom';

const CommonMenu = () => {
    return (
        <>
            <Link to="/material/register">
                <button>자재 등록</button>
            </Link>
            <Link to="/inbound">
                <button>자재 입고</button>
            </Link>
            <Link to="/stocks">
                <button>자재 조회</button>
            </Link>
        </>
    );
};

export default CommonMenu;
