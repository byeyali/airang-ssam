import React from 'react';
import './Navigation.css';

function Navigation() {
    return (
        <nav className="main-navigation">
            <a href="/help" className="nav-item">
                <img src="/img/icon_help.png" alt="도와줘요 쌤" className="nav-icon" />
                <span className="nav-text">도와줘요 쌤</span>
            </a>
            <a href="/become-teacher" className="nav-item">
                <img src="/img/icon_teacher.png" alt="쌤이 되어 볼래요?" className="nav-icon" />
                <span className="nav-text">쌤이 되어 볼래요?</span>
            </a>
            <a href="/find-teacher" className="nav-item">
                <img src="/img/icon_find.png" alt="우리 아이 쌤 찾기" className="nav-icon" />
                <span className="nav-text">우리 아이 쌤 찾기</span>
            </a>
            <a href="/reviews" className="nav-item">
                <img src="/img/icon_review.png" alt="후기 남기기" className="nav-icon" />
                <span className="nav-text">후기 남기기</span>
            </a>
        </nav>
    );
}

export default Navigation;