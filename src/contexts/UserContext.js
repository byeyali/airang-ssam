import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

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

  const signup = async (userData) => {
    const response = await axiosInstance.post("/members", userData);
    return response.data;
  };

  const login = async (loginData) => {
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      const { token } = response.data;
      if (!token) return { success: false, message: "토큰 없음" };

      localStorage.setItem("authToken", token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const userResponse = await axiosInstance.get("/auth/me");
      const userData = userResponse.data;
      setUser(userData);
      return { success: true, userData };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "로그인 중 오류 발생",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      axiosInstance
        .get("/members/me")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};
