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
  const [matchingRequests, setMatchingRequests] = useState([]);

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
