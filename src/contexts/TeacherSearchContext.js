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
      const response = await axiosInstance.get(`/tutors?name=${teacherName}`);

      console.log("API 응답:", response.data);
      console.log("응답 상태:", response.status);
      setSearchResults(response.data || []);
      return response.data;
    } catch (err) {
      console.error("선생님 검색 실패:", err);
      console.error("에러 응답:", err.response?.data);
      console.error("에러 상태:", err.response?.status);
      console.error("에러 메시지:", err.response?.data?.message);

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

  // 쌤 공고 생성 함수
  const createTutorJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);

    try {
      console.log("공고 생성 요청 데이터:", jobData);
      console.log("요청 URL:", "/");

      const response = await axiosInstance.post("/", jobData);

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
        errorMessage = "입력 정보가 올바르지 않습니다. 다시 확인해주세요.";
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
        createTutorJob,
      }}
    >
      {children}
    </TeacherSearchContext.Provider>
  );
};
