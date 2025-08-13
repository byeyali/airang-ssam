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

      // 백엔드 API 호출
      console.log("로그인 시도:", email, password);

      // TODO: 백엔드 API 호출
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setUser(data.user);
      //   return { success: true, user: data.user };
      // }

      return { success: false, message: "로그인에 실패했습니다." };
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
