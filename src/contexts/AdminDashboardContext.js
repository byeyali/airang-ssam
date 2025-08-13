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
    parents: [],

    // 모의 공고 데이터
    applications: [],

    // 모의 쌤 데이터
    teachers: [],

    // 모의 매칭 데이터
    matchings: [],

    // 모의 결제 데이터
    payments: [],

    // 모의 급여 데이터
    salaries: [],

    // 모의 리뷰 데이터
    reviews: [],

    // 모의 문의 데이터
    inquiries: [],
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
