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
  const [matchingRequests, setMatchingRequests] = useState([
    // 수락된 매칭 (9개)
    {
      id: "matching_001",
      parentId: "user_001", // 김가정
      teacherId: "teacher_001", // 양연희
      parentName: "김가정",
      teacherName: "양연희",
      message:
        "피아노와 미술을 체계적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-09-15T10:30:00.000Z",
      respondedAt: "2024-09-15T14:00:00.000Z",
    },
    {
      id: "matching_002",
      parentId: "user_002", // 박영희
      teacherId: "teacher_002", // 김민수
      parentName: "박영희",
      teacherName: "김민수",
      message: "영어와 체육을 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-10-20T09:15:00.000Z",
      respondedAt: "2024-10-20T11:30:00.000Z",
    },
    {
      id: "matching_003",
      parentId: "user_003", // 이민수
      teacherId: "teacher_003", // 박지영
      parentName: "이민수",
      teacherName: "박지영",
      message: "음악과 미술을 창의적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-11-10T14:20:00.000Z",
      respondedAt: "2024-11-10T16:45:00.000Z",
    },
    {
      id: "matching_004",
      parentId: "user_004", // 최지영
      teacherId: "teacher_004", // 이준호
      parentName: "최지영",
      teacherName: "이준호",
      message: "체육 활동을 건강하게 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-12-05T11:30:00.000Z",
      respondedAt: "2024-12-05T13:15:00.000Z",
    },
    {
      id: "matching_005",
      parentId: "user_005", // 한미영
      teacherId: "teacher_005", // 최영희
      parentName: "한미영",
      teacherName: "최영희",
      message:
        "기초 학습과 생활습관을 체계적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-12-20T10:00:00.000Z",
      respondedAt: "2024-12-20T12:30:00.000Z",
    },
    {
      id: "matching_006",
      parentId: "user_006", // 정성훈
      teacherId: "teacher_006", // 정수진
      parentName: "정성훈",
      teacherName: "정수진",
      message: "수학을 쉽고 재미있게 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-12-25T15:45:00.000Z",
      respondedAt: "2024-12-25T17:20:00.000Z",
    },
    {
      id: "matching_007",
      parentId: "user_007", // 김태현
      teacherId: "teacher_001", // 양연희
      parentName: "김태현",
      teacherName: "양연희",
      message: "영어와 수학을 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-12-28T13:10:00.000Z",
      respondedAt: "2024-12-28T15:30:00.000Z",
    },
    {
      id: "matching_008",
      parentId: "user_008", // 박성훈
      teacherId: "teacher_002", // 김민수
      parentName: "박성훈",
      teacherName: "김민수",
      message: "과학과 영어를 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-12-30T09:20:00.000Z",
      respondedAt: "2024-12-30T11:45:00.000Z",
    },
    {
      id: "matching_009",
      parentId: "user_009", // 이지영
      teacherId: "teacher_003", // 박지영
      parentName: "이지영",
      teacherName: "박지영",
      message: "요리와 창작활동을 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2024-12-31T16:00:00.000Z",
      respondedAt: "2024-12-31T18:15:00.000Z",
    },

    // 2025년 매칭 데이터 (3개)
    {
      id: "matching_010",
      parentId: "user_010", // 김미영
      teacherId: "teacher_004", // 이준호
      parentName: "김미영",
      teacherName: "이준호",
      message: "축구와 농구를 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2025-01-05T10:30:00.000Z",
      respondedAt: "2025-01-05T12:45:00.000Z",
    },
    {
      id: "matching_011",
      parentId: "user_011", // 최민수
      teacherId: "teacher_005", // 최영희
      parentName: "최민수",
      teacherName: "최영희",
      message: "독서와 한글을 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2025-01-10T14:15:00.000Z",
      respondedAt: "2025-01-10T16:30:00.000Z",
    },
    {
      id: "matching_012",
      parentId: "user_012", // 한지영
      teacherId: "teacher_006", // 정수진
      parentName: "한지영",
      teacherName: "정수진",
      message: "수학과 과학을 체계적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      contractStatus: "completed",
      createdAt: "2025-01-15T11:00:00.000Z",
      respondedAt: "2025-01-15T13:20:00.000Z",
    },

    // 거절된 매칭 (1개)
    {
      id: "matching_013",
      parentId: "user_013", // 박미영
      teacherId: "teacher_001", // 양연희
      parentName: "박미영",
      teacherName: "양연희",
      message: "피아노와 영어를 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "rejected",
      contractStatus: null,
      createdAt: "2025-01-20T09:00:00.000Z",
      respondedAt: "2025-01-20T11:30:00.000Z",
    },

    // 대기중 매칭 (2개)
    {
      id: "matching_014",
      parentId: "user_014", // 김지훈
      teacherId: "teacher_002", // 김민수
      parentName: "김지훈",
      teacherName: "김민수",
      message: "수학과 영어를 체계적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      contractStatus: null,
      createdAt: "2025-01-25T14:00:00.000Z",
      respondedAt: null,
    },
    {
      id: "matching_015",
      parentId: "user_015", // 이수진
      teacherId: "teacher_003", // 박지영
      parentName: "이수진",
      teacherName: "박지영",
      message: "미술과 음악을 창의적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      contractStatus: null,
      createdAt: "2025-01-28T10:30:00.000Z",
      respondedAt: null,
    },
  ]);

  // 매칭 요청 생성
  const createMatchingRequest = (request) => {
    const newRequest = {
      id: Date.now().toString(),
      ...request,
      status: "pending", // pending, accepted, rejected
      createdAt: new Date().toISOString(),
    };
    setMatchingRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  // 매칭 요청 수락
  const acceptMatchingRequest = (requestId) => {
    setMatchingRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "accepted",
              respondedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  // 매칭 요청 거절
  const rejectMatchingRequest = (requestId) => {
    setMatchingRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "rejected",
              respondedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  // 계약 진행 상태로 변경
  const startContract = (requestId) => {
    setMatchingRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              contractStatus: "progress",
            }
          : request
      )
    );
  };

  // 계약 완료 상태로 변경
  const completeContract = (requestId) => {
    setMatchingRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              contractStatus: "completed",
            }
          : request
      )
    );
  };

  // 특정 쌤의 매칭 요청 가져오기
  const getMatchingRequestsForTeacher = (teacherId) => {
    return matchingRequests.filter(
      (request) => request.teacherId === teacherId
    );
  };

  // 특정 부모의 매칭 요청 가져오기
  const getMatchingRequestsForParent = (parentId) => {
    return matchingRequests.filter((request) => request.parentId === parentId);
  };

  // 대기 중인 매칭 요청 개수
  const getPendingRequestsCount = (teacherId) => {
    return matchingRequests.filter(
      (request) =>
        request.teacherId === teacherId && request.status === "pending"
    ).length;
  };

  // 모든 매칭 요청 가져오기 (관리자용)
  const getAllMatchingRequests = () => {
    return matchingRequests;
  };

  const value = {
    matchingRequests,
    createMatchingRequest,
    acceptMatchingRequest,
    rejectMatchingRequest,
    startContract,
    completeContract,
    getMatchingRequestsForTeacher,
    getMatchingRequestsForParent,
    getPendingRequestsCount,
    getAllMatchingRequests,
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};
