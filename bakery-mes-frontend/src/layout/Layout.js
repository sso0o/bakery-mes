import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-container">
            <Navbar bg="dark" data-bs-theme="dark">
                <Container fluid>
                    <Nav className="ms-auto">
                        <Link to="/main">
                            <Button variant="danger">HOME</Button>
                        </Link>
                    </Nav>
                </Container>
            </Navbar>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
