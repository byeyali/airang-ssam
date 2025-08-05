import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // 알림 생성
  const createNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification;
  };

  // 매칭 요청 알림 생성
  const createMatchingRequestNotification = (teacherId, parentName) => {
    return createNotification({
      userId: teacherId,
      type: "matching_request",
      title: "새로운 매칭 요청",
      message: `${parentName}님이 매칭을 요청했습니다.`,
      isRead: false,
    });
  };

  // 매칭 응답 알림 생성
  const createMatchingResponseNotification = (
    parentId,
    teacherName,
    status
  ) => {
    const statusText = status === "accepted" ? "수락" : "거절";
    return createNotification({
      userId: parentId,
      type: "matching_response",
      title: "매칭 응답",
      message: `${teacherName}님이 매칭을 ${statusText}했습니다.`,
      isRead: false,
    });
  };

  // 계약 진행 알림 생성
  const createContractProgressNotification = (teacherId, parentName) => {
    return createNotification({
      userId: teacherId,
      type: "contract_progress",
      title: "계약 진행 요청",
      message: `${parentName}님이 계약을 진행하고자 합니다. 계약을 수락해주세요.`,
      isRead: false,
    });
  };

  // 계약 완료 알림 생성
  const createContractCompletedNotification = (parentId, teacherName) => {
    return createNotification({
      userId: parentId,
      type: "contract_completed",
      title: "계약 완료",
      message: `${teacherName}님이 계약을 수락했습니다! 계약이 완료되었습니다.`,
      isRead: false,
    });
  };

  // 사용자의 알림 가져오기
  const getUserNotifications = (userId) => {
    return notifications
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // 읽지 않은 알림 개수
  const getUnreadNotificationCount = (userId) => {
    return notifications.filter(
      (notification) => notification.userId === userId && !notification.isRead
    ).length;
  };

  // 알림 읽음 처리
  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 모든 알림 읽음 처리
  const markAllNotificationsAsRead = (userId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.userId === userId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 알림 삭제
  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const value = {
    notifications,
    createNotification,
    createMatchingRequestNotification,
    createMatchingResponseNotification,
    createContractProgressNotification,
    createContractCompletedNotification,
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
