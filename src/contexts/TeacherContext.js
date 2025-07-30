import React, { createContext, useContext, useState } from "react";

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
  const [teachers] = useState([
    {
      id: "teacher_001",
      name: "양연희",
      maskedName: maskTeacherName("양연희"),
      age: 34,
      rating: 4.8,
      hourlyWage: "15,000원",
      regions: ["관악구", "동작구", "영등포구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "아동상담사 2급"],
      skills: ["피아노", "미술", "영어", "수학"],
      preferences: ["초등학생", "활발한 아이", "학습 지도"],
      experience: "5년",
      introduction:
        "아이들과 함께하는 시간이 가장 행복합니다. 체계적인 학습 지도와 따뜻한 마음으로 아이들의 성장을 돕겠습니다.",
      profileImage: "/img/teacher-30-womam.png",
      birthYear: "1990",
      gender: "female",
      selectedFields: [
        "afterSchool",
        "foodCare",
        "sports",
        "music",
        "math",
        "subjectTutoring",
      ],
      uploadedFiles: {
        photo: { name: "profile_photo.jpg", size: 1024000, type: "image/jpeg" },
        identityVerification: {
          name: "identity_document.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_002",
      name: "김민수",
      maskedName: maskTeacherName("김민수"),
      age: 28,
      rating: 4.5,
      hourlyWage: "12,000원",
      regions: ["강남구", "서초구", "송파구"],
      certification: "초등교사 2급",
      qualifications: ["초등교사 2급", "영어지도사"],
      skills: ["영어", "수학", "과학", "체육"],
      preferences: ["초등학생", "영어 지도", "체육 활동"],
      experience: "3년",
      introduction:
        "아이들이 즐겁게 학습할 수 있도록 도와드립니다. 영어와 체육을 특기로 하고 있습니다.",
      profileImage: "/img/teacher-30-man.png",
      birthYear: "1995",
      gender: "male",
      selectedFields: ["subjectTutoring", "sports", "english", "afterSchool"],
      uploadedFiles: {
        photo: { name: "profile_photo.jpg", size: 1024000, type: "image/jpeg" },
        identityVerification: {
          name: "identity_document.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "pending",
    },
    {
      id: "teacher_003",
      name: "박지영",
      maskedName: maskTeacherName("박지영"),
      age: 42,
      rating: 4.7,
      hourlyWage: "18,000원",
      regions: ["마포구", "서대문구", "은평구"],
      certification: "보육교사 1급",
      qualifications: ["보육교사 1급", "음악치료사"],
      skills: ["음악", "미술", "요리", "독서"],
      preferences: ["유아", "창의적 활동", "음악 교육"],
      experience: "8년",
      introduction:
        "아이들의 창의력을 키워주는 활동을 좋아합니다. 음악과 미술을 통해 아이들이 자유롭게 표현할 수 있도록 도와드립니다.",
      profileImage: "/img/teacher-40-woman.png",
      birthYear: "1981",
      gender: "female",
      selectedFields: ["music", "art", "foodCare", "reading"],
      uploadedFiles: {
        photo: { name: "profile_photo.jpg", size: 1024000, type: "image/jpeg" },
        identityVerification: {
          name: "identity_document.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "matched",
    },
    {
      id: "teacher_004",
      name: "이준호",
      maskedName: maskTeacherName("이준호"),
      age: 25,
      rating: 4.3,
      hourlyWage: "11,000원",
      regions: ["성동구", "광진구", "중랑구"],
      certification: "체육교사 2급",
      qualifications: ["체육교사 2급", "스포츠지도사"],
      skills: ["체육", "축구", "농구", "수영"],
      preferences: ["초등학생", "체육 활동", "단체 활동"],
      experience: "2년",
      introduction:
        "아이들이 건강하게 성장할 수 있도록 체육 활동을 통해 도와드립니다. 다양한 스포츠를 가르칠 수 있습니다.",
      profileImage: "/img/teacher-20-woman.png",
      birthYear: "1998",
      gender: "male",
      selectedFields: ["sports", "afterSchool", "specialCare"],
      uploadedFiles: {
        photo: { name: "profile_photo.jpg", size: 1024000, type: "image/jpeg" },
        identityVerification: {
          name: "identity_document.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_005",
      name: "최영희",
      maskedName: maskTeacherName("최영희"),
      age: 55,
      rating: 4.9,
      hourlyWage: "20,000원",
      regions: ["노원구", "도봉구", "강북구"],
      certification: "보육교사 1급",
      qualifications: ["보육교사 1급", "아동심리상담사"],
      skills: ["독서", "한글", "수학", "생활습관"],
      preferences: ["유아", "기초 학습", "생활 지도"],
      experience: "12년",
      introduction:
        "오랜 경험을 바탕으로 아이들의 기초 학습과 생활습관 형성에 도움을 드립니다. 따뜻하고 인내심 있는 지도가 특기입니다.",
      profileImage: "/img/teacher-60-woman.png",
      birthYear: "1968",
      gender: "female",
      selectedFields: ["reading", "math", "specialCare", "foodCare"],
      uploadedFiles: {
        photo: { name: "profile_photo.jpg", size: 1024000, type: "image/jpeg" },
        identityVerification: {
          name: "identity_document.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_006",
      name: "정수진",
      maskedName: maskTeacherName("정수진"),
      age: 50,
      rating: 4.6,
      hourlyWage: "16,000원",
      regions: ["양천구", "강서구", "구로구"],
      certification: "초등교사 1급",
      qualifications: ["초등교사 1급", "수학교육전문가"],
      skills: ["수학", "과학", "한글", "사회"],
      preferences: ["초등학생", "수학 지도", "기초 학습"],
      experience: "10년",
      introduction:
        "수학을 어려워하는 아이들이 쉽게 이해할 수 있도록 도와드립니다. 체계적이고 단계적인 학습 지도가 특기입니다.",
      profileImage: "/img/teacher-wonam-50.png",
      birthYear: "1973",
      gender: "female",
      selectedFields: ["math", "subjectTutoring", "afterSchool", "reading"],
      uploadedFiles: {
        photo: { name: "profile_photo.jpg", size: 1024000, type: "image/jpeg" },
        identityVerification: {
          name: "identity_document.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "pending",
    },
  ]);

  const getAllTeachers = () => {
    return teachers;
  };

  const getHomeTeachers = () => {
    return teachers.slice(0, 2);
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
  };

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
};
