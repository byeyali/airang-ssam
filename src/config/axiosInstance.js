import axios from "axios";

// 환경에 따른 API URL 설정
const getApiUrl = () => {
  // Azure Static Web Apps 환경에서는 환경 변수를 통해 설정
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }

  // 개발 환경 - 로컬 백엔드 우선 시도, 실패시 Azure 사용
  if (process.env.NODE_ENV === "development") {
    // 로컬 백엔드가 실행 중인지 확인
    const checkLocalBackend = async () => {
      try {
        const response = await fetch("http://localhost:8080/health", {
          method: "GET",
          timeout: 2000,
        });
        if (response.ok) {
          return "http://localhost:8080";
        }
      } catch (error) {
        console.log("로컬 백엔드 서버가 실행되지 않아 Azure API를 사용합니다.");
      }
      console.log("API 사용");
      return "https://airang-apin.azurewebsites.net";
    };

    // 기본적으로 Azure API 사용 (로컬 백엔드가 실행 중이면 자동으로 감지됨)
    return "https://airang-apin.azurewebsites.net";
  }

  // 프로덕션 기본값
  return "https://airang-apin.azurewebsites.net";
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  timeout: 10000, // 10초 타임아웃 설정
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 로그아웃 처리
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
