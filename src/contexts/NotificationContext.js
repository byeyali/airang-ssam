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
  const [notifications, setNotifications] = useState([
    // 쌤 회원용 모의 알림 데이터
    {
      id: "teacher_notification_001",
      userId: "teacher_001",
      type: "teacher_lesson_day",
      title: "오늘 수업 안내",
      message:
        "김가정님의 김민수와 2024-01-25 오후 2시에 수학 수업이 있습니다.\n\n📍 상세 주소: 서울특별시 관악구 신림동 123-45, 3층\n📞 연락처: 010-1234-5678",
      isRead: false,
      createdAt: "2024-01-25T08:00:00Z",
      lessonDetails: {
        parentName: "김가정",
        childName: "김민수",
        lessonDate: "2024-01-25",
        lessonTime: "오후 2시",
        subject: "수학",
        parentAddress: "서울특별시 관악구 신림동 123-45, 3층",
        parentPhone: "010-1234-5678",
      },
    },
    {
      id: "teacher_notification_002",
      userId: "teacher_001",
      type: "matching_request",
      title: "새로운 매칭 요청",
      message: "박영희님이 매칭을 요청했습니다.",
      isRead: false,
      createdAt: "2024-01-24T14:30:00Z",
    },
    {
      id: "teacher_notification_003",
      userId: "teacher_001",
      type: "contract_request",
      title: "계약 요청",
      message: "이미영님이 계약을 요청했습니다.",
      isRead: false,
      createdAt: "2024-01-23T10:15:00Z",
    },
    // 부모 회원용 모의 알림 데이터
    {
      id: "parent_notification_001",
      userId: "parent_001",
      type: "parent_contract_request",
      title: "계약 요청 전송",
      message: '김수진님에게 "초등학생 수학 과외" 계약을 요청했습니다.',
      isRead: false,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "parent_notification_002",
      userId: "parent_001",
      type: "parent_contract_progress",
      title: "계약 진행 상태",
      message: "김수진님이 계약을 검토 중이고 있습니다.",
      isRead: false,
      createdAt: "2024-01-16T14:30:00Z",
    },
    {
      id: "parent_notification_003",
      userId: "parent_001",
      type: "parent_contract_completed",
      title: "계약 완료",
      message:
        "김수진님과의 계약이 완료되었습니다! 계약 기간: 3개월, 시급: 15000원",
      isRead: false,
      createdAt: "2024-01-20T10:00:00Z",
    },
    {
      id: "parent_notification_004",
      userId: "parent_002",
      type: "parent_payment",
      title: "결제 안내",
      message: "900,000원의 결제가 2024-01-25까지 예정되어 있습니다.",
      isRead: false,
      createdAt: "2024-01-22T14:30:00Z",
    },
    {
      id: "parent_notification_005",
      userId: "parent_003",
      type: "parent_lesson_start",
      title: "수업 시작 안내",
      message: "김지영님과의 첫 수업이 2024-01-25에 시작됩니다.",
      isRead: false,
      createdAt: "2024-01-24T09:15:00Z",
    },
  ]);

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

  // 부모용 계약 요청 알림 생성
  const createParentContractRequestNotification = (
    parentId,
    teacherName,
    applicationTitle
  ) => {
    return createNotification({
      userId: parentId,
      type: "parent_contract_request",
      title: "계약 요청 전송",
      message: `${teacherName}님에게 "${applicationTitle}" 계약을 요청했습니다.`,
      isRead: false,
    });
  };

  // 부모용 계약 진행 상태 알림 생성
  const createParentContractProgressNotification = (
    parentId,
    teacherName,
    status
  ) => {
    const statusText =
      status === "reviewing"
        ? "검토 중"
        : status === "negotiating"
        ? "협의 중"
        : "진행 중";
    return createNotification({
      userId: parentId,
      type: "parent_contract_progress",
      title: "계약 진행 상태",
      message: `${teacherName}님이 계약을 ${statusText}하고 있습니다.`,
      isRead: false,
    });
  };

  // 부모용 계약 완료 알림 생성
  const createParentContractCompletedNotification = (
    parentId,
    teacherName,
    contractDetails
  ) => {
    return createNotification({
      userId: parentId,
      type: "parent_contract_completed",
      title: "계약 완료",
      message: `${teacherName}님과의 계약이 완료되었습니다! 계약 기간: ${contractDetails.duration}, 시급: ${contractDetails.hourlyWage}원`,
      isRead: false,
    });
  };

  // 부모용 결제 알림 생성
  const createParentPaymentNotification = (parentId, amount, dueDate) => {
    return createNotification({
      userId: parentId,
      type: "parent_payment",
      title: "결제 안내",
      message: `${amount}원의 결제가 ${dueDate}까지 예정되어 있습니다.`,
      isRead: false,
    });
  };

  // 부모용 수업 시작 알림 생성
  const createParentLessonStartNotification = (
    parentId,
    teacherName,
    lessonDate
  ) => {
    return createNotification({
      userId: parentId,
      type: "parent_lesson_start",
      title: "수업 시작 안내",
      message: `${teacherName}님과의 첫 수업이 ${lessonDate}에 시작됩니다.`,
      isRead: false,
    });
  };

  // 쌤에게 수업 당일 알림 생성 (부모 주소 포함)
  const createTeacherLessonDayNotification = (
    teacherId,
    parentName,
    childName,
    lessonDate,
    lessonTime,
    subject,
    parentAddress,
    parentPhone
  ) => {
    return createNotification({
      userId: teacherId,
      type: "teacher_lesson_day",
      title: "오늘 수업 안내",
      message: `${subject} 수업이 있습니다.\n\n📍 상세 주소: ${parentAddress}\n📞 연락처: ${parentPhone}`,
      isRead: false,
      lessonDetails: {
        parentName,
        childName,
        lessonDate,
        lessonTime,
        subject,
        parentAddress,
        parentPhone,
      },
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
    createParentContractRequestNotification,
    createParentContractProgressNotification,
    createParentContractCompletedNotification,
    createParentPaymentNotification,
    createParentLessonStartNotification,
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
