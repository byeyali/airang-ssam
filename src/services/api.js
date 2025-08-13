// API 서비스 레이어
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://airang-apin.azurewebsites.net";

// 공통 API 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// 인증 토큰 관리
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

// 인증된 API 요청
const authenticatedRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// 사용자 관련 API
export const userAPI = {
  // 로그인
  login: async (email, password) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // 로그아웃
  logout: async () => {
    await authenticatedRequest("/auth/logout", { method: "POST" });
    setAuthToken(null);
  },

  // 사용자 정보 조회
  getCurrentUser: async () => {
    return await authenticatedRequest("/auth/me");
  },

  // 사용자 정보 업데이트
  updateProfile: async (userData) => {
    return await authenticatedRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // 회원가입
  register: async (userData) => {
    return await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
};

// 선생님 관련 API
export const teacherAPI = {
  // 모든 선생님 조회
  getAllTeachers: async () => {
    return await apiRequest("/teachers");
  },

  // 선생님 수당 데이터 조회
  getTeacherPaymentData: async (teacherId, startDate, endDate) => {
    return await authenticatedRequest(
      `/teachers/${teacherId}/payments?startDate=${startDate}&endDate=${endDate}`
    );
  },

  // 선생님 월별 수당 통계
  getTeacherMonthlyStats: async (teacherId, year, month) => {
    return await authenticatedRequest(
      `/teachers/${teacherId}/payments/monthly?year=${year}&month=${month}`
    );
  },

  // 선생님 수업 완료 데이터
  getTeacherCompletedLessons: async (teacherId, startDate, endDate) => {
    return await authenticatedRequest(
      `/teachers/${teacherId}/lessons/completed?startDate=${startDate}&endDate=${endDate}`
    );
  },

  // 선생님 수당 상세 내역
  getTeacherPaymentDetails: async (teacherId, paymentId) => {
    return await authenticatedRequest(
      `/teachers/${teacherId}/payments/${paymentId}`
    );
  },

  // 선생님 상세 정보 조회
  getTeacherById: async (id) => {
    return await apiRequest(`/teachers/${id}`);
  },

  // 지역별 선생님 조회
  getTeachersByRegion: async (regions) => {
    const params = new URLSearchParams({ regions: regions.join(",") });
    return await apiRequest(`/teachers?${params}`);
  },

  // 선생님 프로필 업데이트
  updateTeacherProfile: async (teacherId, profileData) => {
    return await authenticatedRequest(`/teachers/${teacherId}/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  // 선생님 파일 업로드
  uploadTeacherFile: async (teacherId, fileType, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);

    return await authenticatedRequest(`/teachers/${teacherId}/files`, {
      method: "POST",
      headers: {}, // Content-Type은 브라우저가 자동으로 설정
      body: formData,
    });
  },
};

// 매칭 관련 API
export const matchingAPI = {
  // 모든 매칭 조회
  getAllMatchings: async () => {
    return await authenticatedRequest("/matchings");
  },

  // 선생님별 매칭 조회
  getMatchingsByTeacher: async (teacherId) => {
    return await authenticatedRequest(`/matchings/teacher/${teacherId}`);
  },

  // 부모별 매칭 조회
  getMatchingsByParent: async (parentId) => {
    return await authenticatedRequest(`/matchings/parent/${parentId}`);
  },

  // 매칭 요청 생성
  createMatchingRequest: async (requestData) => {
    return await authenticatedRequest("/matchings", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  // 매칭 요청 수락/거절
  updateMatchingStatus: async (matchingId, status) => {
    return await authenticatedRequest(`/matchings/${matchingId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  // 계약 상태 업데이트
  updateContractStatus: async (matchingId, contractStatus) => {
    return await authenticatedRequest(`/matchings/${matchingId}/contract`, {
      method: "PUT",
      body: JSON.stringify({ contractStatus }),
    });
  },
};

// 공고 관련 API
export const applicationAPI = {
  // 모든 공고 조회
  getAllApplications: async () => {
    return await apiRequest("/applications");
  },

  // 사용자별 공고 조회
  getApplicationsByUser: async (userId) => {
    return await authenticatedRequest(`/applications/user/${userId}`);
  },

  // 공고 생성
  createApplication: async (applicationData) => {
    return await authenticatedRequest("/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  },

  // 공고 수정
  updateApplication: async (applicationId, applicationData) => {
    return await authenticatedRequest(`/applications/${applicationId}`, {
      method: "PUT",
      body: JSON.stringify(applicationData),
    });
  },

  // 공고 삭제
  deleteApplication: async (applicationId) => {
    return await authenticatedRequest(`/applications/${applicationId}`, {
      method: "DELETE",
    });
  },
};

// 결제/수당 관련 API
export const paymentAPI = {
  // 선생님 수당 조회
  getTeacherPayments: async (teacherId) => {
    return await authenticatedRequest(`/payments/teacher/${teacherId}`);
  },

  // 부모 입금 현황 조회
  getParentPayments: async () => {
    return await authenticatedRequest("/payments/parents");
  },

  // 월별 수입 통계
  getMonthlyRevenue: async (teacherId, year, month) => {
    return await authenticatedRequest(
      `/payments/teacher/${teacherId}/monthly?year=${year}&month=${month}`
    );
  },

  // 수당 상세 내역
  getPaymentDetails: async (paymentId) => {
    return await authenticatedRequest(`/payments/${paymentId}`);
  },
};

// 리뷰 관련 API
export const reviewAPI = {
  // 리뷰 조회
  getReviews: async (teacherId) => {
    return await apiRequest(`/reviews/teacher/${teacherId}`);
  },

  // 리뷰 작성
  createReview: async (reviewData) => {
    return await authenticatedRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  // 리뷰 수정
  updateReview: async (reviewId, reviewData) => {
    return await authenticatedRequest(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  // 리뷰 삭제
  deleteReview: async (reviewId) => {
    return await authenticatedRequest(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};

// 알림 관련 API
export const notificationAPI = {
  // 사용자 알림 조회
  getUserNotifications: async (userId) => {
    return await authenticatedRequest(`/notifications/user/${userId}`);
  },

  // 읽지 않은 알림 개수
  getUnreadCount: async (userId) => {
    return await authenticatedRequest(`/notifications/user/${userId}/unread`);
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    return await authenticatedRequest(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (userId) => {
    return await authenticatedRequest(
      `/notifications/user/${userId}/read-all`,
      {
        method: "PUT",
      }
    );
  },
};

export default {
  userAPI,
  teacherAPI,
  matchingAPI,
  applicationAPI,
  paymentAPI,
  reviewAPI,
  notificationAPI,
};
