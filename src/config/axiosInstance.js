import axios from "axios";

// 환경에 따른 API URL 설정
const getApiUrl = () => {
  // Azure Static Web Apps 환경에서는 환경 변수를 통해 설정
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }

  // 개발 환경에서 로컬 서버 연결 테스트
  if (process.env.NODE_ENV === "development") {
    // 로컬 서버가 실행 중인지 확인하고, 없으면 Azure API 사용
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

    // 개발 환경에서 API URL 로깅
    if (process.env.NODE_ENV === "development") {
      console.log("API 요청:", config.method?.toUpperCase(), config.url);
      console.log("Base URL:", config.baseURL);
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
    // 개발 환경에서 상세한 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("API 요청 실패:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    // 401 에러 시 로그아웃 처리
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
