import React, { createContext, useContext, useState } from "react";
import { isRegionMatch } from "../config/api";

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
  const [applications, setApplications] = useState([]);
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

  // 공고 추가
  const addApplication = (newApplication) => {
    const application = {
      ...newApplication,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setApplications((prev) => [application, ...prev]);
    return application;
  };

  // 공고 수정
  const updateApplication = (applicationId, updatedData) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              ...updatedData,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : app
      )
    );
  };

  // 공고 삭제
  const deleteApplication = (applicationId) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
  };

  // 모든 공고 조회
  const getAllApplications = () => {
    return applications;
  };

  // 내 공고 조회 (부모용)
  const getMyApplications = (userId) => {
    return applications.filter((app) => app.parentId === userId);
  };

  // 매칭 가능한 공고 조회 (쌤용)
  const getMatchingApplications = (teacherRegions) => {
    return applications.filter(
      (app) =>
        app.status === "active" && isRegionMatch(app.region, teacherRegions)
    );
  };

  // 특정 공고 조회
  const getApplicationById = (applicationId) => {
    return applications.find((app) => app.id === applicationId);
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

  const value = {
    applications,
    formData,
    updateFormData,
    clearFormData,
    addApplication,
    updateApplication,
    deleteApplication,
    getAllApplications,
    getMyApplications,
    getMatchingApplications,
    getApplicationById,
    updateApplicationStatus,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
