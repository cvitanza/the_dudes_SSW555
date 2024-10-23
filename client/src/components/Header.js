import React from 'react';
import './styles/Header.css';

function Header({ title }) {
    return (
        <header className="page-header">
            <h1 className="header-title">{title}</h1>
        </header>
    );
}

export default Header;