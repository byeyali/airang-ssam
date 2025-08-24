import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosInstance";

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

  // 매칭 요청 생성 (로컬 상태)
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

  // 매칭 요청 생성 (백엔드 API 호출)
  const createJobApply = async (tutor_job_id, message) => {
    try {
      console.log("createJobApply 시작:", { tutor_job_id, message });

      if (!tutor_job_id) {
        throw new Error("공고 ID가 필요합니다.");
      }

      const requestData = {
        tutor_job_id: tutor_job_id,
        message: message || "",
      };

      const response = await axiosInstance.post("/applies", requestData);
      console.log("createJobApply 응답:", response.data);

      // 성공 시 로컬 상태에도 추가
      const newRequest = {
        id: response.data.id || Date.now().toString(),
        tutor_job_id: tutor_job_id,
        message: message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setMatchingRequests((prev) => [newRequest, ...prev]);

      return response.data;
    } catch (error) {
      console.error("createJobApply 오류:", error);
      throw new Error(
        error.response?.data?.message || "매칭 요청 생성에 실패했습니다."
      );
    }
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

  // 특정 공고의 신청내역 조회
  const getJobApplications = async (jobId) => {
    try {
      const response = await axiosInstance.get(
        `/applies/job/${jobId}/applications`
      );
      return response.data;
    } catch (error) {
      console.error("공고 신청내역 조회 오류:", error);
      throw error;
    }
  };

  // 신청 상태 업데이트 (수락/거절)
  const updateApplicationStatus = async (applyId, status) => {
    try {
      const response = await axiosInstance.put(`/applies/${applyId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("신청 상태 업데이트 오류:", error);
      throw error;
    }
  };

  // 특정 공고의 신청내역 조회 (단일 조회)
  const getJobApply = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/applies/${jobId}/apply`);
      return response.data;
    } catch (error) {
      console.error("공고 신청내역 단일 조회 오류:", error);
      throw error;
    }
  };

  // 특정 선생님의 특정 공고에 대한 매칭 요청 메시지 조회
  const getJobApplyMessage = async (jobId, memberId) => {
    try {
      const response = await axiosInstance.get(
        `/applies/${jobId}/apply-message`,
        {
          params: {
            member_id: memberId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("매칭 요청 메시지 조회 오류:", error);
      throw error;
    }
  };

  // 신청 상태 업데이트 (수락/거절) - 새로운 API 엔드포인트 사용
  const updateApplyStatus = async (jobId, applyId, status) => {
    try {
      const response = await axiosInstance.put(
        `/applies/${jobId}/${applyId}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("신청 상태 업데이트 오류:", error);
      throw error;
    }
  };

  // 선생님의 수락된 매칭 요청 조회
  const getJobApplyMatch = async () => {
    try {
      const response = await axiosInstance.get("/applies/match/me");
      return response.data;
    } catch (error) {
      console.error("수락된 매칭 요청 조회 오류:", error);
      throw error;
    }
  };

  const value = {
    matchingRequests,
    createMatchingRequest,
    createJobApply,
    acceptMatchingRequest,
    rejectMatchingRequest,
    startContract,
    completeContract,
    getMatchingRequestsForTeacher,
    getMatchingRequestsForParent,
    getPendingRequestsCount,
    getAllMatchingRequests,
    getJobApplications,
    updateApplicationStatus,
    getJobApply,
    getJobApplyMessage,
    updateApplyStatus,
    getJobApplyMatch,
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};
