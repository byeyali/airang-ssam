import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import { useTeacher } from "../../contexts/TeacherContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getAllApplications } = useApplication();
  const { getAllTeachers } = useTeacher();

  const [statistics, setStatistics] = useState({
    totalMatchings: 0,
    pendingMatchings: 0,
    acceptedMatchings: 0,
    rejectedMatchings: 0,
    totalApplications: 0,
    totalTeachers: 0,
    totalTeacherEarnings: 0,
    totalParentPayment: 0,
    totalCompanyRevenue: 0,
    averageHourlyWage: 0,
    contractProgress: 0,
    contractCompleted: 0,
    contractProgressEarnings: 0,
    contractCompletedEarnings: 0,
    acceptedMatchingsWithEarnings: [],
    paymentStatus: [], // 부모 입금 현황
    salaryStatus: [], // 선생 일당 지급 현황
  });

  const [chartData, setChartData] = useState({
    statusChart: [],
    earningsChart: [],
    monthlyTrend: [],
    monthlyRevenue: [], // 월별 수입 그래프
    expectedMonthlyRevenue: [], // 월별 예상 수입 그래프
    actualMonthlyRevenue: [], // 실제 월별 받은 수입 그래프
  });

  useEffect(() => {
    if (user?.type === "admin") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();
    const allTeachers = getAllTeachers();

    // 기본 통계 계산
    const totalMatchings = allMatchings.length;
    const pendingMatchings = allMatchings.filter(
      (m) => m.status === "pending"
    ).length;
    const acceptedMatchings = allMatchings.filter(
      (m) => m.status === "accepted"
    ).length;
    const rejectedMatchings = allMatchings.filter(
      (m) => m.status === "rejected"
    ).length;
    const totalApplications = allApplications.length;
    const totalTeachers = allTeachers.length;

    // 수입 계산 - 계약 수락 완료된 매칭만 계산
    const acceptedMatchingsWithEarnings = allMatchings
      .filter((m) => m.status === "accepted" && m.contractStatus) // 계약 상태가 있는 수락된 매칭만
      .map((matching) => {
        // 매칭과 공고 연결 로직 개선
        let application;

        // 매칭 ID에 따른 공고 매핑
        const matchingToApplicationMap = {
          matching_001: "app_001", // 양연희 - 김가정
          matching_002: "app_002", // 김민수 - 박영희
          matching_003: "app_003", // 박지영 - 이민수
          matching_004: "app_004", // 이준호 - 최지영
          matching_005: "app_005", // 최영희 - 한미영
          matching_006: "app_006", // 정수진 - 정성훈
          matching_007: "app_007", // 양연희 - 김태현
          matching_008: "app_008", // 김민수 - 박성훈
          matching_009: "app_009", // 박지영 - 이지영
          matching_010: "app_010", // 이준호 - 김미영
          matching_011: "app_011", // 최영희 - 최민수
          matching_012: "app_012", // 정수진 - 한지영
        };

        const applicationId = matchingToApplicationMap[matching.id];
        application = allApplications.find((app) => app.id === applicationId);

        // 공고를 찾지 못한 경우 기본값 설정
        if (!application) {
          console.warn(
            `공고를 찾을 수 없습니다: ${matching.id} -> ${applicationId}`
          );
          application = {
            payment: "시간 당 15,000 (협의가능)",
            workingHours: "오후 2시~5시",
            type: "정기 매주 월,수,금 (주3회)",
            startDate: matching.createdAt.split("T")[0],
            endDate: new Date(
              new Date(matching.createdAt).getTime() +
                5 * 30 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
          };
        }

        // 시급 파싱 개선
        let hourlyWage = 0;
        if (application?.payment) {
          // "시간 당 15,000 (협의가능)" 형태에서 숫자 추출
          const paymentText = application.payment;
          const numberMatch = paymentText.match(/\d{1,3}(?:,\d{3})*/);
          if (numberMatch) {
            hourlyWage = parseInt(numberMatch[0].replace(/,/g, ""));
          } else {
            // 다른 형태의 숫자 패턴 시도
            const simpleNumberMatch = paymentText.match(/\d+/);
            if (simpleNumberMatch) {
              hourlyWage = parseInt(simpleNumberMatch[0]);
            }
          }
        }

        // 시급이 0인 경우 기본값 설정
        if (hourlyWage === 0) {
          console.warn(`시급을 파싱할 수 없습니다: ${application?.payment}`);
          hourlyWage = 15000; // 기본 시급
        }
        const workingHours = application?.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(
          application?.type || ""
        );
        const totalHours = hoursPerSession * sessionsPerWeek * 4; // 월 4주

        // 근무시간이 0인 경우 기본값 설정
        if (totalHours === 0) {
          console.warn(
            `근무시간을 계산할 수 없습니다: ${workingHours}, ${application?.type}`
          );
        }
        const monthlyEarnings = hourlyWage * totalHours;
        const contractMonths = 5; // 5개월 계약
        const teacherTotalEarnings = monthlyEarnings * contractMonths; // 쌤이 받는 총 수당

        // 새로운 수수료 시스템: 부모와 쌤 각각에게 5%씩 수수료
        const baseAmount = teacherTotalEarnings; // 기본 쌤 수당
        const parentCommission = baseAmount * 0.05; // 부모에게 받는 수수료 5%
        const teacherCommission = baseAmount * 0.05; // 쌤에게 받는 수수료 5%
        const totalCompanyCommission = parentCommission + teacherCommission; // 회사 총 수수료

        // 부모가 지불하는 총액 (기본 수당 + 부모 수수료 5%)
        const parentTotalPayment = baseAmount + parentCommission;
        // 쌤이 실제 받는 수당 (기본 수당 - 쌤 수수료 5%)
        const teacherActualEarnings = baseAmount - teacherCommission;
        // 회사 총 수입 (부모 수수료 + 쌤 수수료)
        const companyRevenue = totalCompanyCommission;

        // 디버깅 로그
        console.log("매칭 ID:", matching.id);
        console.log("공고:", application?.title);
        console.log("시급:", hourlyWage);
        console.log("근무시간:", workingHours);
        console.log("세션당 시간:", hoursPerSession);
        console.log("주당 세션:", sessionsPerWeek);
        console.log("월 총 시간:", totalHours);
        console.log("월 쌤 수당:", monthlyEarnings);
        console.log("기본 쌤 수당:", baseAmount);
        console.log("부모 수수료:", parentCommission);
        console.log("쌤 수수료:", teacherCommission);
        console.log("쌤 실제 수당:", teacherActualEarnings);
        console.log("부모 총 지불액:", parentTotalPayment);
        console.log("회사 총 수수료:", totalCompanyCommission);
        console.log("회사 수입:", companyRevenue);
        console.log("---");

        return {
          ...matching,
          monthlyEarnings,
          teacherTotalEarnings: baseAmount, // 기본 쌤 수당
          teacherActualEarnings, // 쌤이 실제 받는 수당
          parentTotalPayment,
          parentCommission,
          teacherCommission,
          totalCompanyCommission,
          companyRevenue,
          hourlyWage,
          application,
          workingHours,
          hoursPerSession,
          sessionsPerWeek,
          totalHours,
          contractMonths,
        };
      });

    const totalTeacherEarnings = acceptedMatchingsWithEarnings.reduce(
      (sum, m) => sum + m.teacherActualEarnings, // 쌤이 실제 받는 수당
      0
    );
    const totalParentPayment = acceptedMatchingsWithEarnings.reduce(
      (sum, m) => sum + m.parentTotalPayment,
      0
    );
    const totalCompanyRevenue = acceptedMatchingsWithEarnings.reduce(
      (sum, m) => sum + m.totalCompanyCommission, // 회사 총 수수료
      0
    );
    const averageHourlyWage =
      acceptedMatchingsWithEarnings.length > 0
        ? acceptedMatchingsWithEarnings.reduce(
            (sum, m) => sum + m.hourlyWage,
            0
          ) / acceptedMatchingsWithEarnings.length
        : 0;

    // 계약 상태별 수입 계산
    const contractProgressEarnings = acceptedMatchingsWithEarnings
      .filter((m) => m.contractStatus === "progress")
      .reduce((sum, m) => sum + m.teacherActualEarnings, 0);

    const contractCompletedEarnings = acceptedMatchingsWithEarnings
      .filter((m) => m.contractStatus === "completed")
      .reduce((sum, m) => sum + m.teacherActualEarnings, 0);

    // 계약 상태 통계
    const contractProgress = allMatchings.filter(
      (m) => m.contractStatus === "progress"
    ).length;
    const contractCompleted = allMatchings.filter(
      (m) => m.contractStatus === "completed"
    ).length;

    // 부모 입금 현황 계산
    const paymentStatus = acceptedMatchingsWithEarnings.map((matching) => {
      const monthlyParentPayment =
        matching.parentTotalPayment / matching.contractMonths;
      const months = [];

      for (let i = 1; i <= matching.contractMonths; i++) {
        const monthName = `${i}월`;
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i - 1);

        months.push({
          month: monthName,
          amount: monthlyParentPayment,
          dueDate: dueDate.toLocaleDateString("ko-KR"),
          status: i === 1 ? "입금완료" : i === 2 ? "입금예정" : "미입금", // 첫 달은 입금완료, 두 번째 달은 입금예정
          parentName: matching.parentName,
          teacherName: matching.teacherName,
          contractStatus: matching.contractStatus,
        });
      }

      return {
        matchingId: matching.id,
        parentName: matching.parentName,
        teacherName: matching.teacherName,
        totalAmount: matching.parentTotalPayment,
        monthlyAmount: monthlyParentPayment,
        contractStatus: matching.contractStatus,
        months: months,
      };
    });

    // 선생 일당 지급 현황 계산
    const salaryStatus = acceptedMatchingsWithEarnings.map((matching) => {
      const dailyWage = matching.hourlyWage * matching.hoursPerSession;
      const weeklySessions = matching.sessionsPerWeek;
      const monthlySalary = dailyWage * weeklySessions * 4;

      const sessions = [];
      const totalSessions =
        matching.sessionsPerWeek * matching.contractMonths * 4;

      for (let i = 1; i <= totalSessions; i++) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + (i - 1) * 2); // 2일마다 수업

        sessions.push({
          sessionNumber: i,
          date: sessionDate.toLocaleDateString("ko-KR"),
          dailyWage: dailyWage,
          status: i <= 8 ? "지급완료" : i <= 12 ? "지급예정" : "미지급", // 첫 8회는 지급완료, 다음 4회는 지급예정
          parentName: matching.parentName,
          teacherName: matching.teacherName,
          contractStatus: matching.contractStatus,
        });
      }

      return {
        matchingId: matching.id,
        parentName: matching.parentName,
        teacherName: matching.teacherName,
        dailyWage: dailyWage,
        monthlySalary: monthlySalary,
        totalSalary: matching.teacherTotalEarnings,
        contractStatus: matching.contractStatus,
        sessions: sessions,
      };
    });

    setStatistics({
      totalMatchings,
      pendingMatchings,
      acceptedMatchings,
      rejectedMatchings,
      totalApplications,
      totalTeachers,
      totalTeacherEarnings,
      totalParentPayment,
      totalCompanyRevenue,
      averageHourlyWage,
      contractProgress,
      contractCompleted,
      contractProgressEarnings,
      contractCompletedEarnings,
      acceptedMatchingsWithEarnings,
      paymentStatus,
      salaryStatus,
    });

    // 차트 데이터 생성
    const chartDataToSet = {
      statusChart: [
        { label: "대기중", value: pendingMatchings, color: "#ffc107" },
        { label: "수락됨", value: acceptedMatchings, color: "#28a745" },
        { label: "거절됨", value: rejectedMatchings, color: "#dc3545" },
      ],
      earningsChart: acceptedMatchingsWithEarnings.map((m) => ({
        label: m.teacherName || "쌤",
        value: m.totalEarnings,
        color: "#4a90e2",
      })),
      monthlyTrend: generateMonthlyTrend(allMatchings),
      monthlyRevenue: generateMonthlyRevenue(allMatchings, allApplications),
      expectedMonthlyRevenue: generateExpectedMonthlyRevenue(
        allMatchings,
        allApplications
      ),
      actualMonthlyRevenue: generateActualMonthlyRevenue(
        allMatchings,
        allApplications
      ),
    };

    console.log("차트 데이터 설정:", chartDataToSet);
    setChartData(chartDataToSet);
  };

  const calculateHoursFromWorkingHours = (workingHours) => {
    if (!workingHours) return 3; // 기본값 3시간

    // "오후 2시~7시" 형태 파싱
    const afternoonMatch = workingHours.match(/오후\s*(\d+)시~(\d+)시/);
    if (afternoonMatch) {
      const startHour = parseInt(afternoonMatch[1]) + 12; // 오후는 +12
      const endHour = parseInt(afternoonMatch[2]) + 12;
      return endHour - startHour;
    }

    // "오전 9시~12시" 형태 파싱
    const morningMatch = workingHours.match(/오전\s*(\d+)시~(\d+)시/);
    if (morningMatch) {
      const startHour = parseInt(morningMatch[1]);
      const endHour = parseInt(morningMatch[2]);
      return endHour - startHour;
    }

    // "2시~7시" 형태 파싱
    const simpleMatch = workingHours.match(/(\d+)시~(\d+)시/);
    if (simpleMatch) {
      const startHour = parseInt(simpleMatch[1]);
      const endHour = parseInt(simpleMatch[2]);
      return endHour - startHour;
    }

    console.warn(`근무시간을 파싱할 수 없습니다: ${workingHours}`);
    return 3; // 기본값
  };

  const calculateSessionsPerWeek = (type) => {
    if (!type) return 3; // 기본값 3회

    if (type.includes("주5회")) return 5;
    if (type.includes("주3회")) return 3;
    if (type.includes("주2회")) return 2;
    if (type.includes("주1회")) return 1;

    console.warn(`주간 세션 수를 파싱할 수 없습니다: ${type}`);
    return 3; // 기본값
  };

  const generateMonthlyTrend = (matchings) => {
    const months = {};
    matchings.forEach((matching) => {
      const date = new Date(matching.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      months[monthKey] = (months[monthKey] || 0) + 1;
    });

    return Object.entries(months).map(([month, count]) => ({
      label: month,
      value: count,
      color: "#4a90e2",
    }));
  };

  const generateMonthlyRevenue = (matchings, applications) => {
    const monthlyRevenue = {};

    // 지난 12개월 데이터 초기화
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyRevenue[monthKey] = 0;
    }

    console.log("초기화된 월별 수입:", monthlyRevenue);

    // 계약 수락 완료된 매칭만 수입으로 계산
    const acceptedMatchings = matchings.filter(
      (m) => m.status === "accepted" && m.contractStatus
    );

    console.log("계약 수락 완료된 매칭:", acceptedMatchings);

    acceptedMatchings.forEach((matching) => {
      // 매칭과 공고 연결 로직 개선
      const matchingToApplicationMap = {
        matching_001: "app_001", // 양연희 - 김가정
        matching_002: "app_002", // 김민수 - 박영희
        matching_003: "app_003", // 박지영 - 이민수
        matching_004: "app_004", // 이준호 - 최지영
        matching_005: "app_005", // 최영희 - 한미영
        matching_006: "app_006", // 정수진 - 정성훈
        matching_007: "app_007", // 양연희 - 김태현
        matching_008: "app_008", // 김민수 - 박성훈
        matching_009: "app_009", // 박지영 - 이지영
        matching_010: "app_010", // 이준호 - 김미영
        matching_011: "app_011", // 최영희 - 최민수
        matching_012: "app_012", // 정수진 - 한지영
      };

      const applicationId = matchingToApplicationMap[matching.id];
      const application = applications.find((app) => app.id === applicationId);

      console.log("매칭 ID:", matching.id, "찾은 공고:", application);

      if (application) {
        let hourlyWage = 0;
        if (application.payment) {
          const commaMatch = application.payment.match(/\d{1,3}(?:,\d{3})*/);
          if (commaMatch) {
            hourlyWage = parseInt(commaMatch[0].replace(/,/g, ""));
          } else {
            const numberMatch = application.payment.match(/\d+/);
            if (numberMatch) {
              hourlyWage = parseInt(numberMatch[0]);
            }
          }
        }

        const workingHours = application.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(application.type);
        const monthlyEarnings = Math.max(
          0,
          hourlyWage * hoursPerSession * sessionsPerWeek * 4
        ); // 월 4주, 음수 방지

        console.log("시급:", hourlyWage, "월 수입:", monthlyEarnings);

        // 계약 기간 동안 월별 수입 분배
        const contractStartDate = new Date(matching.createdAt);
        const contractMonths = matching.id === "matching_003" ? 12 : 5; // 박민수 쌤은 1년, 나머지는 5개월

        console.log("계약 시작일:", contractStartDate);

        for (let i = 0; i < contractMonths; i++) {
          const contractMonth = new Date(
            contractStartDate.getFullYear(),
            contractStartDate.getMonth() + i,
            1
          );
          const monthKey = `${contractMonth.getFullYear()}-${String(
            contractMonth.getMonth() + 1
          ).padStart(2, "0")}`;

          console.log(`계약 ${i + 1}개월차: ${monthKey}`);

          // 지난 12개월 내에 있는 경우만 계산
          if (monthlyRevenue.hasOwnProperty(monthKey)) {
            monthlyRevenue[monthKey] += monthlyEarnings;
            console.log(
              `월 ${monthKey}에 ${monthlyEarnings}원 추가됨 (총: ${monthlyRevenue[monthKey]}원)`
            );
          } else {
            console.log(`월 ${monthKey}는 지난 12개월 범위에 없음`);
          }
        }
      }
    });

    // 최대값이 0인 경우 샘플 데이터 추가 (데모용)
    const maxAmount = Math.max(
      ...Object.values(monthlyRevenue).map((val) => (isNaN(val) ? 0 : val))
    );
    if (maxAmount === 0) {
      console.log("데모용 샘플 데이터 추가");
      // 모든 월에 샘플 데이터 추가 (더 현실적인 데이터)
      Object.keys(monthlyRevenue).forEach((month, index) => {
        // 계절별로 다른 수입 패턴 생성
        const monthNum = parseInt(month.split("-")[1]);
        let baseAmount = 800000; // 기본 80만원

        if (monthNum >= 3 && monthNum <= 5) {
          // 봄 (3-5월): 높은 수입
          baseAmount = 1200000;
        } else if (monthNum >= 6 && monthNum <= 8) {
          // 여름 (6-8월): 매우 높은 수입
          baseAmount = 1500000;
        } else if (monthNum >= 9 && monthNum <= 11) {
          // 가을 (9-11월): 중간 수입
          baseAmount = 1000000;
        } else {
          // 겨울 (12-2월): 낮은 수입
          baseAmount = 600000;
        }

        // 약간의 변동성 추가
        const variation = Math.random() * 0.4 - 0.2; // ±20% 변동
        monthlyRevenue[month] = Math.round(baseAmount * (1 + variation));
        console.log(`데모 데이터: ${month}에 ${monthlyRevenue[month]}원 추가`);
      });
    }

    const result = Object.entries(monthlyRevenue)
      .filter(
        ([month, amount]) =>
          !isNaN(amount) && amount !== undefined && amount !== null
      )
      .map(([month, amount]) => ({
        label: month,
        value: amount,
        color: "#28a745", // 초록색으로 표시
      }));

    console.log("최종 월별 수입 데이터:", result);
    return result;
  };

  const generateExpectedMonthlyRevenue = (matchings, applications) => {
    const expectedMonthlyRevenue = {};

    // 지난 12개월 데이터 초기화
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      expectedMonthlyRevenue[monthKey] = 0;
    }

    // 계약 수락 완료된 매칭만 예상 수입으로 계산
    const acceptedMatchings = matchings.filter(
      (m) => m.status === "accepted" && m.contractStatus
    );

    acceptedMatchings.forEach((matching) => {
      // 매칭과 공고 연결 로직 개선
      const matchingToApplicationMap = {
        matching_001: "app_001", // 양연희 - 김가정
        matching_002: "app_002", // 김민수 - 박영희
        matching_003: "app_003", // 박지영 - 이민수
        matching_004: "app_004", // 이준호 - 최지영
        matching_005: "app_005", // 최영희 - 한미영
        matching_006: "app_006", // 정수진 - 정성훈
        matching_007: "app_007", // 양연희 - 김태현
        matching_008: "app_008", // 김민수 - 박성훈
        matching_009: "app_009", // 박지영 - 이지영
        matching_010: "app_010", // 이준호 - 김미영
        matching_011: "app_011", // 최영희 - 최민수
        matching_012: "app_012", // 정수진 - 한지영
      };

      const applicationId = matchingToApplicationMap[matching.id];
      const application = applications.find((app) => app.id === applicationId);

      if (application) {
        let hourlyWage = 0;
        if (application.payment) {
          const paymentText = application.payment;
          const numberMatch = paymentText.match(/\d{1,3}(?:,\d{3})*/);
          if (numberMatch) {
            hourlyWage = parseInt(numberMatch[0].replace(/,/g, ""));
          } else {
            const simpleNumberMatch = paymentText.match(/\d+/);
            if (simpleNumberMatch) {
              hourlyWage = parseInt(simpleNumberMatch[0]);
            }
          }
        }

        // 시급이 0인 경우 기본값 설정
        if (hourlyWage === 0) {
          hourlyWage = 15000; // 기본 시급
        }

        const workingHours = application.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(application.type);
        const monthlyEarnings =
          hourlyWage * hoursPerSession * sessionsPerWeek * 4; // 월 4주

        // 계약 기간 동안 월별 예상 수입 분배
        const contractStartDate = new Date(matching.createdAt);
        const contractMonths = 5; // 모든 계약을 5개월로 통일

        for (let i = 0; i < contractMonths; i++) {
          const contractMonth = new Date(
            contractStartDate.getFullYear(),
            contractStartDate.getMonth() + i,
            1
          );
          const monthKey = `${contractMonth.getFullYear()}-${String(
            contractMonth.getMonth() + 1
          ).padStart(2, "0")}`;

          // 지난 12개월 내에 있는 경우만 계산
          if (expectedMonthlyRevenue.hasOwnProperty(monthKey)) {
            expectedMonthlyRevenue[monthKey] += monthlyEarnings;
          }
        }
      }
    });

    // 최대값이 0인 경우 샘플 데이터 추가 (데모용)
    const maxAmount = Math.max(
      ...Object.values(expectedMonthlyRevenue).map((val) =>
        isNaN(val) ? 0 : val
      )
    );
    if (maxAmount === 0) {
      // 모든 월에 샘플 데이터 추가 (더 현실적인 데이터)
      Object.keys(expectedMonthlyRevenue).forEach((month, index) => {
        // 계절별로 다른 수입 패턴 생성
        const monthNum = parseInt(month.split("-")[1]);
        let baseAmount = 1000000; // 기본 100만원

        if (monthNum >= 3 && monthNum <= 5) {
          // 봄 (3-5월): 높은 수입
          baseAmount = 1400000;
        } else if (monthNum >= 6 && monthNum <= 8) {
          // 여름 (6-8월): 매우 높은 수입
          baseAmount = 1800000;
        } else if (monthNum >= 9 && monthNum <= 11) {
          // 가을 (9-11월): 중간 수입
          baseAmount = 1200000;
        } else {
          // 겨울 (12-2월): 낮은 수입
          baseAmount = 800000;
        }

        // 약간의 변동성 추가
        const variation = Math.random() * 0.4 - 0.2; // ±20% 변동
        expectedMonthlyRevenue[month] = Math.round(
          baseAmount * (1 + variation)
        );
      });
    }

    return Object.entries(expectedMonthlyRevenue)
      .filter(
        ([month, amount]) =>
          !isNaN(amount) && amount !== undefined && amount !== null
      )
      .map(([month, amount]) => ({
        label: month,
        value: amount,
        color: "#007bff", // 파란색으로 표시
      }));
  };

  const generateActualMonthlyRevenue = (matchings, applications) => {
    const actualMonthlyRevenue = {};

    // 지난 12개월 데이터 초기화
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      actualMonthlyRevenue[monthKey] = 0;
    }

    // 계약 수락 완료된 매칭만 실제 수입으로 계산
    const acceptedMatchings = matchings.filter(
      (m) => m.status === "accepted" && m.contractStatus
    );

    acceptedMatchings.forEach((matching) => {
      // 매칭과 공고 연결 로직 개선
      const matchingToApplicationMap = {
        matching_001: "app_001", // 양연희 - 김가정
        matching_002: "app_002", // 김민수 - 박영희
        matching_003: "app_003", // 박지영 - 이민수
        matching_004: "app_004", // 이준호 - 최지영
        matching_005: "app_005", // 최영희 - 한미영
        matching_006: "app_006", // 정수진 - 정성훈
        matching_007: "app_007", // 양연희 - 김태현
        matching_008: "app_008", // 김민수 - 박성훈
        matching_009: "app_009", // 박지영 - 이지영
        matching_010: "app_010", // 이준호 - 김미영
        matching_011: "app_011", // 최영희 - 최민수
        matching_012: "app_012", // 정수진 - 한지영
      };

      const applicationId = matchingToApplicationMap[matching.id];
      const application = applications.find((app) => app.id === applicationId);

      if (application) {
        let hourlyWage = 0;
        if (application.payment) {
          const paymentText = application.payment;
          const numberMatch = paymentText.match(/\d{1,3}(?:,\d{3})*/);
          if (numberMatch) {
            hourlyWage = parseInt(numberMatch[0].replace(/,/g, ""));
          } else {
            const simpleNumberMatch = paymentText.match(/\d+/);
            if (simpleNumberMatch) {
              hourlyWage = parseInt(simpleNumberMatch[0]);
            }
          }
        }

        // 시급이 0인 경우 기본값 설정
        if (hourlyWage === 0) {
          hourlyWage = 15000; // 기본 시급
        }

        const workingHours = application.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(application.type);
        const monthlyEarnings =
          hourlyWage * hoursPerSession * sessionsPerWeek * 4; // 월 4주

        // 실제 수입은 수수료 5% 차감
        const actualMonthlyEarnings = monthlyEarnings * 0.95;

        // 계약 기간 동안 월별 실제 수입 분배
        const contractStartDate = new Date(matching.createdAt);
        const contractMonths = 5; // 모든 계약을 5개월로 통일

        for (let i = 0; i < contractMonths; i++) {
          const contractMonth = new Date(
            contractStartDate.getFullYear(),
            contractStartDate.getMonth() + i,
            1
          );
          const monthKey = `${contractMonth.getFullYear()}-${String(
            contractMonth.getMonth() + 1
          ).padStart(2, "0")}`;

          // 지난 12개월 내에 있는 경우만 계산
          if (actualMonthlyRevenue.hasOwnProperty(monthKey)) {
            actualMonthlyRevenue[monthKey] += actualMonthlyEarnings;
          }
        }
      }
    });

    // 최대값이 0인 경우 샘플 데이터 추가 (데모용)
    const maxAmount = Math.max(
      ...Object.values(actualMonthlyRevenue).map((val) =>
        isNaN(val) ? 0 : val
      )
    );
    if (maxAmount === 0) {
      // 모든 월에 샘플 데이터 추가 (더 현실적인 데이터)
      Object.keys(actualMonthlyRevenue).forEach((month, index) => {
        // 계절별로 다른 수입 패턴 생성
        const monthNum = parseInt(month.split("-")[1]);
        let baseAmount = 950000; // 기본 95만원 (수수료 차감 후)

        if (monthNum >= 3 && monthNum <= 5) {
          // 봄 (3-5월): 높은 수입
          baseAmount = 1330000;
        } else if (monthNum >= 6 && monthNum <= 8) {
          // 여름 (6-8월): 매우 높은 수입
          baseAmount = 1710000;
        } else if (monthNum >= 9 && monthNum <= 11) {
          // 가을 (9-11월): 중간 수입
          baseAmount = 1140000;
        } else {
          // 겨울 (12-2월): 낮은 수입
          baseAmount = 760000;
        }

        // 약간의 변동성 추가
        const variation = Math.random() * 0.4 - 0.2; // ±20% 변동
        actualMonthlyRevenue[month] = Math.round(baseAmount * (1 + variation));
      });
    }

    return Object.entries(actualMonthlyRevenue)
      .filter(
        ([month, amount]) =>
          !isNaN(amount) && amount !== undefined && amount !== null
      )
      .map(([month, amount]) => ({
        label: month,
        value: amount,
        color: "#28a745", // 초록색으로 표시 (실제 수입)
      }));
  };

  const formatCurrency = (amount) => {
    // NaN이나 undefined 체크
    if (isNaN(amount) || amount === undefined || amount === null) {
      return "0원";
    }
    // 숫자가 아닌 경우 0으로 처리
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return "0원";
    }
    return new Intl.NumberFormat("ko-KR").format(numAmount) + "원";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR");
  };

  if (user?.type !== "admin") {
    return (
      <div className="admin-dashboard-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>관리자 대시보드</h1>
          <p>전체 매칭 현황 및 통계</p>
        </div>

        {/* 주요 통계 카드 */}
        <div className="statistics-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <div className="icon-circle">
                <span>📊</span>
              </div>
            </div>
            <div className="stat-content">
              <h3>전체 매칭</h3>
              <p className="stat-number">{statistics.totalMatchings}</p>
              <p className="stat-description">총 매칭 요청 수</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <div className="icon-circle">
                <span>✅</span>
              </div>
            </div>
            <div className="stat-content">
              <h3>수락된 매칭</h3>
              <p className="stat-number">{statistics.acceptedMatchings}</p>
              <p className="stat-description">성공적으로 매칭됨</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <div className="icon-circle">
                <span>⏳</span>
              </div>
            </div>
            <div className="stat-content">
              <h3>대기중인 매칭</h3>
              <p className="stat-number">{statistics.pendingMatchings}</p>
              <p className="stat-description">응답 대기중</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <div className="icon-circle">
                <span>❌</span>
              </div>
            </div>
            <div className="stat-content">
              <h3>거절된 매칭</h3>
              <p className="stat-number">{statistics.rejectedMatchings}</p>
              <p className="stat-description">매칭 거절됨</p>
            </div>
          </div>
        </div>

        {/* 매칭 현황 및 계약 상태 */}
        <div className="matching-status-section">
          <div className="matching-overview">
            <div className="matching-chart">
              <h3>매칭 상태 분포</h3>
              <div className="line-chart">
                {chartData.statusChart.map((item, index) => (
                  <div key={index} className="chart-item">
                    <div className="chart-bar">
                      <div
                        className="chart-fill"
                        style={{
                          width: `${
                            (item.value / statistics.totalMatchings) * 100
                          }%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                    <div className="chart-label">
                      <span
                        className="chart-color"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span>
                        {item.label}: {item.value}건
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contract-overview">
              <h3>계약 현황</h3>
              <div className="contract-summary">
                <div className="contract-item">
                  <span className="contract-number">
                    {statistics.contractCompleted}
                  </span>
                  <span className="contract-label">계약 완료</span>
                </div>
                <div className="contract-item">
                  <span className="contract-number">
                    {statistics.contractProgress}
                  </span>
                  <span className="contract-label">계약 진행중</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수입 통계 테이블 */}
        <div className="revenue-stats-section">
          <h3>💰 수입 통계</h3>
          <div className="revenue-table">
            <div className="table-header">
              <div className="table-cell">구분</div>
              <div className="table-cell">총 수입</div>
              <div className="table-cell">월별 수입</div>
              <div className="table-cell">수수료 내역</div>
            </div>
            <div className="table-row">
              <div className="table-cell">부모 지출</div>
              <div className="table-cell">
                {formatCurrency(statistics.totalParentPayment)}원
              </div>
              <div className="table-cell">
                {formatCurrency(Math.round(statistics.totalParentPayment / 12))}
                원/월
              </div>
              <div className="table-cell">부모 수수료 5%</div>
            </div>
            <div className="table-row">
              <div className="table-cell">쌤 수입</div>
              <div className="table-cell">
                {formatCurrency(statistics.totalTeacherEarnings)}원
              </div>
              <div className="table-cell">
                {formatCurrency(
                  Math.round(statistics.totalTeacherEarnings / 12)
                )}
                원/월
              </div>
              <div className="table-cell">쌤 수수료 5%</div>
            </div>
            <div className="table-row">
              <div className="table-cell">회사 수입</div>
              <div className="table-cell">
                {formatCurrency(statistics.totalCompanyRevenue)}원
              </div>
              <div className="table-cell">
                {formatCurrency(
                  Math.round(statistics.totalCompanyRevenue / 12)
                )}
                원/월
              </div>
              <div className="table-cell">총 수수료 10%</div>
            </div>
          </div>
        </div>

        {/* 쌤별 상세 수입 정보 */}
        <div className="earnings-details">
          <h4>쌤별 수입 상세</h4>
          <div className="earnings-table">
            <div className="table-header">
              <div className="table-cell">쌤 이름</div>
              <div className="table-cell">시급</div>
              <div className="table-cell">수업일수</div>
              <div className="table-cell">총 수입</div>
              <div className="table-cell">수수료 내역</div>
              <div className="table-cell">상세보기</div>
            </div>
            {statistics.acceptedMatchingsWithEarnings.map((matching, index) => {
              // 수업일수 계산 (주3회 × 4주 × 계약개월)
              const totalSessions =
                matching.sessionsPerWeek * 4 * matching.contractMonths;

              // 부모 지불 현황 계산
              const totalPaymentAmount = matching.parentTotalPayment;
              const paidAmount =
                matching.contractStatus === "completed"
                  ? totalPaymentAmount
                  : Math.floor(totalPaymentAmount * 0.6); // 진행중이면 60% 지불된 것으로 가정
              const remainingAmount = totalPaymentAmount - paidAmount;

              return (
                <div key={index} className="table-row">
                  <div className="table-cell">
                    <div className="teacher-name">
                      <Link
                        to={`/teacher-detail/${matching.teacherId}`}
                        className="teacher-link"
                        target="_blank"
                      >
                        {matching.teacherName}
                      </Link>
                    </div>
                    <div className="teacher-status">
                      {matching.contractStatus === "progress" && "계약 진행중"}
                      {matching.contractStatus === "completed" && "계약 완료"}
                    </div>
                  </div>
                  <div className="table-cell">
                    {formatCurrency(matching.hourlyWage)}원/시간
                  </div>
                  <div className="table-cell">
                    <div className="sessions-info">
                      <span className="sessions-count">{totalSessions}일</span>
                      <small>
                        ({matching.sessionsPerWeek}회/주 × 4주 ×{" "}
                        {matching.contractMonths}개월)
                      </small>
                    </div>
                  </div>
                  <div className="table-cell earnings-total">
                    {formatCurrency(matching.teacherTotalEarnings)}원
                  </div>
                  <div className="table-cell">
                    <div className="commission-info">
                      <div className="commission-item">
                        <span>
                          쌤 수수료:{" "}
                          {formatCurrency(matching.teacherCommission)}원
                        </span>
                      </div>
                      <div className="commission-item">
                        <span>
                          부모 수수료:{" "}
                          {formatCurrency(matching.parentCommission)}원
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="detail-links">
                      <Link
                        to={`/payment-status`}
                        className="detail-link teacher-detail"
                        target="_blank"
                      >
                        내 수당 상세
                      </Link>
                      <Link
                        to={`/payment-history`}
                        className="detail-link parent-detail"
                        target="_blank"
                      >
                        내 지출 내역
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 요약 정보 */}
          <div className="earnings-summary">
            <div className="summary-item">
              <span className="summary-label">총 부모 지불액:</span>
              <span className="summary-value">
                {formatCurrency(statistics.totalParentPayment)}원
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">총 쌤 실제 수당:</span>
              <span className="summary-value">
                {formatCurrency(statistics.totalTeacherEarnings)}원
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">총 회사 수입:</span>
              <span className="summary-value">
                {formatCurrency(statistics.totalCompanyRevenue)}원
              </span>
            </div>
          </div>
        </div>

        {/* 사용자 통계 */}
        <div className="users-section">
          <div className="users-grid">
            <div className="user-card">
              <div className="user-icon">👥</div>
              <div className="user-content">
                <h3>전체 공고</h3>
                <p className="user-number">{statistics.totalApplications}</p>
              </div>
            </div>
            <div className="user-card">
              <div className="user-icon">👨‍🏫</div>
              <div className="user-content">
                <h3>등록된 쌤</h3>
                <p className="user-number">{statistics.totalTeachers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 매칭 현황 */}
        <div className="recent-matchings">
          <h3>최근 매칭 현황</h3>
          <div className="matchings-table">
            <div className="table-header">
              <div className="table-cell">날짜</div>
              <div className="table-cell">부모님</div>
              <div className="table-cell">쌤</div>
              <div className="table-cell">상태</div>
              <div className="table-cell">계약</div>
            </div>
            {getAllMatchingRequests()
              .slice(0, 5)
              .map((matching, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">
                    {formatDate(matching.createdAt)}
                  </div>
                  <div className="table-cell">{matching.parentName}</div>
                  <div className="table-cell">{matching.teacherName}</div>
                  <div className="table-cell">
                    <span className={`status-dot ${matching.status}`}></span>
                    {matching.status === "pending" && "대기중"}
                    {matching.status === "accepted" && "수락됨"}
                    {matching.status === "rejected" && "거절됨"}
                  </div>
                  <div className="table-cell">
                    {matching.contractStatus === "progress" && "진행중"}
                    {matching.contractStatus === "completed" && "완료"}
                    {!matching.contractStatus &&
                      matching.status === "accepted" &&
                      "대기"}
                    {!matching.contractStatus &&
                      matching.status !== "accepted" &&
                      "-"}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 계약 현황 */}
        <div className="contract-status-section">
          <h3>계약 현황</h3>
          <div className="contract-table">
            <div className="table-header">
              <div className="table-cell">계약 시작일</div>
              <div className="table-cell">부모님</div>
              <div className="table-cell">쌤</div>
              <div className="table-cell">계약 기간</div>
              <div className="table-cell">월 수당</div>
              <div className="table-cell">계약 상태</div>
              <div className="table-cell">진행률</div>
            </div>
            {statistics.acceptedMatchingsWithEarnings
              .filter((matching) => matching.contractStatus)
              .map((matching, index) => {
                const contractStartDate = new Date(matching.createdAt);
                const contractEndDate = new Date(contractStartDate);
                contractEndDate.setMonth(
                  contractEndDate.getMonth() + matching.contractMonths
                );

                const today = new Date();
                const totalDays =
                  (contractEndDate - contractStartDate) / (1000 * 60 * 60 * 24);
                const elapsedDays =
                  (today - contractStartDate) / (1000 * 60 * 60 * 24);
                const progressRate = Math.min(
                  Math.max((elapsedDays / totalDays) * 100, 0),
                  100
                );

                return (
                  <div key={index} className="table-row">
                    <div className="table-cell">
                      {contractStartDate.toLocaleDateString("ko-KR")}
                    </div>
                    <div className="table-cell">{matching.parentName}</div>
                    <div className="table-cell">{matching.teacherName}</div>
                    <div className="table-cell">
                      {matching.contractMonths}개월
                      <br />
                      <small>
                        {contractStartDate.toLocaleDateString("ko-KR")} ~{" "}
                        {contractEndDate.toLocaleDateString("ko-KR")}
                      </small>
                    </div>
                    <div className="table-cell">
                      {formatCurrency(matching.monthlyEarnings)}원/월
                    </div>
                    <div className="table-cell">
                      <span
                        className={`contract-status ${matching.contractStatus}`}
                      >
                        {matching.contractStatus === "progress" &&
                          "계약 진행중"}
                        {matching.contractStatus === "completed" && "계약 완료"}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progressRate}%` }}
                        ></div>
                        <span className="progress-text">
                          {Math.round(progressRate)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 부모 입금 현황 */}
        <div className="payment-status-section">
          <div className="section-header">
            <h3>부모 입금 현황</h3>
            <button
              className="view-all-button"
              onClick={() => window.open("/admin/payment-status", "_blank")}
            >
              전체 보기 →
            </button>
          </div>
          <div className="payment-status-summary">
            <div className="summary-card">
              <div className="summary-title">총 입금 현황</div>
              <div className="summary-content">
                <div className="summary-item">
                  <span>입금완료:</span>
                  <span className="completed-count">
                    {statistics.paymentStatus.reduce(
                      (sum, payment) =>
                        sum +
                        payment.months.filter((m) => m.status === "입금완료")
                          .length,
                      0
                    )}
                    건
                  </span>
                </div>
                <div className="summary-item">
                  <span>입금예정:</span>
                  <span className="pending-count">
                    {statistics.paymentStatus.reduce(
                      (sum, payment) =>
                        sum +
                        payment.months.filter((m) => m.status === "입금예정")
                          .length,
                      0
                    )}
                    건
                  </span>
                </div>
                <div className="summary-item">
                  <span>미입금:</span>
                  <span className="unpaid-count">
                    {statistics.paymentStatus.reduce(
                      (sum, payment) =>
                        sum +
                        payment.months.filter((m) => m.status === "미입금")
                          .length,
                      0
                    )}
                    건
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="payment-status-table">
            <div className="table-header">
              <div className="table-cell">부모님</div>
              <div className="table-cell">쌤</div>
              <div className="table-cell">월별 입금액</div>
              <div className="table-cell">입금 현황</div>
              <div className="table-cell">계약 상태</div>
            </div>
            {statistics.paymentStatus.map((payment, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">{payment.parentName}</div>
                <div className="table-cell">{payment.teacherName}</div>
                <div className="table-cell">
                  {formatCurrency(payment.monthlyAmount)}원/월
                </div>
                <div className="table-cell">
                  <div className="payment-months">
                    {payment.months.map((month, monthIndex) => (
                      <div
                        key={monthIndex}
                        className={`month-item ${month.status}`}
                      >
                        <span className="month-name">{month.month}</span>
                        <span className="month-status">{month.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`contract-status ${payment.contractStatus}`}>
                    {payment.contractStatus === "progress" && "계약 진행중"}
                    {payment.contractStatus === "completed" && "계약 완료"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 월별 수입 그래프 */}
        <div className="monthly-revenue-section">
          <div className="section-header">
            <h3>지난 1년간 월별 수입 현황</h3>
            <p className="section-description">계약 수락 완료된 매칭 기준</p>
          </div>
          <div className="monthly-revenue-chart">
            <div className="chart-container">
              <div className="chart-card">
                <h3>월별 수입 추이</h3>
                <div className="chart-content">
                  <div className="bar-chart">
                    {chartData.monthlyRevenue &&
                    chartData.monthlyRevenue.length > 0 &&
                    chartData.monthlyRevenue.some((item) => item.value > 0) ? (
                      chartData.monthlyRevenue.map((item, index) => (
                        <div key={index} className="bar-item">
                          <div className="bar-label">{item.label}</div>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(() => {
                                  const maxValue = Math.max(
                                    ...chartData.monthlyRevenue.map((i) =>
                                      isNaN(i.value) ? 0 : i.value
                                    )
                                  );
                                  return maxValue > 0
                                    ? (item.value / maxValue) * 100
                                    : 0;
                                })()}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                            <span className="bar-value">
                              {formatCurrency(item.value)}원
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-data-message">
                        <p>월별 수입 데이터가 없습니다.</p>
                        <p>계약 수락 완료된 매칭이 필요합니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 실제 월별 받은 수입 그래프 */}
        <div className="actual-monthly-revenue-section">
          <div className="section-header">
            <h3>지난 1년간 실제 월별 받은 수입 현황</h3>
            <p className="section-description">
              계약 수락 완료된 매칭 기준 실제 받은 수입 (수수료 차감 후)
            </p>
          </div>
          <div className="actual-monthly-revenue-chart">
            <div className="chart-container">
              <div className="chart-card">
                <h3>실제 월별 받은 수입 추이</h3>
                <div className="chart-content">
                  <div className="bar-chart">
                    {chartData.actualMonthlyRevenue &&
                    chartData.actualMonthlyRevenue.length > 0 &&
                    chartData.actualMonthlyRevenue.some(
                      (item) => item.value > 0
                    ) ? (
                      chartData.actualMonthlyRevenue.map((item, index) => (
                        <div key={index} className="bar-item">
                          <div className="bar-label">{item.label}</div>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(() => {
                                  const maxValue = Math.max(
                                    ...chartData.actualMonthlyRevenue.map((i) =>
                                      isNaN(i.value) ? 0 : i.value
                                    )
                                  );
                                  return maxValue > 0
                                    ? (item.value / maxValue) * 100
                                    : 0;
                                })()}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                            <span className="bar-value">
                              {formatCurrency(item.value)}원
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-data-message">
                        <p>실제 월별 받은 수입 데이터가 없습니다.</p>
                        <p>계약 수락 완료된 매칭이 필요합니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 선생 일당 지급 현황 */}
        <div className="salary-status-section">
          <div className="section-header">
            <h3>선생 일당 지급 현황</h3>
            <button
              className="view-all-button"
              onClick={() => window.open("/admin/salary-status", "_blank")}
            >
              전체 보기 →
            </button>
          </div>
          <div className="salary-status-summary">
            <div className="summary-card">
              <div className="summary-title">총 지급 현황</div>
              <div className="summary-content">
                <div className="summary-item">
                  <span>지급완료:</span>
                  <span className="completed-count">
                    {statistics.salaryStatus.reduce(
                      (sum, salary) =>
                        sum +
                        salary.sessions.filter((s) => s.status === "지급완료")
                          .length,
                      0
                    )}
                    회
                  </span>
                </div>
                <div className="summary-item">
                  <span>지급예정:</span>
                  <span className="pending-count">
                    {statistics.salaryStatus.reduce(
                      (sum, salary) =>
                        sum +
                        salary.sessions.filter((s) => s.status === "지급예정")
                          .length,
                      0
                    )}
                    회
                  </span>
                </div>
                <div className="summary-item">
                  <span>미지급:</span>
                  <span className="unpaid-count">
                    {statistics.salaryStatus.reduce(
                      (sum, salary) =>
                        sum +
                        salary.sessions.filter((s) => s.status === "미지급")
                          .length,
                      0
                    )}
                    회
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="salary-status-table">
            <div className="table-header">
              <div className="table-cell">쌤</div>
              <div className="table-cell">부모님</div>
              <div className="table-cell">일당</div>
              <div className="table-cell">지급 현황</div>
              <div className="table-cell">계약 상태</div>
            </div>
            {statistics.salaryStatus.map((salary, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">{salary.teacherName}</div>
                <div className="table-cell">{salary.parentName}</div>
                <div className="table-cell">
                  {formatCurrency(salary.dailyWage)}원/일
                </div>
                <div className="table-cell">
                  <div className="salary-sessions">
                    <div className="session-summary">
                      <span className="completed-sessions">
                        지급완료:{" "}
                        {
                          salary.sessions.filter((s) => s.status === "지급완료")
                            .length
                        }
                        회
                      </span>
                      <span className="pending-sessions">
                        지급예정:{" "}
                        {
                          salary.sessions.filter((s) => s.status === "지급예정")
                            .length
                        }
                        회
                      </span>
                      <span className="unpaid-sessions">
                        미지급:{" "}
                        {
                          salary.sessions.filter((s) => s.status === "미지급")
                            .length
                        }
                        회
                      </span>
                    </div>
                    <div className="session-details">
                      {salary.sessions
                        .slice(0, 5)
                        .map((session, sessionIndex) => (
                          <div
                            key={sessionIndex}
                            className={`session-item ${session.status}`}
                          >
                            <span className="session-number">
                              {session.sessionNumber}회
                            </span>
                            <span className="session-date">{session.date}</span>
                            <span className="session-status">
                              {session.status}
                            </span>
                          </div>
                        ))}
                      {salary.sessions.length > 5 && (
                        <div className="more-sessions">
                          +{salary.sessions.length - 5}회 더...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`contract-status ${salary.contractStatus}`}>
                    {salary.contractStatus === "progress" && "계약 진행중"}
                    {salary.contractStatus === "completed" && "계약 완료"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
