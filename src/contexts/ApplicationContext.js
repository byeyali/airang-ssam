import React, { createContext, useContext, useState } from "react";
import { isRegionMatch } from "../config/api";

const ApplicationContext = createContext();

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplication must be used within an ApplicationProvider"
    );
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([
    {
      id: "app_001",
      parentId: "user_001", // 김가정 부모님
      title: "피아노, 미술지도 아이쌤 찾습니다",
      target: "초등학교 2학년, 8세, 남아",
      purpose: "피아노, 미술, 영어, 숙제",
      type: "정기 매주 월,수,금 (주3회)",
      period: "2025년 8월 1일 ~ 12월 30일 (약 5개월)",
      workingHours: "오후 2시~7시",
      familyDetails: "엄마, 아빠 / 엄마는 회사 근무, 아빠는 자영업",
      parentMessage:
        "우리 아이는 피아노에 관심이 많고 미술도 좋아해요. 체계적으로 지도해주실 수 있는 분을 찾고 있습니다. 영어와 숙제도 함께 도와주시면 좋겠어요.",
      payment: "시간 당 15,000 (협의가능)",
      region: {
        id: "11680",
        title: "관악구",
        address: "서울특별시 관악구",
      },
      startDate: "2025-08-01",
      endDate: "2025-12-30",
      status: "active",
      createdAt: "2025-01-27",
    },
    {
      id: "app_002", // 계약 진행중 시나리오 - 박민수 쌤과 매칭
      parentId: "user_001", // 김가정 부모님
      title: "영어 학습, 체육 활동 아이쌤 찾습니다",
      target: "초등학교 3학년, 9세, 여아",
      purpose: "영어 학습, 체육 활동, 숙제지도",
      type: "정기 매주 화,목,토 (주3회)",
      period: "2025년 8월 1일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠 / 둘 다 회사 근무",
      parentMessage:
        "영어 학습을 체계적으로 해주시고, 체육 활동도 함께 해주세요. 숙제도 도와주시면 좋겠어요.",
      payment: "시간 당 20,000 (협의가능)",
      region: {
        id: "11620",
        title: "강남구",
        address: "서울특별시 강남구",
      },
      startDate: "2024-08-01",
      endDate: "2024-12-31",
      status: "active",
      createdAt: "2024-01-25",
    },
    {
      id: "app_003", // 계약 완료 시나리오 - 박민수 쌤과 매칭 (1년 계약)
      parentId: "user_002", // 박영희 부모님
      title: "따뜻한 돌봄, 학습지도 아이쌤 찾습니다",
      target: "초등학교 1학년, 7세, 여아",
      purpose: "돌봄, 학습지도, 놀이활동",
      type: "정기 매주 월,수,금 (주3회)",
      period: "2024년 1월 15일 ~ 12월 31일 (약 12개월)",
      workingHours: "오후 2시~5시",
      familyDetails: "엄마, 아빠 / 엄마는 파트타임, 아빠는 회사 근무",
      parentMessage:
        "따뜻한 마음으로 아이를 돌봐주실 분을 찾고 있습니다. 학습지도도 함께 해주시고, 놀이활동도 해주세요.",
      payment: "시간 당 18,000 (협의가능)",
      region: {
        id: "11590",
        title: "서초구",
        address: "서울특별시 서초구",
      },
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: "app_004",
      parentId: "user_003",
      title: "숙제지도, 야외운동 아이쌤 찾습니다",
      target: "초등학교 3학년, 9세, 남아",
      purpose: "숙제지도, 야외운동",
      type: "정기 매주 화,목 (주2회)",
      period: "2025년 7월 21일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠 / 엄마는 파트타임, 아빠는 회사 근무",
      parentMessage:
        "활발한 아이입니다. 숙제를 도와주시고, 날씨 좋을 때는 공원에서 운동도 함께 해주세요.",
      payment: "시간 당 11,000 (협의가능)",
      region: {
        id: "11620",
        title: "강남구",
        address: "서울특별시 강남구",
      },
      startDate: "2025-07-21",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-01-26",
    },
    {
      id: "app_005",
      parentId: "user_002", // 박영희 부모님
      title: "과학 실험, 보드게임 아이쌤 찾습니다",
      target: "초등학교 3학년, 9세, 여아",
      purpose: "과학 실험, 보드게임, 독서",
      type: "정기 매주 화,목 (주2회)",
      period: "2025년 8월 1일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠 / 둘 다 회사 근무",
      parentMessage:
        "우리 아이는 과학 실험을 좋아하고 보드게임도 즐겨합니다. 창의력과 사고력을 키워주실 수 있는 분을 찾고 있습니다.",
      payment: "시간 당 14,000 (협의가능)",
      region: {
        id: "11680",
        title: "관악구",
        address: "서울특별시 관악구",
      },
      startDate: "2025-08-01",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-01-28",
    },
    {
      id: "app_006",
      parentId: "user_003", // 최민수 부모님
      title: "영어, 수학 지도 아이쌤 찾습니다",
      target: "초등학교 1학년, 7세, 여아",
      purpose: "영어, 수학, 미술",
      type: "정기 매주 월,수,금 (주3회)",
      period: "2025년 7월 15일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 2시~5시",
      familyDetails: "엄마, 아빠 / 엄마는 파트타임, 아빠는 회사 근무",
      parentMessage:
        "영어와 수학 기초를 탄탄히 다져주실 수 있는 분을 찾고 있습니다. 미술도 함께 해주시면 좋겠어요.",
      payment: "시간 당 18,000 (협의가능)",
      region: {
        id: "11620",
        title: "강남구",
        address: "서울특별시 강남구",
      },
      startDate: "2025-07-15",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-01-29",
    },
    {
      id: "app_007",
      parentId: "user_004", // 정지영 부모님
      title: "체육 활동, 농구 지도 아이쌤 찾습니다",
      target: "초등학교 4학년, 10세, 남아",
      purpose: "체육 활동, 농구, 독서",
      type: "정기 매주 화,목,토 (주3회)",
      period: "2025년 7월 20일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠 / 엄마는 회사 근무, 아빠는 자영업",
      parentMessage:
        "활발한 아이입니다. 농구를 좋아하니 체육 활동을 함께 해주시고, 독서도 도와주세요.",
      payment: "시간 당 16,000 (협의가능)",
      region: {
        id: "11440",
        title: "마포구",
        address: "서울특별시 마포구",
      },
      startDate: "2025-07-20",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-01-30",
    },
    {
      id: "app_008",
      parentId: "user_005", // 한지민 부모님
      title: "음악, 미술 지도 아이쌤 찾습니다",
      target: "초등학교 2학년, 8세, 여아",
      purpose: "피아노, 미술, 음악",
      type: "정기 매주 월,수,금 (주3회)",
      period: "2025년 8월 1일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠 / 둘 다 회사 근무",
      parentMessage:
        "피아노와 미술을 좋아하는 아이입니다. 체계적으로 지도해주실 수 있는 분을 찾고 있습니다.",
      payment: "시간 당 13,000 (협의가능)",
      region: {
        id: "11610",
        title: "서초구",
        address: "서울특별시 서초구",
      },
      startDate: "2025-08-01",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-01-31",
    },
    {
      id: "app_009",
      parentId: "user_006", // 김태현 부모님
      title: "체육 활동, 농구 지도 아이쌤 찾습니다",
      target: "초등학교 5학년, 11세, 남아",
      purpose: "농구, 축구, 체육",
      type: "정기 매주 화,목,토 (주3회)",
      period: "2025년 7월 15일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 4시~7시",
      familyDetails: "엄마, 아빠 / 엄마는 파트타임, 아빠는 회사 근무",
      parentMessage:
        "활발한 아이입니다. 농구와 축구를 좋아하니 체육 활동을 함께 해주세요.",
      payment: "시간 당 17,000 (협의가능)",
      region: {
        id: "11710",
        title: "송파구",
        address: "서울특별시 송파구",
      },
      startDate: "2025-07-15",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-02-01",
    },
    {
      id: "app_007", // 최지영 부모님의 공고 (matching_005와 연결)
      parentId: "user_004", // 최지영
      title: "체육 활동, 운동 지도 아이쌤 찾습니다",
      target: "초등학교 4학년, 10세, 남아",
      purpose: "체육 활동, 운동 지도, 건강 관리",
      type: "정기 매주 화,목,토 (주3회)",
      period: "2024년 8월 1일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠 / 둘 다 회사 근무",
      parentMessage:
        "활발한 아이입니다. 체육 활동을 좋아하니 운동을 함께 해주세요. 건강한 몸을 만드는 데 도움이 되면 좋겠어요.",
      payment: "시간 당 25,000 (협의가능)",
      region: {
        id: "11680",
        title: "관악구",
        address: "서울특별시 관악구",
      },
      startDate: "2024-08-01",
      endDate: "2024-12-31",
      status: "active",
      createdAt: "2024-01-27",
    },
    {
      id: "app_010",
      parentId: "user_004",
      title: "방과후 돌봄, 숙제지도 아이쌤 찾습니다",
      target: "초등학교 4학년, 10세, 남아",
      purpose: "방과후 돌봄, 숙제지도, 특기활동",
      type: "정기 매주 월~금 (주5회)",
      period: "2025년 7월 15일 ~ 12월 31일 (약 5개월)",
      workingHours: "오후 3시~6시",
      familyDetails: "엄마, 아빠, 할머니 / 엄마는 회사 근무, 아빠는 자영업",
      parentMessage:
        "방과후에 집에 혼자 있는 시간이 많아서 걱정입니다. 숙제를 도와주시고, 가끔은 특기활동도 함께 해주세요. 피아노나 미술 중에 관심 있는 것 있으면 좋겠어요.",
      payment: "시간 당 12,000 (협의가능)",
      region: {
        id: "11680",
        title: "관악구",
        address: "서울특별시 관악구",
      },
      startDate: "2025-07-15",
      endDate: "2025-12-31",
      status: "active",
      createdAt: "2025-01-28",
    },
    // 김미영 부모님의 공고 (matching_011과 연결)
    {
      id: "app_010",
      parentId: "user_010", // 김미영
      title: "과학 실험, 창의적 놀이 아이쌤 찾습니다",
      target: "초등학교 1학년, 7세, 남아",
      purpose: "과학 실험, 창의적 놀이, 보드게임",
      type: "정기 매주 화,목,토 (주3회)",
      period: "2024년 4월 15일 ~ 9월 30일 (약 5개월)",
      workingHours: "오후 2시~5시",
      familyDetails: "엄마, 아빠 / 엄마는 회사 근무, 아빠는 자영업",
      parentMessage:
        "과학 실험을 좋아하는 아이입니다. 안전한 실험을 함께 해주시고, 창의적인 놀이와 보드게임도 가르쳐주세요.",
      payment: "시간 당 17,000 (협의가능)",
      region: {
        id: "11680",
        title: "관악구",
        address: "서울특별시 관악구",
      },
      startDate: "2024-04-15",
      endDate: "2024-09-30",
      status: "active",
      createdAt: "2024-04-10",
    },
  ]);

  // 공고 추가
  const addApplication = (newApplication) => {
    const application = {
      ...newApplication,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setApplications((prev) => [application, ...prev]);
    return application;
  };

  // 공고 수정
  const updateApplication = (applicationId, updatedData) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              ...updatedData,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : app
      )
    );
  };

  // 공고 삭제
  const deleteApplication = (applicationId) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
  };

  // 모든 공고 조회
  const getAllApplications = () => {
    return applications;
  };

  // 내 공고 조회 (부모용)
  const getMyApplications = (userId) => {
    return applications.filter((app) => app.parentId === userId);
  };

  // 매칭 가능한 공고 조회 (쌤용)
  const getMatchingApplications = (teacherRegions) => {
    return applications.filter(
      (app) =>
        app.status === "active" && isRegionMatch(app.region, teacherRegions)
    );
  };

  // 특정 공고 조회
  const getApplicationById = (applicationId) => {
    return applications.find((app) => app.id === applicationId);
  };

  // 공고 상태 변경
  const updateApplicationStatus = (applicationId, status) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : app
      )
    );
  };

  const value = {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    getAllApplications,
    getMyApplications,
    getMatchingApplications,
    getApplicationById,
    updateApplicationStatus,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
