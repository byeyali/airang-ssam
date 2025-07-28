import React from 'react';
import { Link } from "react-router-dom"; 
import './Navigation.css';

function Navigation() {
    return (
        <nav className="main-navigation">
            <Link to="/helpme" className="nav-item">
                <img src="/img/icon_help.png" alt="도와줘요 쌤" className="nav-icon" />
                <span className="nav-text">도와줘요 쌤</span>
            </Link>
            <Link to="/become-teacher" className="nav-item">
                <img src="/img/icon_teacher.png" alt="쌤이 되어 볼래요?" className="nav-icon" />
                <span className="nav-text">쌤이 되어 볼래요?</span>
            </Link>
            <Link to="/find-teacher" className="nav-item">
                <img src="/img/icon_find.png" alt="우리 아이 쌤 찾기" className="nav-icon" />
                <span className="nav-text">우리 아이 쌤 찾기</span>
            </Link>
            <Link to="/reviews" className="nav-item">
                <img src="/img/icon_review.png" alt="후기 남기기" className="nav-icon" />
                <span className="nav-text">후기 남기기</span>
            </Link>
        </nav>
    );
}

export default Navigation;