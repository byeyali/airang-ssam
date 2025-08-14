import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosInstance";

const TeacherContext = createContext();

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
};

// 쌤 이름 마스킹 함수
const maskTeacherName = (name) => {
  if (name.length <= 2) return name + " 쌤";
  return name.charAt(0) + "O" + name.charAt(name.length - 1) + " 쌤";
};

export const TeacherProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teachers] = useState(null);

  const createTutor = async (formData) => {
    console.log(formData);
    setLoading(true); // 로딩 상태 시작
    setError(null); // 기존 오류 상태 초기화

    try {
      // POST 요청을 통해 FormData를 서버에 전송
      const response = await axiosInstance.post("/tutors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // 응답 데이터 반환
    } catch (err) {
      console.error("Tutor creation failed:", err);
      setError("프로필 등록 중 문제가 발생했습니다.");
      throw err; // 오류 발생 시 다시 throw
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const getTutorById = async (id) => {
    try {
      const response = await axiosInstance.get(`/tutors/${id}`);
      return response.data;
    } catch (err) {
      console.error("Tutor fetch failed:", err);
      setError("선생님 정보를 불러오는 데 실패했습니다.");
    }
  };

  const getAllTeachers = () => {
    return teachers;
  };

  const getHomeTeachers = () => {
    if (!teachers || teachers.length === 0) {
      // Handle case where teachers data is empty or null
      return [];
    }
  };

  const getTeachersByRegion = (regions) => {
    return teachers.filter((teacher) =>
      teacher.regions.some((region) => regions.includes(region))
    );
  };

  const getMatchingTeachers = (parentRegions) => {
    return teachers.filter((teacher) =>
      teacher.regions.some((region) => parentRegions.includes(region))
    );
  };

  const getTeacherById = (id) => {
    return teachers.find((teacher) => teacher.id === id);
  };

  const value = {
    teachers,
    getAllTeachers,
    getHomeTeachers,
    getTeachersByRegion,
    getMatchingTeachers,
    getTeacherById,
    createTutor,
    getTutorById,
    loading,
    error,
  };

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
};
