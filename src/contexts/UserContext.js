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
  const [user, setUserState] = useState(() => {
    // localStorage에서 사용자 정보 복원
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = (email, password) => {
    // 실제 로그인 로직 (임시)
    if (email === "a@abc.com" && password === "password") {
      const userData = {
        id: "user_001",
        name: "김가정",
        email: "a@abc.com",
        type: "parent",
        region: "관악구",
        selectedRegions: ["관악구", "동작구"],
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
    } else if (email === "admin@abc.com" && password === "password") {
      const userData = {
        id: "admin_001",
        name: "관리자",
        email: "admin@abc.com",
        type: "admin",
        region: "전체",
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "c@abc.com" && password === "password") {
      const userData = {
        id: "user_002",
        name: "박영희",
        email: "c@abc.com",
        type: "parent",
        region: "관악구",
        selectedRegions: ["관악구", "동작구"],
        birthYear: "1988",
        gender: "female",
        phone: "010-2345-6789",
        address: "서울특별시 관악구 봉천동",
        familyInfo: {
          children: [
            {
              id: "child_002",
              name: "박지우",
              age: 9,
              grade: "초등학교 3학년",
              gender: "female",
              interests: ["과학", "보드게임", "독서"],
              specialNeeds: "없음",
            },
          ],
        },
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "d@abc.com" && password === "password") {
      const userData = {
        id: "user_003",
        name: "최민수",
        email: "d@abc.com",
        type: "parent",
        region: "강남구",
        selectedRegions: ["강남구", "서초구"],
        birthYear: "1987",
        gender: "male",
        phone: "010-3456-7890",
        address: "서울특별시 강남구 역삼동",
        familyInfo: {
          children: [
            {
              id: "child_003",
              name: "최서연",
              age: 7,
              grade: "초등학교 1학년",
              gender: "female",
              interests: ["영어", "수학", "미술"],
              specialNeeds: "없음",
            },
          ],
        },
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "e@abc.com" && password === "password") {
      const userData = {
        id: "user_004",
        name: "정지영",
        email: "e@abc.com",
        type: "parent",
        region: "마포구",
        selectedRegions: ["마포구", "서대문구"],
        birthYear: "1986",
        gender: "female",
        phone: "010-4567-8901",
        address: "서울특별시 마포구 합정동",
        familyInfo: {
          children: [
            {
              id: "child_004",
              name: "정현우",
              age: 10,
              grade: "초등학교 4학년",
              gender: "male",
              interests: ["체육", "농구", "독서"],
              specialNeeds: "없음",
            },
          ],
        },
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "f@abc.com" && password === "password") {
      const userData = {
        id: "teacher_002",
        name: "김지영",
        email: "f@abc.com",
        type: "teacher",
        regions: ["관악구", "동작구"],
        birthYear: "1992",
        gender: "female",
        selectedFields: ["science", "boardGame", "music", "art"],
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
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "g@abc.com" && password === "password") {
      const userData = {
        id: "teacher_002",
        name: "박민수",
        email: "g@abc.com",
        type: "teacher",
        regions: ["관악구", "동작구"],
        birthYear: "1989",
        gender: "male",
        selectedFields: ["sports", "basketball", "afterSchool", "clean"],
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
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "h@abc.com" && password === "password") {
      const userData = {
        id: "teacher_004",
        name: "이수진",
        email: "h@abc.com",
        type: "teacher",
        regions: ["강남구", "서초구"],
        birthYear: "1991",
        gender: "female",
        selectedFields: [
          "english",
          "math",
          "subjectTutoring",
          "readingDiscussion",
        ],
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
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "admin@abc.com" && password === "password") {
      const userData = {
        id: "admin_001",
        name: "관리자",
        email: "admin@abc.com",
        type: "admin",
        region: "전체",
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "i@abc.com" && password === "password") {
      const userData = {
        id: "user_005",
        name: "한지민",
        email: "i@abc.com",
        type: "parent",
        region: "서초구",
        selectedRegions: ["서초구", "강남구"],
        birthYear: "1985",
        gender: "female",
        phone: "010-5678-9012",
        address: "서울특별시 서초구 서초동",
        familyInfo: {
          children: [
            {
              id: "child_005",
              name: "한소희",
              age: 8,
              grade: "초등학교 2학년",
              gender: "female",
              interests: ["피아노", "미술", "음악"],
              specialNeeds: "없음",
            },
          ],
        },
        profileCompleted: true,
      };
      setUser(userData);
      return { success: true, user: userData };
    } else if (email === "j@abc.com" && password === "password") {
      const userData = {
        id: "user_006",
        name: "김태현",
        email: "j@abc.com",
        type: "parent",
        region: "송파구",
        selectedRegions: ["송파구", "강남구"],
        birthYear: "1983",
        gender: "male",
        phone: "010-6789-0123",
        address: "서울특별시 송파구 문정동",
        familyInfo: {
          children: [
            {
              id: "child_006",
              name: "김준호",
              age: 11,
              grade: "초등학교 5학년",
              gender: "male",
              interests: ["농구", "축구", "체육"],
              specialNeeds: "없음",
            },
          ],
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

  const signup = (userData) => {
    // 실제 회원가입 로직 (임시)
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      type: userData.userType === "parents" ? "parent" : "teacher",
      region: "관악구", // 기본값
      selectedRegions: ["관악구"],
      birthYear: "1990",
      gender: "female",
      phone: userData.phone || "",
      address: userData.address || "",
      profileCompleted: false, // 프로필 미완성 상태
    };

    setUser(newUser);
    return { success: true, user: newUser };
  };

  const value = {
    user,
    login,
    logout,
    signup,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
