import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // 실제 로그인 로직 (임시)
    if (email === "a@abc.com" && password === "password") {
      const userData = {
        id: "user_001",
        name: "김가정",
        email: "a@abc.com",
        type: "parent",
        region: "관악구",
        birthYear: "1985",
        gender: "female",
        phone: "010-1234-5678",
        address: "서울특별시 관악구 신림동",
        familyInfo: {
          children: [
            {
              id: "child_001",
              name: "김민수",
              age: 8,
              grade: "초등학교 2학년",
              gender: "male",
              interests: ["피아노", "미술", "독서"],
              specialNeeds: "없음",
            },
          ],
        },
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "b@abc.com" && password === "password") {
      const userData = {
        id: "teacher_001",
        name: "양연희",
        email: "b@abc.com",
        type: "teacher",
        regions: ["관악구", "동작구", "영등포구"],
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
          photo: {
            name: "profile_photo.jpg",
            size: 1024000,
            type: "image/jpeg",
          },
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
      };
      setUser(userData);
      return { success: true, user: userData };
    } else {
      return {
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
