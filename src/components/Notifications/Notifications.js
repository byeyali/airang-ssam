import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import "./Notifications.css";

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUser();

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // 로그인하지 않은 경우 알림창을 표시하지 않음
  if (!user) {
    return null;
  }

  return (
    <div className="notification-container" ref={dropdownRef}>
      <div className="notification-trigger" onClick={toggleNotifications}>
        <span className="user-name">{user.name}님</span>
        <div className="notification-icon-wrapper">
          <span className="notification-icon" role="img" aria-label="알림">
            🔔
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="notification-dropdown">
          <a href="/mypage" className="notification-link">
            내공고 관리
          </a>
          <a href="/profile" className="notification-link">
            마이페이지
          </a>
          <button onClick={handleLogout} className="notification-link logout">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default Notifications;
