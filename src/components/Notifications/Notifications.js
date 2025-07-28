import React, { useState } from 'react';
import './Notifications.css';

function Notifications() {
    const [isOpen, setIsOpen] = useState(false); // 알림창 열림/닫힘 상태

    const toggleNotifications = () => {
        setIsOpen(!isOpen); // 상태 반전
    };

    return (
        <div className="notification-container">
            <div className="notification-trigger" onClick={toggleNotifications}>
                <span className="user-name">홍길동님</span> {/* 로그인한 회원 이름 */}
                <span className="notification-icon" role="img" aria-label="알림">🔔</span> {/* 알림 이모티콘 */}
            </div>
            {isOpen && ( // isOpen 상태가 true일 때만 아래 div를 렌더링
                <div className="notification-dropdown">
                    <a href="/mypage" className="notification-link">내 공고 관리</a>
                    <a href="/profile" className="notification-link">마이 페이지</a>
                    <a href="/logout" className="notification-link logout">로그아웃</a>
                </div>
            )}
        </div>
    );
}

export default Notifications;


