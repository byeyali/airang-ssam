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
  if (name.length <= 2) return name;
  return name.charAt(0) + "O" + name.charAt(name.length - 1);
};

export const TeacherProvider = ({ children }) => {
  const [teachers] = useState([
    {
      id: "teacher_001",
      name: "김영희",
      maskedName: maskTeacherName("김영희"),
      age: 28,
      rating: 4.8,
      hourlyWage: "15,000원",
      regions: ["관악구", "동작구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "아동상담사 2급"],
      skills: ["돌봄", "놀이"],
      preferences: ["초등학생", "활발한 아이", "학습 지도"],
      experience: "5년",
      introduction:
        "아이들과 함께하는 시간이 가장 행복합니다. 체계적인 학습 지도와 따뜻한 마음으로 아이들의 성장을 돕겠습니다.",
      profileImage: "/img/teacher-kimyouhghee-womam.png", // 김영희
      birthYear: "1995",
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
      name: "박민수",
      maskedName: maskTeacherName("박민수"),
      age: 32,
      rating: 4.9,
      hourlyWage: "18,000원",
      regions: ["강남구", "서초구"],
      certification: "초등교사 2급",
      qualifications: ["초등교사 2급", "영어지도사"],
      skills: ["스터디", "영어"],
      preferences: ["초등학생", "영어 학습", "체계적 지도"],
      experience: "7년",
      introduction:
        "체계적이고 재미있는 학습을 제공하는 쌤입니다. 영어와 함께하는 즐거운 시간을 만들어드립니다.",
      profileImage: "/img/teacher-man-ball.jpg", // 박민수
      birthYear: "1991",
      gender: "male",
      selectedFields: ["subjectTutoring", "english", "math"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_2.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_2.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_2.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_2.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_2.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_2.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_003",
      name: "김지영",
      maskedName: maskTeacherName("김지영"),
      age: 26,
      rating: 4.7,
      hourlyWage: "16,000원",
      regions: ["관악구", "동작구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "과학지도사"],
      skills: ["과학 실험", "보드게임", "음악", "미술"],
      preferences: ["초등학생", "과학 실험", "창의적 놀이"],
      experience: "4년",
      introduction:
        "과학 실험과 보드게임을 통해 아이들의 창의력을 키우는 쌤입니다. 음악과 미술도 함께 가르쳐드립니다.",
      profileImage: "/img/teacher-kimjiyoung.jpg", // 김지영
      birthYear: "1992",
      gender: "female",
      selectedFields: ["science", "boardGame", "music", "art"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_3.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_3.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_3.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_3.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_3.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_3.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_004",
      name: "최지영",
      maskedName: maskTeacherName("최지영"),
      age: 29,
      rating: 4.6,
      hourlyWage: "16,000원",
      regions: ["관악구", "동작구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "놀이치료사"],
      skills: ["놀이", "스터디"],
      preferences: ["초등학생", "창의적 놀이", "학습 지도"],
      experience: "4년",
      introduction:
        "창의적인 놀이와 학습을 통해 아이들의 잠재력을 키우는 쌤입니다. 재미있고 의미 있는 시간을 만들어드립니다.",
      profileImage: "/img/teacher-math-english.jpg", // 최지영
      birthYear: "1994",
      gender: "female",
      selectedFields: ["boardGame", "art", "subjectTutoring"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_4.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_4.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_4.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_4.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_4.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_4.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_005",
      name: "한미영",
      maskedName: maskTeacherName("한미영"),
      age: 31,
      rating: 4.8,
      hourlyWage: "17,000원",
      regions: ["강남구", "서초구"],
      certification: "보육교사 1급",
      qualifications: ["보육교사 1급", "영어지도사"],
      skills: ["돌봄", "영어"],
      preferences: ["초등학생", "영어 학습", "따뜻한 돌봄"],
      experience: "6년",
      introduction:
        "영어와 돌봄을 함께하는 특별한 경험을 제공하는 쌤입니다. 자연스러운 영어 환경을 만들어드립니다.",
      profileImage: "/img/teacher-studing-with-2children.jpeg", // 한미영
      birthYear: "1992",
      gender: "female",
      selectedFields: ["english", "afterSchool", "foodCare"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_5.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_5.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_5.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_5.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_5.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_5.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_006",
      name: "정성훈",
      maskedName: maskTeacherName("정성훈"),
      age: 35,
      rating: 4.9,
      hourlyWage: "20,000원",
      regions: ["마포구", "영등포구"],
      certification: "중등교사 2급",
      qualifications: ["중등교사 2급", "수학교육전공"],
      skills: ["스터디", "수학"],
      preferences: ["초등학생", "수학 학습", "체계적 지도"],
      experience: "8년",
      introduction:
        "수학의 재미를 발견할 수 있도록 도와주는 쌤입니다. 체계적이고 이해하기 쉬운 수학을 가르칩니다.",
      profileImage: "/img/teacher-man-readingbook.png", // 정성훈 (35세 남성)
      birthYear: "1988",
      gender: "male",
      selectedFields: ["math", "subjectTutoring"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_6.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_6.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_6.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_6.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_6.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_6.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_007",
      name: "김태현",
      maskedName: maskTeacherName("김태현"),
      age: 27,
      rating: 4.7,
      hourlyWage: "15,000원",
      regions: ["관악구", "동작구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "놀이치료사"],
      skills: ["놀이", "음식"],
      preferences: ["초등학생", "즐거운 놀이", "맛있는 간식"],
      experience: "4년",
      introduction:
        "즐거운 놀이와 맛있는 간식을 함께하는 쌤입니다. 아이들이 행복한 시간을 보낼 수 있도록 돕겠습니다.",
      profileImage: "/img/kimtashyeon-man.png", // 김태현 (27세 남성)
      birthYear: "1996",
      gender: "male",
      selectedFields: ["boardGame", "foodCare", "sports"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_7.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_7.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_7.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_7.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_7.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_7.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_008",
      name: "박성훈",
      maskedName: maskTeacherName("박성훈"),
      age: 30,
      rating: 4.8,
      hourlyWage: "16,000원",
      regions: ["강남구", "서초구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "아동상담사 2급"],
      skills: ["돌봄", "스터디"],
      preferences: ["초등학생", "체계적 학습", "따뜻한 돌봄"],
      experience: "5년",
      introduction:
        "체계적인 학습과 따뜻한 돌봄을 제공하는 쌤입니다. 아이들의 성장을 함께 지켜보겠습니다.",
      profileImage: "/img/teacher-30-man.png", // 박성훈 (30세 남성)
      birthYear: "1993",
      gender: "male",
      selectedFields: ["afterSchool", "subjectTutoring", "foodCare"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_8.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_8.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_8.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_8.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_8.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_8.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_009",
      name: "이미영",
      maskedName: maskTeacherName("이미영"),
      age: 22,
      rating: 4.5,
      hourlyWage: "13,000원",
      regions: ["강남구", "서초구"],
      certification: "보육교사 2급",
      qualifications: ["보육교사 2급", "영어지도사"],
      skills: ["돌봄", "영어"],
      preferences: ["초등학생", "영어 학습", "따뜻한 돌봄"],
      experience: "2년",
      introduction:
        "젊은 에너지로 아이들과 함께 성장하는 쌤입니다. 영어와 함께하는 즐거운 시간을 만들어드립니다.",
      profileImage: "/img/teacher-20-woman.png", // 이미영 (22세 여성)
      birthYear: "2001",
      gender: "female",
      selectedFields: ["english", "afterSchool", "foodCare"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_9.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_9.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_9.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_9.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_9.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_9.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_010",
      name: "박지영",
      maskedName: maskTeacherName("박지영"),
      age: 45,
      rating: 4.9,
      hourlyWage: "22,000원",
      regions: ["관악구", "동작구"],
      certification: "보육교사 1급",
      qualifications: ["보육교사 1급", "아동상담사 1급"],
      skills: ["돌봄", "상담"],
      preferences: ["초등학생", "정서적 안정", "체계적 돌봄"],
      experience: "15년",
      introduction:
        "오랜 경험을 바탕으로 아이들의 정서적 안정과 성장을 돕는 쌤입니다. 따뜻하고 전문적인 돌봄을 제공합니다.",
      profileImage: "/img/teacher-40-woman.png", // 박지영 (45세 여성)
      birthYear: "1978",
      gender: "female",
      selectedFields: ["afterSchool", "foodCare", "specialcare"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_10.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_10.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_10.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_10.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_10.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_10.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
    {
      id: "teacher_011",
      name: "최영희",
      maskedName: maskTeacherName("최영희"),
      age: 55,
      rating: 4.8,
      hourlyWage: "25,000원",
      regions: ["강남구", "서초구"],
      certification: "보육교사 1급",
      qualifications: ["보육교사 1급", "아동상담사 1급", "놀이치료사"],
      skills: ["돌봄", "상담", "놀이치료"],
      preferences: ["초등학생", "특별한 돌봄", "전문적 지도"],
      experience: "20년",
      introduction:
        "20년간의 경험을 바탕으로 전문적이고 따뜻한 돌봄을 제공하는 쌤입니다. 아이들의 특별한 요구에도 대응합니다.",
      profileImage: "/img/teacher-60-woman.png", // 최영희 (55세 여성)
      birthYear: "1968",
      gender: "female",
      selectedFields: ["specialcare", "afterSchool", "foodCare"],
      uploadedFiles: {
        photo: {
          name: "profile_photo_11.jpg",
          size: 1024000,
          type: "image/jpeg",
        },
        identityVerification: {
          name: "identity_document_11.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        healthCheck: {
          name: "health_check_11.pdf",
          size: 1536000,
          type: "application/pdf",
        },
        qualification: {
          name: "qualification_cert_11.pdf",
          size: 1024000,
          type: "application/pdf",
        },
        portfolio: {
          name: "portfolio_11.pdf",
          size: 3072000,
          type: "application/pdf",
        },
        bankbook: {
          name: "bankbook_copy_11.pdf",
          size: 512000,
          type: "application/pdf",
        },
      },
      profileCompleted: true,
      matchingStatus: "available",
    },
  ]);

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
