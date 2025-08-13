import React, { createContext, useContext, useState } from "react";
import {
  getMatchingTeachersByScore,
  extractChildGender,
  calculateGenderMatchScore,
} from "../config/api";

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
  if (name.length <= 2) return name;
  return name.charAt(0) + "O" + name.charAt(name.length - 1);
};

export const TeacherProvider = ({ children }) => {
  const [teachers] = useState([]);

  const getAllTeachers = () => {
    return teachers;
  };

  const getHomeTeachers = () => {
    return teachers.slice(0, 6);
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

  // 성별 매칭을 고려한 선생님 조회
  const getMatchingTeachersWithGender = (application) => {
    if (!application) {
      return getMatchingTeachers([application?.region?.title]);
    }

    return getMatchingTeachersByScore(application, teachers);
  };

  // 아이 성별에 따른 선생님 필터링
  const getTeachersByChildGender = (childGender) => {
    if (!childGender) {
      return teachers;
    }

    return teachers.filter((teacher) => teacher.gender === childGender);
  };

  // 성별 매칭 점수 계산
  const calculateTeacherGenderMatch = (childGender, teacherGender) => {
    return calculateGenderMatchScore(childGender, teacherGender);
  };

  // 공고에서 아이 성별 추출
  const getChildGenderFromApplication = (application) => {
    return extractChildGender(application);
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
    getMatchingTeachersWithGender,
    getTeachersByChildGender,
    calculateTeacherGenderMatch,
    getChildGenderFromApplication,
    getTeacherById,
  };

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
};
