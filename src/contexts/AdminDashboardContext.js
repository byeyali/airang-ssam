import React, { createContext, useContext, useState, useEffect } from "react";

const AdminDashboardContext = createContext();

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error(
      "useAdminDashboard must be used within AdminDashboardProvider"
    );
  }
  return context;
};

export const AdminDashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    // 📊 전체 통계
    overview: {
      totalMatchings: 0,
      pendingMatchings: 0,
      acceptedMatchings: 0,
      rejectedMatchings: 0,
      totalApplications: 0,
      totalTeachers: 0,
    },

    // 💰 수입 통계
    revenue: {
      totalParentPayment: 0,
      totalTeacherEarnings: 0,
      totalCompanyRevenue: 0,
      averageHourlyWage: 0,
    },

    // 📋 계약 현황
    contracts: {
      progress: 0,
      completed: 0,
      progressEarnings: 0,
      completedEarnings: 0,
    },

    // 👥 매칭 상세 정보
    matchings: [],

    // 💳 결제 현황
    payments: [],

    // 💸 급여 현황
    salaries: [],
  });

  const [mockData, setMockData] = useState({
    // 모의 부모 데이터
    parents: [
      {
        id: "parent_001",
        name: "김영희",
        phone: "010-1234-5678",
        email: "kim@email.com",
        joinDate: "2024-01-01",
        status: "active",
      },
      {
        id: "parent_002",
        name: "박민수",
        phone: "010-2345-6789",
        email: "park@email.com",
        joinDate: "2024-01-05",
        status: "active",
      },
      {
        id: "parent_003",
        name: "이지영",
        phone: "010-3456-7890",
        email: "lee@email.com",
        joinDate: "2024-01-10",
        status: "active",
      },
      {
        id: "parent_004",
        name: "최미영",
        phone: "010-4567-8901",
        email: "choi@email.com",
        joinDate: "2024-01-12",
        status: "active",
      },
      {
        id: "parent_005",
        name: "정성훈",
        phone: "010-5678-9012",
        email: "jung@email.com",
        joinDate: "2024-01-15",
        status: "active",
      },
      {
        id: "parent_006",
        name: "김태현",
        phone: "010-6789-0123",
        email: "kim2@email.com",
        joinDate: "2024-01-18",
        status: "active",
      },
      {
        id: "parent_007",
        name: "박지영",
        phone: "010-7890-1234",
        email: "park2@email.com",
        joinDate: "2024-01-20",
        status: "active",
      },
      {
        id: "parent_008",
        name: "이민수",
        phone: "010-8901-2345",
        email: "lee2@email.com",
        joinDate: "2024-01-22",
        status: "active",
      },
    ],

    // 모의 공고 데이터
    applications: [
      {
        id: "app_001",
        parentId: "parent_001",
        title: "초등학생 수학 과외",
        subject: "수학",
        grade: "초등3학년",
        location: "서울 강남구",
        hourlyWage: 15000,
        status: "active",
        createdAt: "2024-01-15",
      },
      {
        id: "app_002",
        parentId: "parent_002",
        title: "중학생 영어 과외",
        subject: "영어",
        grade: "중등1학년",
        location: "서울 서초구",
        hourlyWage: 17000,
        status: "active",
        createdAt: "2024-01-16",
      },
      {
        id: "app_003",
        parentId: "parent_003",
        title: "고등학생 국어 과외",
        subject: "국어",
        grade: "고등2학년",
        location: "서울 마포구",
        hourlyWage: 16000,
        status: "active",
        createdAt: "2024-01-17",
      },
      {
        id: "app_004",
        parentId: "parent_004",
        title: "초등학생 과학 과외",
        subject: "과학",
        grade: "초등4학년",
        location: "서울 송파구",
        hourlyWage: 18000,
        status: "active",
        createdAt: "2024-01-18",
      },
      {
        id: "app_005",
        parentId: "parent_005",
        title: "중학생 수학 과외",
        subject: "수학",
        grade: "중등2학년",
        location: "서울 영등포구",
        hourlyWage: 20000,
        status: "active",
        createdAt: "2024-01-19",
      },
      {
        id: "app_006",
        parentId: "parent_006",
        title: "고등학생 영어 과외",
        subject: "영어",
        grade: "고등1학년",
        location: "서울 광진구",
        hourlyWage: 19000,
        status: "active",
        createdAt: "2024-01-20",
      },
      {
        id: "app_007",
        parentId: "parent_007",
        title: "초등학생 사회 과외",
        subject: "사회",
        grade: "초등5학년",
        location: "서울 성동구",
        hourlyWage: 14000,
        status: "active",
        createdAt: "2024-01-21",
      },
      {
        id: "app_008",
        parentId: "parent_008",
        title: "중학생 과학 과외",
        subject: "과학",
        grade: "중등3학년",
        location: "서울 용산구",
        hourlyWage: 16000,
        status: "active",
        createdAt: "2024-01-22",
      },
      {
        id: "app_009",
        parentId: "parent_001",
        title: "고등학생 수학 과외",
        subject: "수학",
        grade: "고등3학년",
        location: "서울 강남구",
        hourlyWage: 22000,
        status: "active",
        createdAt: "2024-01-23",
      },
      {
        id: "app_010",
        parentId: "parent_002",
        title: "초등학생 영어 과외",
        subject: "영어",
        grade: "초등6학년",
        location: "서울 서초구",
        hourlyWage: 15000,
        status: "active",
        createdAt: "2024-01-24",
      },
      {
        id: "app_011",
        parentId: "parent_003",
        title: "중학생 국어 과외",
        subject: "국어",
        grade: "중등1학년",
        location: "서울 마포구",
        hourlyWage: 16000,
        status: "active",
        createdAt: "2024-01-25",
      },
      {
        id: "app_012",
        parentId: "parent_004",
        title: "고등학생 과학 과외",
        subject: "과학",
        grade: "고등1학년",
        location: "서울 송파구",
        hourlyWage: 18000,
        status: "active",
        createdAt: "2024-01-26",
      },
    ],

    // 모의 쌤 데이터
    teachers: [
      {
        id: "teacher_001",
        name: "김수진",
        phone: "010-1111-1111",
        email: "teacher1@email.com",
        subject: "수학",
        experience: 5,
        hourlyWage: 15000,
        status: "active",
        joinDate: "2024-01-01",
        rating: 4.8,
      },
      {
        id: "teacher_002",
        name: "박영수",
        phone: "010-2222-2222",
        email: "teacher2@email.com",
        subject: "영어",
        experience: 3,
        hourlyWage: 17000,
        status: "active",
        joinDate: "2024-01-05",
        rating: 4.6,
      },
      {
        id: "teacher_003",
        name: "김지영",
        phone: "010-3333-3333",
        email: "teacher3@email.com",
        subject: "국어",
        experience: 7,
        hourlyWage: 16000,
        status: "active",
        joinDate: "2024-01-10",
        rating: 4.9,
      },
      {
        id: "teacher_004",
        name: "최지영",
        phone: "010-4444-4444",
        email: "teacher4@email.com",
        subject: "과학",
        experience: 4,
        hourlyWage: 18000,
        status: "active",
        joinDate: "2024-01-12",
        rating: 4.7,
      },
      {
        id: "teacher_005",
        name: "한미영",
        phone: "010-5555-5555",
        email: "teacher5@email.com",
        subject: "수학",
        experience: 6,
        hourlyWage: 20000,
        status: "active",
        joinDate: "2024-01-15",
        rating: 4.8,
      },
      {
        id: "teacher_006",
        name: "정성훈",
        phone: "010-6666-6666",
        email: "teacher6@email.com",
        subject: "영어",
        experience: 2,
        hourlyWage: 19000,
        status: "active",
        joinDate: "2024-01-18",
        rating: 4.5,
      },
      {
        id: "teacher_007",
        name: "김태현",
        phone: "010-7777-7777",
        email: "teacher7@email.com",
        subject: "사회",
        experience: 4,
        hourlyWage: 14000,
        status: "active",
        joinDate: "2024-01-20",
        rating: 4.6,
      },
      {
        id: "teacher_008",
        name: "박지영",
        phone: "010-8888-8888",
        email: "teacher8@email.com",
        subject: "과학",
        experience: 5,
        hourlyWage: 16000,
        status: "active",
        joinDate: "2024-01-22",
        rating: 4.7,
      },
      {
        id: "teacher_009",
        name: "이민수",
        phone: "010-9999-9999",
        email: "teacher9@email.com",
        subject: "수학",
        experience: 8,
        hourlyWage: 22000,
        status: "active",
        joinDate: "2024-01-25",
        rating: 4.9,
      },
      {
        id: "teacher_010",
        name: "최영희",
        phone: "010-0000-0000",
        email: "teacher10@email.com",
        subject: "영어",
        experience: 3,
        hourlyWage: 15000,
        status: "active",
        joinDate: "2024-01-28",
        rating: 4.4,
      },
      {
        id: "teacher_011",
        name: "정지영",
        phone: "010-1111-0000",
        email: "teacher11@email.com",
        subject: "국어",
        experience: 6,
        hourlyWage: 16000,
        status: "active",
        joinDate: "2024-01-30",
        rating: 4.6,
      },
    ],

    // 모의 매칭 데이터
    matchings: [
      {
        id: "matching_001",
        parentId: "parent_001",
        teacherId: "teacher_001",
        applicationId: "app_001",
        parentName: "김영희",
        teacherName: "김수진",
        status: "accepted",
        contractStatus: "completed",
        createdAt: "2024-01-15T10:00:00Z",
        contractDate: "2024-01-20T10:00:00Z",
        hourlyWage: 15000,
        sessionsPerWeek: 3,
        hoursPerSession: 2,
        contractMonths: 3,
        dailyWage: 30000,
        totalSessions: 36,
        totalEarnings: 1080000,
        parentPayment: 1200000,
        companyRevenue: 120000,
        subject: "수학",
        grade: "초등3학년",
      },
      {
        id: "matching_002",
        parentId: "parent_002",
        teacherId: "teacher_002",
        applicationId: "app_002",
        parentName: "박민수",
        teacherName: "박영수",
        status: "accepted",
        contractStatus: "progress",
        createdAt: "2024-01-16T14:30:00Z",
        contractDate: "2024-01-22T14:30:00Z",
        hourlyWage: 17000,
        sessionsPerWeek: 2,
        hoursPerSession: 3,
        contractMonths: 2,
        dailyWage: 51000,
        totalSessions: 16,
        totalEarnings: 816000,
        parentPayment: 900000,
        companyRevenue: 84000,
        subject: "영어",
        grade: "중등1학년",
      },
      {
        id: "matching_003",
        parentId: "parent_003",
        teacherId: "teacher_003",
        applicationId: "app_003",
        parentName: "이지영",
        teacherName: "김지영",
        status: "accepted",
        contractStatus: "completed",
        createdAt: "2024-01-17T09:15:00Z",
        contractDate: "2024-01-25T09:15:00Z",
        hourlyWage: 16000,
        sessionsPerWeek: 4,
        hoursPerSession: 2,
        contractMonths: 4,
        dailyWage: 32000,
        totalSessions: 64,
        totalEarnings: 1024000,
        parentPayment: 1150000,
        companyRevenue: 126000,
        subject: "국어",
        grade: "고등2학년",
      },
      {
        id: "matching_004",
        parentId: "parent_004",
        teacherId: "teacher_004",
        applicationId: "app_004",
        parentName: "최미영",
        teacherName: "최지영",
        status: "accepted",
        contractStatus: "progress",
        createdAt: "2024-01-18T16:45:00Z",
        contractDate: "2024-01-28T16:45:00Z",
        hourlyWage: 18000,
        sessionsPerWeek: 3,
        hoursPerSession: 2,
        contractMonths: 3,
        dailyWage: 36000,
        totalSessions: 36,
        totalEarnings: 1296000,
        parentPayment: 1400000,
        companyRevenue: 104000,
        subject: "과학",
        grade: "초등4학년",
      },
      {
        id: "matching_005",
        parentId: "parent_005",
        teacherId: "teacher_005",
        applicationId: "app_005",
        parentName: "정성훈",
        teacherName: "한미영",
        status: "accepted",
        contractStatus: "completed",
        createdAt: "2024-01-19T11:20:00Z",
        contractDate: "2024-01-30T11:20:00Z",
        hourlyWage: 20000,
        sessionsPerWeek: 2,
        hoursPerSession: 3,
        contractMonths: 2,
        dailyWage: 60000,
        totalSessions: 16,
        totalEarnings: 960000,
        parentPayment: 1050000,
        companyRevenue: 90000,
        subject: "수학",
        grade: "중등2학년",
      },
      {
        id: "matching_006",
        parentId: "parent_006",
        teacherId: "teacher_006",
        applicationId: "app_006",
        parentName: "김태현",
        teacherName: "정성훈",
        status: "pending",
        contractStatus: null,
        createdAt: "2024-01-20T13:10:00Z",
        hourlyWage: 19000,
        sessionsPerWeek: 3,
        hoursPerSession: 2,
        contractMonths: 3,
        dailyWage: 38000,
        totalSessions: 36,
        totalEarnings: 1368000,
        parentPayment: 1500000,
        companyRevenue: 132000,
        subject: "영어",
        grade: "고등1학년",
      },
      {
        id: "matching_007",
        parentId: "parent_007",
        teacherId: "teacher_007",
        applicationId: "app_007",
        parentName: "박지영",
        teacherName: "김태현",
        status: "rejected",
        contractStatus: null,
        createdAt: "2024-01-21T15:30:00Z",
        hourlyWage: 14000,
        sessionsPerWeek: 2,
        hoursPerSession: 2,
        contractMonths: 2,
        dailyWage: 28000,
        totalSessions: 16,
        totalEarnings: 448000,
        parentPayment: 500000,
        companyRevenue: 52000,
        subject: "사회",
        grade: "초등5학년",
      },
    ],

    // 모의 결제 데이터
    payments: [
      {
        id: "payment_001",
        matchingId: "matching_001",
        parentName: "김영희",
        teacherName: "김수진",
        amount: 1200000,
        status: "completed",
        date: "2024-01-20T10:00:00Z",
        type: "monthly",
        method: "카드",
      },
      {
        id: "payment_002",
        matchingId: "matching_002",
        parentName: "박민수",
        teacherName: "박영수",
        amount: 900000,
        status: "pending",
        date: "2024-01-22T14:30:00Z",
        type: "monthly",
        method: "이체",
      },
      {
        id: "payment_003",
        matchingId: "matching_003",
        parentName: "이지영",
        teacherName: "김지영",
        amount: 1150000,
        status: "completed",
        date: "2024-01-25T09:15:00Z",
        type: "monthly",
        method: "카드",
      },
      {
        id: "payment_004",
        matchingId: "matching_004",
        parentName: "최미영",
        teacherName: "최지영",
        amount: 1400000,
        status: "pending",
        date: "2024-01-28T16:45:00Z",
        type: "monthly",
        method: "이체",
      },
      {
        id: "payment_005",
        matchingId: "matching_005",
        parentName: "정성훈",
        teacherName: "한미영",
        amount: 1050000,
        status: "completed",
        date: "2024-01-30T11:20:00Z",
        type: "monthly",
        method: "카드",
      },
    ],

    // 모의 급여 데이터
    salaries: [
      {
        id: "salary_001",
        teacherId: "teacher_001",
        teacherName: "김수진",
        matchingId: "matching_001",
        amount: 1080000,
        status: "paid",
        date: "2024-01-25T10:00:00Z",
        type: "monthly",
        method: "이체",
      },
      {
        id: "salary_002",
        teacherId: "teacher_002",
        teacherName: "박영수",
        matchingId: "matching_002",
        amount: 816000,
        status: "pending",
        date: "2024-01-27T14:30:00Z",
        type: "monthly",
        method: "이체",
      },
      {
        id: "salary_003",
        teacherId: "teacher_003",
        teacherName: "김지영",
        matchingId: "matching_003",
        amount: 1024000,
        status: "paid",
        date: "2024-01-30T09:15:00Z",
        type: "monthly",
        method: "이체",
      },
      {
        id: "salary_004",
        teacherId: "teacher_004",
        teacherName: "최지영",
        matchingId: "matching_004",
        amount: 1296000,
        status: "pending",
        date: "2024-02-02T16:45:00Z",
        type: "monthly",
        method: "이체",
      },
      {
        id: "salary_005",
        teacherId: "teacher_005",
        teacherName: "한미영",
        matchingId: "matching_005",
        amount: 960000,
        status: "paid",
        date: "2024-02-05T11:20:00Z",
        type: "monthly",
        method: "이체",
      },
    ],

    // 모의 리뷰 데이터
    reviews: [
      {
        id: "review_001",
        matchingId: "matching_001",
        parentName: "김영희",
        teacherName: "김수진",
        rating: 5,
        comment: "정말 좋은 쌤이었습니다. 아이가 수학을 재미있어하게 되었어요.",
        date: "2024-01-25T10:00:00Z",
        status: "published",
      },
      {
        id: "review_002",
        matchingId: "matching_003",
        parentName: "이지영",
        teacherName: "김지영",
        rating: 4,
        comment: "체계적으로 가르쳐주셔서 도움이 많이 되었습니다.",
        date: "2024-01-30T09:15:00Z",
        status: "published",
      },
      {
        id: "review_003",
        matchingId: "matching_005",
        parentName: "정성훈",
        teacherName: "한미영",
        rating: 5,
        comment: "아이가 성적이 많이 올랐어요. 감사합니다!",
        date: "2024-02-05T11:20:00Z",
        status: "published",
      },
    ],

    // 모의 문의 데이터
    inquiries: [
      {
        id: "inquiry_001",
        parentName: "김영희",
        email: "kim@email.com",
        subject: "과외 시간 변경 문의",
        message: "과외 시간을 조정하고 싶습니다.",
        status: "answered",
        date: "2024-01-20T10:00:00Z",
      },
      {
        id: "inquiry_002",
        parentName: "박민수",
        email: "park@email.com",
        subject: "새로운 과목 추가 문의",
        message: "영어 외에 수학도 같이 가르쳐주실 수 있나요?",
        status: "pending",
        date: "2024-01-22T14:30:00Z",
      },
      {
        id: "inquiry_003",
        parentName: "이지영",
        email: "lee@email.com",
        subject: "결제 방법 문의",
        message: "카드 결제가 가능한가요?",
        status: "answered",
        date: "2024-01-25T09:15:00Z",
      },
    ],
  });

  // 대시보드 데이터 계산
  const calculateDashboardData = () => {
    const matchings = mockData.matchings;
    const payments = mockData.payments;
    const salaries = mockData.salaries;
    const parents = mockData.parents;
    const applications = mockData.applications;
    const teachers = mockData.teachers;
    const reviews = mockData.reviews;
    const inquiries = mockData.inquiries;

    // 📊 전체 통계
    const overview = {
      totalParents: parents.length,
      totalApplications: applications.length,
      totalTeachers: teachers.length,
      totalAcceptedMatchings: matchings.filter((m) => m.status === "accepted")
        .length,
      totalCompletedContracts: matchings.filter(
        (m) => m.contractStatus === "completed"
      ).length,
      pendingMatchings: matchings.filter((m) => m.status === "pending").length,
      progressContracts: matchings.filter(
        (m) => m.contractStatus === "progress"
      ).length,
      totalReviews: reviews.length,
      totalInquiries: inquiries.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0,
    };

    // 💰 수입 통계
    const acceptedMatchings = matchings.filter((m) => m.status === "accepted");
    const totalParentPayment = acceptedMatchings.reduce(
      (sum, m) => sum + (m.parentPayment || 0),
      0
    );
    const totalTeacherEarnings = acceptedMatchings.reduce(
      (sum, m) => sum + (m.totalEarnings || 0),
      0
    );
    const totalCompanyRevenue = totalParentPayment - totalTeacherEarnings;
    const averageHourlyWage =
      acceptedMatchings.length > 0
        ? acceptedMatchings.reduce((sum, m) => sum + m.hourlyWage, 0) /
          acceptedMatchings.length
        : 0;

    // 월별 통계 (현재 1월 데이터로 설정)
    const currentMonth = 0; // 1월
    const currentYear = 2024;
    const monthlyMatchings = acceptedMatchings.filter((m) => {
      const matchDate = new Date(m.createdAt);
      return (
        matchDate.getMonth() === currentMonth &&
        matchDate.getFullYear() === currentYear
      );
    });
    const monthlyRevenue = monthlyMatchings.reduce(
      (sum, m) => sum + (m.parentPayment || 0),
      0
    );

    const revenue = {
      totalParentPayment,
      totalTeacherEarnings,
      totalCompanyRevenue,
      averageHourlyWage: Math.round(averageHourlyWage),
      monthlyRevenue,
      monthlyMatchings: monthlyMatchings.length,
    };

    // 📋 계약 현황
    const progressContracts = acceptedMatchings.filter(
      (m) => m.contractStatus === "progress"
    );
    const completedContracts = acceptedMatchings.filter(
      (m) => m.contractStatus === "completed"
    );

    const contracts = {
      progress: progressContracts.length,
      completed: completedContracts.length,
      progressEarnings: progressContracts.reduce(
        (sum, m) => sum + (m.totalEarnings || 0),
        0
      ),
      completedEarnings: completedContracts.reduce(
        (sum, m) => sum + (m.totalEarnings || 0),
        0
      ),
    };

    // 📊 과목별 통계
    const subjectStats = {};
    acceptedMatchings.forEach((matching) => {
      const subject = matching.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = { count: 0, totalEarnings: 0 };
      }
      subjectStats[subject].count++;
      subjectStats[subject].totalEarnings += matching.totalEarnings;
    });

    // 📊 지역별 통계
    const locationStats = {};
    applications.forEach((app) => {
      const location = app.location;
      if (!locationStats[location]) {
        locationStats[location] = { count: 0, totalWage: 0 };
      }
      locationStats[location].count++;
      locationStats[location].totalWage += app.hourlyWage;
    });

    // 📊 결제 현황
    const completedPayments = payments.filter((p) => p.status === "completed");
    const pendingPayments = payments.filter((p) => p.status === "pending");
    const totalPaymentAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    // 📊 급여 현황
    const paidSalaries = salaries.filter((s) => s.status === "paid");
    const pendingSalaries = salaries.filter((s) => s.status === "pending");
    const totalSalaryAmount = salaries.reduce((sum, s) => sum + s.amount, 0);

    setDashboardData({
      overview,
      revenue,
      contracts,
      matchings: acceptedMatchings,
      payments,
      salaries,
      subjectStats,
      locationStats,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      totalPaymentAmount,
      paidSalaries: paidSalaries.length,
      pendingSalaries: pendingSalaries.length,
      totalSalaryAmount,
      reviews,
      inquiries,
    });
  };

  useEffect(() => {
    calculateDashboardData();
  }, [mockData]);

  // 데이터 업데이트 함수들
  const updateMatching = (matchingId, updates) => {
    setMockData((prev) => ({
      ...prev,
      matchings: prev.matchings.map((m) =>
        m.id === matchingId ? { ...m, ...updates } : m
      ),
    }));
  };

  const addMatching = (matching) => {
    setMockData((prev) => ({
      ...prev,
      matchings: [...prev.matchings, matching],
    }));
  };

  const updatePayment = (paymentId, updates) => {
    setMockData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.id === paymentId ? { ...p, ...updates } : p
      ),
    }));
  };

  const addPayment = (payment) => {
    setMockData((prev) => ({
      ...prev,
      payments: [...prev.payments, payment],
    }));
  };

  const updateSalary = (salaryId, updates) => {
    setMockData((prev) => ({
      ...prev,
      salaries: prev.salaries.map((s) =>
        s.id === salaryId ? { ...s, ...updates } : s
      ),
    }));
  };

  const addSalary = (salary) => {
    setMockData((prev) => ({
      ...prev,
      salaries: [...prev.salaries, salary],
    }));
  };

  const value = {
    dashboardData,
    mockData,
    updateMatching,
    addMatching,
    updatePayment,
    addPayment,
    updateSalary,
    addSalary,
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
