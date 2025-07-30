import React, { createContext, useContext, useState } from "react";

const MatchingContext = createContext();

export const useMatching = () => {
  const context = useContext(MatchingContext);
  if (!context) {
    throw new Error("useMatching must be used within a MatchingProvider");
  }
  return context;
};

export const MatchingProvider = ({ children }) => {
  const [matchings, setMatchings] = useState([
    {
      id: "matching_001",
      parentId: "user_001", // 김가정 부모님
      teacherId: "teacher_001", // 양연희쌤
      applicationId: "app_001", // 김가정 부모님의 피아노, 미술지도 공고
      status: "accepted", // pending, accepted, rejected, completed
      createdAt: "2025-01-27",
      updatedAt: "2025-01-28",
      messages: [
        {
          id: "msg_001",
          senderId: "teacher_001",
          senderName: "양연희",
          content:
            "안녕하세요! 관악구에서 활동하고 있는 양연희입니다. 피아노와 미술 지도 경험이 있어서 도움이 될 것 같습니다. 어떤 활동을 주로 원하시나요?",
          timestamp: "2025-01-27T10:30:00Z",
        },
        {
          id: "msg_002",
          senderId: "user_001",
          senderName: "김가정",
          content:
            "안녕하세요! 우리 아이는 피아노에 관심이 많아요. 미술도 좋아하고요. 체계적으로 지도해주실 수 있으시겠어요?",
          timestamp: "2025-01-27T11:15:00Z",
        },
        {
          id: "msg_003",
          senderId: "teacher_001",
          senderName: "양연희",
          content:
            "네, 피아노와 미술 모두 체계적으로 지도해드릴 수 있습니다. 아이의 수준에 맞춰 단계별로 진행하겠습니다. 언제부터 시작하시겠어요?",
          timestamp: "2025-01-27T14:20:00Z",
        },
        {
          id: "msg_004",
          senderId: "user_001",
          senderName: "김가정",
          content:
            "8월 1일부터 시작하고 싶어요. 월,수,금 오후 2시부터 7시까지 가능하신가요?",
          timestamp: "2025-01-27T16:45:00Z",
        },
        {
          id: "msg_005",
          senderId: "teacher_001",
          senderName: "양연희",
          content:
            "네, 그 시간대 완전 가능합니다! 8월 1일부터 월,수,금 오후 2시~7시로 진행하겠습니다. 첫 날은 아이와 인사하고 수준을 파악하는 시간으로 하겠습니다.",
          timestamp: "2025-01-28T09:30:00Z",
        },
      ],
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: "notif_001",
      userId: "user_001", // 김가정 부모님
      type: "matching_request",
      title: "새로운 매칭 요청",
      message: "양연희 쌤이 매칭을 요청했습니다.",
      relatedId: "matching_001",
      isRead: false,
      createdAt: "2025-01-27T10:30:00Z",
    },
    {
      id: "notif_002",
      userId: "teacher_001", // 양연희쌤
      type: "matching_request",
      title: "새로운 공고 발견",
      message: "관악구에서 새로운 공고가 등록되었습니다.",
      relatedId: "app_001",
      isRead: false,
      createdAt: "2025-01-27T09:00:00Z",
    },
    {
      id: "notif_003",
      userId: "teacher_001", // 양연희쌤
      type: "matching_response",
      title: "매칭 응답",
      message: "김가정님이 매칭 요청에 응답했습니다.",
      relatedId: "matching_001",
      isRead: false,
      createdAt: "2025-01-27T11:15:00Z",
    },
    {
      id: "notif_004",
      userId: "user_001", // 김가정 부모님
      type: "matching_accepted",
      title: "매칭 수락됨",
      message: "양연희 쌤이 매칭을 수락했습니다.",
      relatedId: "matching_001",
      isRead: false,
      createdAt: "2025-01-28T09:30:00Z",
    },
    {
      id: "notif_005",
      userId: "teacher_001", // 양연희쌤
      type: "matching_accepted",
      title: "매칭 수락됨",
      message: "김가정님의 매칭이 수락되었습니다.",
      relatedId: "matching_001",
      isRead: false,
      createdAt: "2025-01-28T09:30:00Z",
    },
  ]);

  // 매칭 생성
  const createMatching = (
    parentId,
    teacherId,
    applicationId,
    parentMessage
  ) => {
    const newMatching = {
      id: `match_${Date.now()}`,
      parentId,
      teacherId,
      parentName: "부모님", // 실제로는 사용자 정보에서 가져와야 함
      teacherName: "쌤", // 실제로는 사용자 정보에서 가져와야 함
      status: "pending",
      createdAt: new Date().toISOString(),
      parentMessage,
      teacherMessage: "",
      applicationId,
      applicationTitle: "공고 제목", // 실제로는 공고 정보에서 가져와야 함
      region: "관악구",
      hourlyWage: "협의",
      workingHours: "협의",
      startDate: new Date().toISOString().split("T")[0],
    };

    setMatchings((prev) => [...prev, newMatching]);

    // 알림 생성
    const parentNotification = {
      id: `notif_${Date.now()}_parent`,
      userId: parentId,
      type: "matching_request",
      title: "매칭 요청 전송됨",
      message: "매칭 요청을 전송했습니다.",
      matchingId: newMatching.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const teacherNotification = {
      id: `notif_${Date.now()}_teacher`,
      userId: teacherId,
      type: "matching_request",
      title: "새로운 매칭 요청",
      message: "새로운 매칭 요청이 도착했습니다.",
      matchingId: newMatching.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [
      ...prev,
      parentNotification,
      teacherNotification,
    ]);

    return newMatching;
  };

  // 매칭 상태 업데이트
  const updateMatchingStatus = (matchingId, status, teacherMessage = "") => {
    setMatchings((prev) =>
      prev.map((matching) =>
        matching.id === matchingId
          ? { ...matching, status, teacherMessage }
          : matching
      )
    );

    // 상태 변경에 따른 알림 생성
    const matching = matchings.find((m) => m.id === matchingId);
    if (matching) {
      let notificationTitle, notificationMessage;

      if (status === "accepted") {
        notificationTitle = "매칭 수락됨";
        notificationMessage = "매칭이 수락되었습니다.";
      } else if (status === "rejected") {
        notificationTitle = "매칭 거절됨";
        notificationMessage = "매칭이 거절되었습니다.";
      } else if (status === "completed") {
        notificationTitle = "매칭 완료";
        notificationMessage = "매칭이 완료되었습니다.";
      }

      if (notificationTitle) {
        const parentNotification = {
          id: `notif_${Date.now()}_parent_${status}`,
          userId: matching.parentId,
          type: `matching_${status}`,
          title: notificationTitle,
          message: notificationMessage,
          matchingId,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        const teacherNotification = {
          id: `notif_${Date.now()}_teacher_${status}`,
          userId: matching.teacherId,
          type: `matching_${status}`,
          title: notificationTitle,
          message: notificationMessage,
          matchingId,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        setNotifications((prev) => [
          ...prev,
          parentNotification,
          teacherNotification,
        ]);
      }
    }
  };

  // 사용자의 매칭 목록 조회
  const getUserMatchings = (userId) => {
    return matchings.filter(
      (matching) =>
        matching.parentId === userId || matching.teacherId === userId
    );
  };

  // 사용자의 알림 조회
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

  // 특정 매칭 조회
  const getMatchingById = (matchingId) => {
    return matchings.find((matching) => matching.id === matchingId);
  };

  const value = {
    matchings,
    notifications,
    createMatching,
    updateMatchingStatus,
    getUserMatchings,
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getMatchingById,
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};
