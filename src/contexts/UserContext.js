import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { userAPI } from "../services/api";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // 현재 사용자 정보 가져오기 (백엔드 연동 시)
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userAPI.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드 연동 시 (현재는 주석 처리)
      // const response = await userAPI.login(email, password);
      // setUser(response.user);
      // return { success: true, user: response.user };

      // 현재는 하드코딩된 로그인 로직 사용
      console.log("로그인 시도:", email, password);

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
      } else if (email === "user002@abc.com" && password === "password") {
        const userData = {
          id: "user_002",
          name: "박영희",
          email: "user002@abc.com",
          type: "parent",
          region: "강남구",
          selectedRegions: ["강남구", "서초구"],
          birthYear: "1988",
          gender: "female",
          phone: "010-2345-6789",
          address: "서울특별시 강남구 역삼동",
          familyInfo: {
            children: [
              {
                id: "child_002",
                name: "박지영",
                age: 9,
                grade: "초등학교 3학년",
                gender: "female",
                interests: ["영어", "체육", "독서"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user003@abc.com" && password === "password") {
        const userData = {
          id: "user_003",
          name: "이민수",
          email: "user003@abc.com",
          type: "parent",
          region: "마포구",
          selectedRegions: ["마포구", "서대문구"],
          birthYear: "1983",
          gender: "male",
          phone: "010-3456-7890",
          address: "서울특별시 마포구 합정동",
          familyInfo: {
            children: [
              {
                id: "child_003",
                name: "이준호",
                age: 10,
                grade: "초등학교 4학년",
                gender: "male",
                interests: ["음악", "미술", "창작활동"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user004@abc.com" && password === "password") {
        const userData = {
          id: "user_004",
          name: "최지영",
          email: "user004@abc.com",
          type: "parent",
          region: "성동구",
          selectedRegions: ["성동구", "광진구"],
          birthYear: "1987",
          gender: "female",
          phone: "010-4567-8901",
          address: "서울특별시 성동구 성수동",
          familyInfo: {
            children: [
              {
                id: "child_004",
                name: "최민수",
                age: 8,
                grade: "초등학교 2학년",
                gender: "female",
                interests: ["체육활동", "건강관리", "놀이활동"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user005@abc.com" && password === "password") {
        const userData = {
          id: "user_005",
          name: "한미영",
          email: "user005@abc.com",
          type: "parent",
          region: "도봉구",
          selectedRegions: ["도봉구", "강북구"],
          birthYear: "1986",
          gender: "female",
          phone: "010-5678-9012",
          address: "서울특별시 도봉구 도봉동",
          familyInfo: {
            children: [
              {
                id: "child_005",
                name: "한지영",
                age: 6,
                grade: "유치원",
                gender: "male",
                interests: ["기초학습", "생활습관", "놀이활동"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user006@abc.com" && password === "password") {
        const userData = {
          id: "user_006",
          name: "정성훈",
          email: "user006@abc.com",
          type: "parent",
          region: "양천구",
          selectedRegions: ["양천구", "강서구"],
          birthYear: "1984",
          gender: "male",
          phone: "010-6789-0123",
          address: "서울특별시 양천구 신월동",
          familyInfo: {
            children: [
              {
                id: "child_006",
                name: "정민수",
                age: 11,
                grade: "초등학교 5학년",
                gender: "male",
                interests: ["수학", "과학", "학습지도"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user007@abc.com" && password === "password") {
        const userData = {
          id: "user_007",
          name: "김태현",
          email: "user007@abc.com",
          type: "parent",
          region: "관악구",
          selectedRegions: ["관악구", "동작구"],
          birthYear: "1989",
          gender: "male",
          phone: "010-7890-1234",
          address: "서울특별시 관악구 봉천동",
          familyInfo: {
            children: [
              {
                id: "child_007",
                name: "김지영",
                age: 9,
                grade: "초등학교 3학년",
                gender: "female",
                interests: ["영어", "수학", "학습지도"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user008@abc.com" && password === "password") {
        const userData = {
          id: "user_008",
          name: "박성훈",
          email: "user008@abc.com",
          type: "parent",
          region: "강남구",
          selectedRegions: ["강남구", "서초구"],
          birthYear: "1982",
          gender: "male",
          phone: "010-8901-2345",
          address: "서울특별시 강남구 삼성동",
          familyInfo: {
            children: [
              {
                id: "child_008",
                name: "박준호",
                age: 10,
                grade: "초등학교 4학년",
                gender: "male",
                interests: ["과학", "영어", "학습지도"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user009@abc.com" && password === "password") {
        const userData = {
          id: "user_009",
          name: "이지영",
          email: "user009@abc.com",
          type: "parent",
          region: "마포구",
          selectedRegions: ["마포구", "서대문구"],
          birthYear: "1985",
          gender: "female",
          phone: "010-9012-3456",
          address: "서울특별시 마포구 상암동",
          familyInfo: {
            children: [
              {
                id: "child_009",
                name: "이미영",
                age: 8,
                grade: "초등학교 2학년",
                gender: "female",
                interests: ["요리", "창작활동", "놀이활동"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user010@abc.com" && password === "password") {
        const userData = {
          id: "user_010",
          name: "김미영",
          email: "user010@abc.com",
          type: "parent",
          region: "성동구",
          selectedRegions: ["성동구", "광진구"],
          birthYear: "1987",
          gender: "female",
          phone: "010-0123-4567",
          address: "서울특별시 성동구 왕십리동",
          familyInfo: {
            children: [
              {
                id: "child_010",
                name: "김성훈",
                age: 9,
                grade: "초등학교 3학년",
                gender: "male",
                interests: ["축구", "농구", "스포츠활동"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user011@abc.com" && password === "password") {
        const userData = {
          id: "user_011",
          name: "최민수",
          email: "user011@abc.com",
          type: "parent",
          region: "도봉구",
          selectedRegions: ["도봉구", "강북구"],
          birthYear: "1986",
          gender: "male",
          phone: "010-1234-5678",
          address: "서울특별시 도봉구 방학동",
          familyInfo: {
            children: [
              {
                id: "child_011",
                name: "최지영",
                age: 6,
                grade: "유치원",
                gender: "female",
                interests: ["독서", "한글", "학습지도"],
                specialNeeds: "없음",
              },
            ],
          },
          profileCompleted: true,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "user012@abc.com" && password === "password") {
        const userData = {
          id: "user_012",
          name: "한지영",
          email: "user012@abc.com",
          type: "parent",
          region: "양천구",
          selectedRegions: ["양천구", "강서구"],
          birthYear: "1988",
          gender: "female",
          phone: "010-2345-6789",
          address: "서울특별시 양천구 목동",
          familyInfo: {
            children: [
              {
                id: "child_012",
                name: "한준호",
                age: 10,
                grade: "초등학교 4학년",
                gender: "male",
                interests: ["수학", "과학", "학습지도"],
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
          name: "김영희",
          email: "b@abc.com",
          type: "tutor",
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
      } else if (email === "teacher2@abc.com" && password === "password") {
        const userData = {
          id: "teacher_002",
          name: "박민수",
          email: "teacher2@abc.com",
          type: "tutor",
          regions: ["강남구", "서초구"],
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
          id: "teacher_003",
          name: "김지영",
          email: "f@abc.com",
          type: "tutor",
          regions: ["관악구", "동작구"],
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
        };
        setUser(userData);
        return { success: true, user: userData };
      } else if (email === "g@abc.com" && password === "password") {
        const userData = {
          id: "teacher_002",
          name: "박민수",
          email: "g@abc.com",
          type: "tutor",
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
          type: "tutor",
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
      } else if (email === "k@abc.com" && password === "password") {
        const userData = {
          id: "user_010",
          name: "김미영",
          email: "k@abc.com",
          type: "parent",
          region: "관악구",
          selectedRegions: ["관악구", "동작구"],
          birthYear: "1987",
          gender: "female",
          phone: "010-7890-1234",
          address: "서울특별시 관악구 봉천동",
          familyInfo: {
            children: [
              {
                id: "child_010",
                name: "김민준",
                age: 7,
                grade: "초등학교 1학년",
                gender: "male",
                interests: ["과학 실험", "보드게임", "창의적 놀이"],
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
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
      return {
        success: false,
        message: error.message || "로그인에 실패했습니다.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // 백엔드 연동 시
      await userAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드 연동 시
      const response = await userAPI.register(userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message);
      return {
        success: false,
        message: error.message || "회원가입에 실패했습니다.",
      };
    } finally {
      setLoading(false);
    }
  };

  // 프로필 업데이트
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드 연동 시
      const updatedUser = await userAPI.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Profile update failed:", error);
      setError(error.message);
      return {
        success: false,
        message: error.message || "프로필 업데이트에 실패했습니다.",
      };
    } finally {
      setLoading(false);
    }
  };

  // 앱 시작 시 현재 사용자 정보 확인
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, user]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        signup,
        updateProfile,
        fetchCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
