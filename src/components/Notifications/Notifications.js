import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
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
  } = useMatching();
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
    navigate("/applications");
    setIsOpen(false);
  };

  const handleTeacherProfile = () => {
    navigate("/teacher-profile");
    setIsOpen(false);
  };

  const handleMatchings = () => {
    navigate("/matchings");
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
          <span>🔔</span>
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
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleString("ko-KR")}
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
            {user.type === "parent" && (
              <button
                onClick={handleMyApplications}
                className="notification-link"
              >
                내 공고 관리
              </button>
            )}
            {user.type === "teacher" && (
              <button
                onClick={handleTeacherProfile}
                className="notification-link"
              >
                프로필 관리
              </button>
            )}
            <button onClick={handleMatchings} className="notification-link">
              매칭 관리
            </button>
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
