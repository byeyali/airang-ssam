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
    // 2025년 8월 기준 최근 매칭 현황
    {
      id: "matching_001",
      parentId: "user_001",
      teacherId: "teacher_001",
      parentName: "김가정",
      teacherName: "김영희",
      message:
        "피아노와 미술을 체계적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      createdAt: "2025-08-15T10:30:00.000Z",
      respondedAt: "2025-08-15T14:00:00.000Z",
      applicationId: "app_001",
      childGender: "male", // 남자아이
    },
    {
      id: "matching_002",
      parentId: "user_002",
      teacherId: "teacher_002",
      parentName: "박영희",
      teacherName: "박민수",
      message: "영어와 체육을 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      createdAt: "2025-08-12T09:15:00.000Z",
      respondedAt: "2025-08-12T11:30:00.000Z",
      applicationId: "app_002",
      childGender: "female", // 여자아이
    },
    {
      id: "matching_003",
      parentId: "user_003",
      teacherId: "teacher_003",
      parentName: "이민수",
      teacherName: "김지영",
      message: "음악과 미술을 창의적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-20T14:20:00.000Z",
      applicationId: "app_003",
      childGender: "male", // 남자아이
    },
    {
      id: "matching_004",
      parentId: "user_004",
      teacherId: "teacher_007",
      parentName: "최지영",
      teacherName: "김태현",
      message: "체육 활동을 건강하게 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      createdAt: "2025-08-10T11:30:00.000Z",
      respondedAt: "2025-08-10T13:15:00.000Z",
      applicationId: "app_004",
      childGender: "female", // 여자아이
    },
    {
      id: "matching_005",
      parentId: "user_005",
      teacherId: "teacher_008",
      parentName: "한미영",
      teacherName: "박성훈",
      message:
        "기초 학습과 생활습관을 체계적으로 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "rejected",
      createdAt: "2025-08-18T10:00:00.000Z",
      respondedAt: "2025-08-18T12:30:00.000Z",
      applicationId: "app_005",
      childGender: "male", // 남자아이
    },
    {
      id: "matching_006",
      parentId: "user_006",
      teacherId: "teacher_009",
      parentName: "정성훈",
      teacherName: "이미영",
      message: "수학을 쉽고 재미있게 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-22T15:45:00.000Z",
      applicationId: "app_006",
      childGender: "female", // 여자아이
    },
    {
      id: "matching_007",
      parentId: "user_007",
      teacherId: "teacher_001",
      parentName: "김태현",
      teacherName: "김영희",
      message: "영어와 수학을 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      createdAt: "2025-08-08T13:10:00.000Z",
      respondedAt: "2025-08-08T15:30:00.000Z",
      applicationId: "app_007",
      childGender: "male", // 남자아이
    },
    {
      id: "matching_008",
      parentId: "user_008",
      teacherId: "teacher_002",
      parentName: "박성훈",
      teacherName: "박민수",
      message: "과학과 영어를 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      createdAt: "2025-08-05T16:20:00.000Z",
      respondedAt: "2025-08-05T18:45:00.000Z",
      applicationId: "app_008",
      childGender: "female", // 여자아이
    },
    {
      id: "matching_009",
      parentId: "user_009",
      teacherId: "teacher_004",
      parentName: "이지영",
      teacherName: "최지영",
      message:
        "창의적인 놀이와 학습을 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-25T09:30:00.000Z",
      applicationId: "app_009",
      childGender: "male", // 남자아이
    },
    {
      id: "matching_010",
      parentId: "user_010",
      teacherId: "teacher_005",
      parentName: "김지훈",
      teacherName: "한미영",
      message: "영어와 돌봄을 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "accepted",
      createdAt: "2025-08-03T12:15:00.000Z",
      respondedAt: "2025-08-03T14:30:00.000Z",
      applicationId: "app_010",
      childGender: "female", // 여자아이
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
