import React, { createContext, useContext, useState, useCallback } from "react";
import { isRegionMatch } from "../config/api";
import axiosInstance from "../config/axiosInstance";
import { useUser } from "./UserContext";

const ApplicationContext = createContext();

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplication must be used within an ApplicationProvider"
    );
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    selectedItems: [],
    address: "",
    selectedRegion: "",
    detailAddress: "",
    startDate: "",
    endDate: "",
    selectedDays: [],
    startTime: "",
    endTime: "",
    minAge: "",
    maxAge: "",
    selectedGender: "",
    selectedChild: "boy",
    selectedGrade: "유아",
    customAge: "5",
    minWage: "11000",
    maxWage: "",
    isNegotiable: false,
    requests: "",
    additionalInfo: "",
    hopeTutorId: null,
    teacherName: "",
  });

  // 부모용 공고 목록 조회 (백엔드 API 호출)
  const getMyApplications = async (params = {}) => {
    try {
      // 사용자 정보가 없으면 에러 반환
      if (!user || !user.id || !user.member_type) {
        console.error("사용자 정보가 없습니다:", user);
        throw new Error("사용자 정보가 없습니다. 로그인을 확인해주세요.");
      }

      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "DESC",
        status,
        startDate,
        endDate,
        categoryId,
        searchKeyword,
      } = params;

      // 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      queryParams.append("sortBy", sortBy);
      queryParams.append("sortOrder", sortOrder);

      // 사용자 정보 추가
      queryParams.append("member_id", user.id);
      queryParams.append("member_type", user.member_type);
      console.log("사용자 정보 전송:", {
        id: user.id,
        member_type: user.member_type,
      });

      if (status) queryParams.append("status", status);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (categoryId) queryParams.append("categoryId", categoryId);
      if (searchKeyword) queryParams.append("searchKeyword", searchKeyword);

      console.log("API 요청 URL:", `/jobs?${queryParams.toString()}`);
      console.log("요청 파라미터:", params);
      console.log("현재 사용자 정보:", user);

      const response = await axiosInstance.get(
        `/jobs?${queryParams.toString()}`
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          pagination: response.data.pagination,
          filters: response.data.filters,
        };
      } else {
        throw new Error(
          response.data.error || "공고 목록 조회에 실패했습니다."
        );
      }
    } catch (error) {
      console.error("getApplications 에러:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      console.error("에러 헤더:", error.response?.headers);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "공고 목록 조회 중 오류가 발생했습니다.",
        data: [],
        pagination: null,
        filters: null,
      };
    }
  };

  // 쌤 공고 생성 함수 (백엔드 API 호출)
  const addApplication = useCallback(async (jobData) => {
    try {
      const response = await axiosInstance.post("/jobs", jobData);
      return response.data;
    } catch (err) {
      // 더 자세한 에러 메시지 표시
      let errorMessage = "공고 생성 중 오류가 발생했습니다.";
      if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message ||
          "입력 정보가 올바르지 않습니다. 다시 확인해주세요.";
      } else if (err.response?.status === 401) {
        errorMessage = "로그인이 필요합니다.";
      } else if (err.response?.status === 403) {
        errorMessage = "권한이 없습니다.";
      } else if (err.response?.status === 422) {
        errorMessage =
          err.response?.data?.message || "입력 데이터 검증에 실패했습니다.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      throw new Error(errorMessage);
    }
  }, []);

  // 공고 분야 추가 함수
  const addApplicationCategories = async (jobId, fields) => {
    try {
      // jobId 유효성 검사
      if (!jobId || jobId === undefined || jobId === null) {
        throw new Error("jobId가 유효하지 않습니다.");
      }

      // 백엔드에서 기대하는 형식으로 데이터 준비
      // categoryId는 integer 형으로 저장되어야 함
      let processedFields = fields;
      if (Array.isArray(fields)) {
        processedFields = fields.map((field) => {
          // 숫자로 변환하여 저장
          const numField = parseInt(field);
          console.log(
            "필드 변환:",
            field,
            "->",
            numField,
            "타입:",
            typeof numField
          );
          return numField;
        });
      }

      const requestData = {
        categories: Array.isArray(processedFields)
          ? processedFields
          : [processedFields],
      };

      const response = await axiosInstance.post(
        `/jobs/${jobId}/category`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err) {
      setError("분야 추가 중 문제가 발생했습니다.");
      throw err;
    }
  };

  const deleteApplicationCategory = async (tutorId) => {
    try {
      const response = await axiosInstance.delete(`/jobs/${tutorId}/category`);
      return response.data;
    } catch (error) {
      setError("분야 데이터 삭제에 실패했습니다.");
      throw error;
    }
  };
  // 공고 삭제 (백엔드 API 호출)
  const deleteApplication = async (applicationId) => {
    try {
      if (!user || !user.id || !user.member_type) {
        throw new Error("사용자 정보가 없습니다. 로그인을 확인해주세요.");
      }

      const response = await axiosInstance.delete(`/jobs/${applicationId}`);

      if (response.status === 200 || response.status === 204) {
        // 로컬 state에서도 제거
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
        return { success: true };
      } else {
        throw new Error("공고 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("공고 삭제 오류:", error);
      throw new Error("공고 삭제에 실패했습니다.");
    }
  };

  // 특정 공고 조회 (백엔드 API 호출)
  const getApplicationById = async (applicationId) => {
    try {
      console.log("getApplicationById 시작, applicationId:", applicationId);
      console.log("현재 사용자 정보:", user);

      if (!user || !user.id || !user.member_type) {
        throw new Error("사용자 정보가 없습니다. 로그인을 확인해주세요.");
      }

      console.log("API 호출 시작: /jobs/${applicationId}");
      const response = await axiosInstance.get(`/jobs/${applicationId}`);
      console.log("API 응답:", response);

      // 백엔드에서 직접 job 객체를 반환하므로 response.data가 바로 데이터
      console.log("반환할 데이터:", response.data);
      return response.data;
    } catch (error) {
      console.error("공고 상세 조회 오류:", error);
      if (error.response && error.response.status === 404) {
        throw new Error("도와줘요 쌤 공고가 없습니다.");
      }
      throw new Error("공고 정보를 불러오는데 실패했습니다.");
    }
  };

  // 공고 상태 변경
  const updateApplicationStatus = (applicationId, status) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : app
      )
    );
  };

  // 공고 수정 (백엔드 API 호출)
  const updateApplication = async (applicationId, updatedData) => {
    try {
      console.log("updateApplication 시작, applicationId:", applicationId);
      console.log("수정할 데이터:", updatedData);

      if (!user || !user.id || !user.member_type) {
        throw new Error("사용자 정보가 없습니다. 로그인을 확인해주세요.");
      }

      const response = await axiosInstance.put(
        `/jobs/${applicationId}`,
        updatedData
      );
      console.log("수정 API 응답:", response);

      return response.data;
    } catch (error) {
      console.error("공고 수정 오류:", error);
      throw new Error("공고 수정에 실패했습니다.");
    }
  };

  // 공고 카테고리 삭제 (백엔드 API 호출)
  const deleteApplicationCategories = async (applicationId) => {
    try {
      console.log(
        "deleteApplicationCategories 시작, applicationId:",
        applicationId
      );

      if (!user || !user.id || !user.member_type) {
        throw new Error("사용자 정보가 없습니다. 로그인을 확인해주세요.");
      }

      const response = await axiosInstance.delete(
        `/jobs/${applicationId}/category`
      );
      console.log("카테고리 삭제 API 응답:", response);

      return response.data;
    } catch (error) {
      console.error("카테고리 삭제 오류:", error);
      throw new Error("카테고리 삭제에 실패했습니다.");
    }
  };

  // 폼 데이터 업데이트
  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // 폼 데이터 초기화
  const clearFormData = () => {
    setFormData({
      selectedItems: [],
      address: "",
      selectedRegion: "",
      detailAddress: "",
      startDate: "",
      endDate: "",
      selectedDays: [],
      startTime: "",
      endTime: "",
      minAge: "",
      maxAge: "",
      selectedGender: "",
      selectedChild: "boy",
      selectedGrade: "유아",
      customAge: "5",
      minWage: "11000",
      maxWage: "",
      isNegotiable: false,
      requests: "",
      additionalInfo: "",
      hopeTutorId: null,
      teacherName: "",
    });
  };

  // 모든 공고 조회 (홈페이지용)
  const getAllApplications = () => {
    return applications;
  };

  const value = {
    applications,
    formData,
    addApplication,
    addApplicationCategories,
    deleteApplicationCategory,
    getMyApplications,
    updateFormData,
    clearFormData,
    updateApplication,
    deleteApplicationCategories,
    deleteApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
