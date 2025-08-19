import React, { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../config/axiosInstance";

const TeacherSearchContext = createContext();

export const useTeacherSearch = () => {
  const context = useContext(TeacherSearchContext);
  if (!context) {
    throw new Error(
      "useTeacherSearch must be used within a TeacherSearchProvider"
    );
  }
  return context;
};

export const TeacherSearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setSearchData = useCallback((results, query) => {
    // 상태 변경을 배치로 처리
    setSearchResults(results || []);
    setSearchQuery(query || "");
  }, []);

  const clearSearchData = useCallback(() => {
    setSearchResults([]);
    setSearchQuery("");
    setError(null);
  }, []);

  // 선생님 검색 API 호출 함수
  const searchTeachers = useCallback(async (teacherName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/tutors/list?name=${teacherName}`
      );
      setSearchResults(response.data || []);
      return response.data;
    } catch (err) {
      // 더 자세한 에러 메시지 표시
      let errorMessage = "선생님 검색 중 오류가 발생했습니다.";
      if (err.response?.status === 400) {
        errorMessage = "검색 조건이 올바르지 않습니다. 다시 시도해주세요.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setSearchResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 선생님 상세 정보 조회 함수
  const getTeacherById = useCallback(async (teacherId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/tutors/${teacherId}`);
      return response.data;
    } catch (err) {
      console.error("선생님 상세 정보 조회 실패:", err);
      setError(
        err.response?.data?.message ||
          "선생님 정보 조회 중 오류가 발생했습니다."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 쌤 목록 조회 함수 (getTutorList)
  const getTutorList = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log("쌤 목록 조회 요청 파라미터:", searchParams);
      console.log("요청 URL:", "/tutors/list");

      const response = await axiosInstance.get("/tutors/list", {
        params: searchParams,
      });

      console.log("쌤 목록 조회 응답:", response.data);
      console.log("응답 상태:", response.status);

      return response.data;
    } catch (err) {
      console.error("쌤 목록 조회 실패:", err);
      console.error("에러 응답:", err.response?.data);
      console.error("에러 상태:", err.response?.status);
      console.error("에러 메시지:", err.response?.data?.message);

      // 더 자세한 에러 메시지 표시
      let errorMessage = "쌤 목록 조회 중 오류가 발생했습니다.";
      if (err.response?.status === 400) {
        errorMessage = "조회 조건이 올바르지 않습니다. 다시 시도해주세요.";
      } else if (err.response?.status === 401) {
        errorMessage = "로그인이 필요합니다.";
      } else if (err.response?.status === 403) {
        errorMessage = "권한이 없습니다.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 쌤 공고 생성 함수
  const createTutorJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);

    try {
      console.log("공고 생성 요청 데이터:", jobData);
      console.log("요청 URL:", "/jobs");

      const response = await axiosInstance.post("/jobs", jobData);

      console.log("공고 생성 응답:", response.data);
      console.log("응답 상태:", response.status);

      return response.data;
    } catch (err) {
      console.error("공고 생성 실패:", err);
      console.error("에러 응답:", err.response?.data);
      console.error("에러 상태:", err.response?.status);
      console.error("에러 메시지:", err.response?.data?.message);

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

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 공고 분야 추가 함수
  const addTutorJobCategory = async (jobId, fields) => {
    try {
      console.log("=== addTutorJobCategory 디버그 ===");
      console.log("전달받은 jobId:", jobId, "타입:", typeof jobId);
      console.log("전달받은 fields:", fields, "타입:", typeof fields);
      console.log("fields 배열 여부:", Array.isArray(fields));

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

      console.log("전송할 requestData:", requestData);
      console.log("요청 URL:", `/jobs/${jobId}/category`);

      const response = await axiosInstance.post(
        `/jobs/${jobId}/category`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("응답 성공:", response.data);
      return response.data;
    } catch (err) {
      console.error("=== addTutorJobCategory 오류 ===");
      console.error("오류 객체:", err);
      console.error("오류 응답:", err.response?.data);
      console.error("오류 상태:", err.response?.status);
      setError("분야 추가 중 문제가 발생했습니다.");
      throw err;
    }
  };

  const deleteTutorJobCategories = async (tutorId) => {
    try {
      const response = await axiosInstance.delete(
        `/tutors/${tutorId}/category`
      );
      return response.data;
    } catch (error) {
      setError("분야 데이터 삭제에 실패했습니다.");
      throw error;
    }
  };

  return (
    <TeacherSearchContext.Provider
      value={{
        searchResults,
        searchQuery,
        loading,
        error,
        setSearchData,
        clearSearchData,
        searchTeachers,
        getTeacherById,
        getTutorList,
        createTutorJob,
        addTutorJobCategory,
      }}
    >
      {children}
    </TeacherSearchContext.Provider>
  );
};
