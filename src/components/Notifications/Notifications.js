import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./Notifications.css";

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUser();
  const {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotification();
  const navigate = useNavigate();

  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadCount = user ? getUnreadNotificationCount(user.id) : 0;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleMyApplications = () => {
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
    navigate("/applications");
    setIsOpen(false);
  };

  const handleTeacherProfile = () => {
    console.log("프로필 관리 클릭됨", user);
    // 현재 로그인한 쌤의 상세 페이지로 이동
    if (user && (user.type === "teacher" || user.type === "tutor")) {
      console.log("쌤 상세 페이지로 이동:", `/teacher-detail/${user.id}`);
      navigate(`/teacher-detail/${user.id}`);
    } else {
      console.log("사용자 정보 없음 또는 쌤이 아님");
    }
    setIsOpen(false);
  };

  const handleMatchings = () => {
    navigate("/matchings");
    setIsOpen(false);
  };

  const handleContractManagement = () => {
    if (user.type === "admin") {
      navigate("/contract-management");
    } else if (user.type === "teacher") {
      navigate("/teacher/contract-management");
    }
    setIsOpen(false);
  };

  const handleParentContractManagement = () => {
    navigate("/parent/contract-management");
    setIsOpen(false);
  };

  const handleTeacherPaymentStatus = () => {
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
    navigate("/teacher/payment-status");
    setIsOpen(false);
  };

  const handleParentPaymentHistory = () => {
    navigate("/parent/payment-history");
    setIsOpen(false);
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);

    if (notification.matchingId) {
      navigate(`/matchings?matchingId=${notification.matchingId}`);
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(user.id);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <div className="notification-trigger" onClick={toggleNotifications}>
        <span className="user-name">{user.name}님</span>
        <div className="notification-icon">
          <span>알림</span>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span>알림</span>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-button"
                onClick={handleMarkAllAsRead}
              >
                모두 읽음
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>새로운 알림이 없습니다.</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                  </div>
                  <div className="notification-time-container">
                    <div className="notification-date">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "ko-KR"
                      )}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleTimeString(
                        "ko-KR"
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="notification-links">
            {user.type === "admin" && (
              <button
                onClick={handleContractManagement}
                className="notification-link"
              >
                계약 관리
              </button>
            )}
            <button onClick={handleLogout} className="notification-link logout">
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
