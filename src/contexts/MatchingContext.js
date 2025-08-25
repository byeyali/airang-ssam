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

  // 모든 매칭 요청 가져오기 (관리자용)
  const getAllMatchingRequests = () => {
    return matchingRequests;
  };

  // 특정 공고의 신청내역 조회 (단일 조회)
  const getJobApply = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/applies/job/${jobId}/apply`);
      return response.data;
    } catch (error) {
      console.error("공고 신청내역 단일 조회 오류:", error);
      throw error;
    }
  };

  // 신청 상태 업데이트 (수락/거절) - 올바른 라우팅
  const updateApplyStatus = async (jobId, applyId, status) => {
    try {
      console.log("updateApplyStatus 호출:", { jobId, applyId, status });

      // Azure에 배포된 올바른 라우팅 사용
      const url = `/applies/${applyId}/status`;
      console.log("요청 URL:", url);

      const response = await axiosInstance.put(url, {
        status: status,
      });
      console.log("응답 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("신청 상태 업데이트 오류:", error);
      console.error("요청 URL:", `/applies/${applyId}/status`);
      console.error("요청 데이터:", { status: status });
      throw error;
    }
  };

  // 계약 진행 확인 - Azure 라우팅
  const updateApplyConfirm = async (jobId, applyId, status) => {
    try {
      console.log("updateApplyConfirm 호출:", { jobId, applyId, status });

      // Azure에 배포된 confirm 라우팅 사용
      const url = `/applies/${jobId}/${applyId}/confirm`;
      console.log("요청 URL:", url);

      const response = await axiosInstance.put(url, {
        status: status,
      });
      console.log("응답 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("계약 진행 확인 오류:", error);
      console.error("요청 URL:", `/applies/${jobId}/${applyId}/confirm`);
      console.error("요청 데이터:", { status: status });
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
    getMatchingRequestsForTeacher,
    getMatchingRequestsForParent,
    getAllMatchingRequests,
    getJobApply,
    updateApplyStatus,
    updateApplyConfirm,
    getJobApplyMatch,
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};
