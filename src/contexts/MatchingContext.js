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
    // 테스트용 샘플 매칭 데이터
    {
      id: "matching_001",
      parentId: "user_001", // 김가정
      teacherId: "teacher_001", // 김영희
      parentName: "김가정",
      teacherName: "김영희 쌤",
      message:
        "안녕하세요! 우리 아이 방과후 돌봄이 필요합니다. 체계적으로 잘 가르쳐주시는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-15T10:30:00.000Z",
    },
    {
      id: "matching_002",
      parentId: "user_001", // 김가정
      teacherId: "teacher_002", // 박민수
      parentName: "김가정",
      teacherName: "박민수 쌤",
      message: "영어 학습도 함께 하고 싶어요. 체계적으로 가르쳐주실 수 있나요?",
      status: "accepted",
      contractStatus: "progress", // 계약 진행중
      createdAt: "2025-08-14T14:20:00.000Z",
      respondedAt: "2025-08-14T15:30:00.000Z",
    },
    {
      id: "matching_003",
      parentId: "user_002", // 박영희
      teacherId: "teacher_002", // 박민수
      applicationId: "app_003", // 박영희 부모님의 공고
      parentName: "박영희",
      teacherName: "박민수 쌤",
      message: "따뜻한 마음으로 아이를 돌봐주실 분을 찾고 있습니다.",
      status: "accepted",
      contractStatus: "completed", // 계약 완료
      createdAt: "2025-08-13T09:15:00.000Z",
      respondedAt: "2025-08-13T10:30:00.000Z",
    },
    // 추가 매칭 요청들
    {
      id: "matching_004",
      parentId: "user_003", // 이민수
      teacherId: "teacher_001", // 김영희
      parentName: "이민수",
      teacherName: "김영희 쌤",
      message: "수학과 영어를 함께 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-12T16:45:00.000Z",
    },
    {
      id: "matching_005",
      parentId: "user_004", // 최지영
      teacherId: "teacher_002", // 박민수
      parentName: "최지영",
      teacherName: "박민수 쌤",
      message: "체육 활동도 함께 해주실 수 있는 분을 찾고 있습니다.",
      status: "accepted",
      contractStatus: "progress", // 계약 진행중
      createdAt: "2025-08-11T11:20:00.000Z",
      respondedAt: "2025-08-11T14:30:00.000Z",
    },
    {
      id: "matching_006",
      parentId: "user_005", // 한미영
      teacherId: "teacher_004", // 최지영
      parentName: "한미영",
      teacherName: "최지영 쌤",
      message: "미술과 음악을 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-10T09:30:00.000Z",
    },
    {
      id: "matching_007",
      parentId: "user_006", // 정성훈
      teacherId: "teacher_005", // 한미영
      parentName: "정성훈",
      teacherName: "한미영 쌤",
      message: "과학 실험도 함께 해주실 수 있는 분을 찾고 있습니다.",
      status: "rejected",
      createdAt: "2025-08-09T13:15:00.000Z",
      respondedAt: "2025-08-09T15:45:00.000Z",
    },
    {
      id: "matching_008",
      parentId: "user_007", // 김태현
      teacherId: "teacher_006", // 정성훈
      parentName: "김태현",
      teacherName: "정성훈 쌤",
      message: "컴퓨터 프로그래밍도 가르쳐주실 수 있는 분을 찾고 있어요.",
      status: "pending",
      createdAt: "2025-08-08T10:00:00.000Z",
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
