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

  const getTutorById = async (id) => {
    try {
      const response = await axiosInstance.get(`/tutors?memberId=${id}`);
      return response.data;
    } catch (err) {
      // 404 Not Found 에러인 경우 (프로필이 없는 경우)
      if (err.response && err.response.status === 404) {
        return null; // null을 반환하여 프로필이 없음을 나타냄
      }

      // 그 외 에러인 경우
      setError("선생님 정보를 불러오는 데 실패했습니다.");
      throw err; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
    }
  };

  const createTutor = async (formData) => {
    // FormData 내용 상세 로깅
    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    setLoading(true); // 로딩 상태 시작
    setError(null); // 기존 오류 상태 초기화

    try {
      // POST 요청을 통해 FormData를 서버에 전송
      const response = await axiosInstance.post("/tutors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 파일 경로 정보가 응답에 포함되어 있는지 확인
      if (response.data.photo_path) {
        console.log("사진 경로:", response.data.photo_path);
      }

      if (response.data.filePaths || response.data.files) {
        console.log(
          "파일 경로 정보:",
          response.data.filePaths || response.data.files
        );
      }

      return response.data; // 응답 데이터 반환
    } catch (err) {
      console.error("Tutor creation failed:", err);
      setError("프로필 등록 중 문제가 발생했습니다.");
      throw err; // 오류 발생 시 다시 throw
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const updateTutor = async (tutorId, formData) => {
    setLoading(true); // 로딩 상태 시작
    setError(null); // 기존 오류 상태 초기화

    try {
      // PUT 요청을 통해 FormData를 서버에 전송
      const response = await axiosInstance.put(`/tutors/${tutorId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // 응답 데이터 반환
    } catch (err) {
      setError("프로필 수정 중 문제가 발생했습니다.");
      throw err; // 오류 발생 시 다시 throw
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 분야 추가 함수
  const addTutorCategory = async (tutorId, fields) => {
    try {
      // 백엔드에서 기대하는 형식으로 데이터 준비
      // fields가 문자열 배열이면 숫자로 변환 시도
      let processedFields = fields;
      if (Array.isArray(fields)) {
        processedFields = fields.map((field) => {
          // 숫자로 변환 가능한지 확인
          const numField = parseInt(field);
          return isNaN(numField) ? field : numField;
        });
      }

      const requestData = {
        categories: Array.isArray(processedFields)
          ? processedFields
          : [processedFields],
      };

      const response = await axiosInstance.post(
        `/tutors/${tutorId}/category`,
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

  // 지역 추가 함수
  const addTutorRegion = async (tutorId, regions) => {
    try {
      let processedRegions = regions;
      if (Array.isArray(regions)) {
        processedRegions = regions.map((region) => {
          // 숫자로 변환 가능한지 확인
          const numRegion = parseInt(region);
          return isNaN(numRegion) ? region : numRegion;
        });
      }

      // 백엔드 API에 맞는 데이터 형식으로 변환
      const requestData = {
        regions: Array.isArray(processedRegions)
          ? processedRegions.map((region) => {
              // 지역 데이터가 객체인지 문자열인지 확인
              if (typeof region === "object" && region.regionNm) {
                return {
                  region_name: region.regionNm, // regionNm을 region_name으로 매핑
                };
              }
              // 문자열인 경우
              if (typeof region === "string") {
                return {
                  region_name: region,
                };
              }
              return region;
            })
          : [processedRegions],
      };

      const response = await axiosInstance.post(
        `/tutors/${tutorId}/region`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      setError("지역 추가 중 문제가 발생했습니다.");
      throw err;
    }
  };

  // 파일 업로드 함수 (실제 파일 전송)
  const uploadTutorFiles = async (tutorId, files) => {
    try {
      console.log("파일 업로드 시작:", files);

      const formData = new FormData();

      // 파일과 타입을 FormData에 추가 (키 값 사용)
      Object.entries(files).forEach(([key, fileData]) => {
        if (fileData?.file) {
          formData.append("files", fileData.file);
          formData.append("file_doc_type", key); // 키 값 직접 사용
        }
      });

      // FormData 내용 확인 (디버깅용)
      console.log("업로드할 파일들:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.post(
        `/tutors/${tutorId}/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("파일 업로드 성공:", response.data);
      return response.data;
    } catch (err) {
      console.error("File upload failed:", err);
      console.error("에러 응답:", err.response?.data);
      setError("파일 업로드 중 문제가 발생했습니다.");
      throw err;
    }
  };

  // 파일 경로 저장 함수 (기존 호환성 유지)
  const saveTutorFilePaths = async (tutorId, filePaths) => {
    try {
      console.log("파일 경로 저장 시작:", filePaths);

      const response = await axiosInstance.post(
        `/tutors/${tutorId}/files`,
        {
          filePaths: filePaths,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("파일 경로 저장 성공:", response.data);
      return response.data;
    } catch (err) {
      console.error("File paths save failed:", err);
      console.error("에러 응답:", err.response?.data);
      setError("파일 경로 저장 중 문제가 발생했습니다.");
      throw err;
    }
  };

  const getTutorCategories = async (tutorId) => {
    try {
      const categoryResponse = await axiosInstance.get(
        `/tutors/${tutorId}/category`
      );

      if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
        const categoryIds = categoryResponse.data.map(
          (category) => category.category_id || category.id || category
        );
        return categoryIds;
      } else if (
        categoryResponse.data &&
        Array.isArray(categoryResponse.data.categories)
      ) {
        const categoryIds = categoryResponse.data.categories.map(
          (category) => category.category_id || category.id || category
        );
        return categoryIds;
      } else {
        return [];
      }
    } catch (error) {
      setError("분야 데이터를 불러오는 데 실패했습니다.");
      return [];
    }
  };

  const getTutorRegions = async (tutorId) => {
    try {
      const regionResponse = await axiosInstance.get(
        `/tutors/${tutorId}/region`
      );

      if (regionResponse.data && Array.isArray(regionResponse.data)) {
        // 백엔드에서 반환하는 TutorRegion 모델 데이터를 RegionSearch 형식으로 변환
        const regions = regionResponse.data.map((region) => ({
          regionNm: region.region_name,
          regionCd: region.id || region.tutor_id,
        }));
        return regions;
      } else {
        return [];
      }
    } catch (error) {
      setError("지역 데이터를 불러오는 데 실패했습니다.");
      return [];
    }
  };

  const deleteTutorCategories = async (tutorId) => {
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

  const deleteTutorRegions = async (tutorId) => {
    try {
      const response = await axiosInstance.delete(`/tutors/${tutorId}/region`);
      return response.data;
    } catch (error) {
      setError("지역 데이터 삭제에 실패했습니다.");
      throw error;
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
    updateTutor,
    getTutorById,
    getTutorCategories,
    getTutorRegions,
    deleteTutorCategories,
    deleteTutorRegions,
    addTutorCategory,
    addTutorRegion,
    uploadTutorFiles,
    saveTutorFilePaths,
    loading,
    error,
  };

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
};
