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

  useEffect(() => {
    if (user?.type === "admin") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();
    const allTeachers = getAllTeachers();

    // 📊 전체 통계 계산
    const overview = {
      totalMatchings: allMatchings.length,
      pendingMatchings: allMatchings.filter((m) => m.status === "pending")
        .length,
      acceptedMatchings: allMatchings.filter((m) => m.status === "accepted")
        .length,
      rejectedMatchings: allMatchings.filter((m) => m.status === "rejected")
        .length,
      totalApplications: allApplications.length,
      totalTeachers: allTeachers.length,
    };

    // 💰 수입 계산 (수락된 매칭만)
    const acceptedMatchings = allMatchings
      .filter((m) => m.status === "accepted" && m.contractStatus)
      .map((matching) => {
        // 매칭과 공고 연결
        const matchingToApplicationMap = {
          matching_001: "app_001",
          matching_002: "app_002",
          matching_003: "app_003",
          matching_004: "app_004",
          matching_005: "app_005",
          matching_006: "app_006",
          matching_007: "app_007",
          matching_008: "app_008",
          matching_009: "app_009",
          matching_010: "app_010",
          matching_011: "app_011",
          matching_012: "app_012",
        };

        const applicationId = matchingToApplicationMap[matching.id];
        const application = allApplications.find(
          (app) => app.id === applicationId
        );

        // 기본값 설정
        if (!application) {
          application = {
            payment: "시간 당 15,000 (협의가능)",
            workingHours: "오후 2시~5시",
            type: "정기 매주 월,수,금 (주3회)",
          };
        }

        // 시급 파싱
        let hourlyWage = 15000; // 기본값
        if (application?.payment) {
          // "시간 당 15,000" 형식에서 숫자 추출
          const paymentText = application.payment;

          // "시간 당" 다음에 오는 숫자 추출 (쉼표 포함)
          const timeWageMatch = paymentText.match(/시간\s*당\s*([\d,]+)/);
          if (timeWageMatch) {
            const parsedWage = parseInt(timeWageMatch[1].replace(/,/g, ""));
            if (!isNaN(parsedWage)) {
              hourlyWage = parsedWage;
            }
          } else {
            // 일반 숫자 패턴 (예: 15000)
            const numberMatch = paymentText.match(/(\d{1,3}(?:,\d{3})*)/);
            if (numberMatch) {
              const parsedWage = parseInt(numberMatch[1].replace(/,/g, ""));
              if (!isNaN(parsedWage)) {
                hourlyWage = parsedWage;
              }
            }
          }
        }

        // 근무시간 계산
        const workingHours = application?.workingHours || "오후 2시~5시";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(
          application?.type || ""
        );
        const dailyWage = hourlyWage * hoursPerSession; // 시간당 수당 × 시간
        const totalHours = hoursPerSession * sessionsPerWeek * 4; // 월 4주
        const monthlyEarnings = dailyWage * sessionsPerWeek * 4; // 일당 × 주당 횟수 × 4주
        const contractMonths = 5; // 5개월 계약
        const teacherTotalEarnings = monthlyEarnings * contractMonths;

        // 수수료 계산 (부모 5%, 쌤 5%)
        const baseAmount = teacherTotalEarnings;
        const parentCommission = baseAmount * 0.05;
        const teacherCommission = baseAmount * 0.05;
        const totalCompanyCommission = parentCommission + teacherCommission;

        const parentTotalPayment = baseAmount + parentCommission;
        const teacherActualEarnings = baseAmount - teacherCommission;

        return {
          ...matching,
          monthlyEarnings,
          teacherTotalEarnings: baseAmount,
          teacherActualEarnings,
          parentTotalPayment,
          parentCommission,
          teacherCommission,
          totalCompanyCommission,
          companyRevenue: totalCompanyCommission,
          hourlyWage,
          application,
          workingHours,
          hoursPerSession,
          sessionsPerWeek,
          totalHours,
          contractMonths,
        };
      });

    const revenue = {
      totalTeacherEarnings: acceptedMatchings.reduce(
        (sum, m) => sum + m.teacherActualEarnings,
        0
      ),
      totalParentPayment: acceptedMatchings.reduce(
        (sum, m) => sum + m.parentTotalPayment,
        0
      ),
      totalCompanyRevenue: acceptedMatchings.reduce(
        (sum, m) => sum + m.totalCompanyCommission,
        0
      ),
      averageHourlyWage:
        acceptedMatchings.length > 0
          ? acceptedMatchings.reduce((sum, m) => sum + m.hourlyWage, 0) /
            acceptedMatchings.length
          : 0,
    };

    // 📋 계약 현황
    const contracts = {
      progress: acceptedMatchings.filter((m) => m.contractStatus === "progress")
        .length,
      completed: acceptedMatchings.filter(
        (m) => m.contractStatus === "completed"
      ).length,
      progressEarnings: acceptedMatchings
        .filter((m) => m.contractStatus === "progress")
        .reduce((sum, m) => sum + m.teacherActualEarnings, 0),
      completedEarnings: acceptedMatchings
        .filter((m) => m.contractStatus === "completed")
        .reduce((sum, m) => sum + m.teacherActualEarnings, 0),
    };

    // 💳 부모 입금 현황
    const payments = acceptedMatchings.map((matching) => {
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
          status: i === 1 ? "입금완료" : i === 2 ? "입금예정" : "미입금",
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

    // 💸 쌤 급여 지급 현황
    const salaries = acceptedMatchings.map((matching) => {
      const dailyWage = matching.hourlyWage * matching.hoursPerSession;
      const weeklySessions = matching.sessionsPerWeek;
      const monthlySalary = dailyWage * weeklySessions * 4;
      const totalSessions =
        matching.sessionsPerWeek * matching.contractMonths * 4;

      const sessions = [];
      for (let i = 1; i <= totalSessions; i++) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + (i - 1) * 2);

        sessions.push({
          sessionNumber: i,
          date: sessionDate.toLocaleDateString("ko-KR"),
          dailyWage: dailyWage,
          status: i <= 8 ? "지급완료" : i <= 12 ? "지급예정" : "미지급",
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

    setDashboardData({
      overview,
      revenue,
      contracts,
      matchings: acceptedMatchings,
      payments,
      salaries,
    });
  };

  const calculateHoursFromWorkingHours = (workingHours) => {
    if (!workingHours) return 3;

    const afternoonMatch = workingHours.match(/오후\s*(\d+)시~(\d+)시/);
    if (afternoonMatch) {
      const startHour = parseInt(afternoonMatch[1]) + 12;
      const endHour = parseInt(afternoonMatch[2]) + 12;
      return endHour - startHour;
    }

    const morningMatch = workingHours.match(/오전\s*(\d+)시~(\d+)시/);
    if (morningMatch) {
      const startHour = parseInt(morningMatch[1]);
      const endHour = parseInt(morningMatch[2]);
      return endHour - startHour;
    }

    const simpleMatch = workingHours.match(/(\d+)시~(\d+)시/);
    if (simpleMatch) {
      const startHour = parseInt(simpleMatch[1]);
      const endHour = parseInt(simpleMatch[2]);
      return endHour - startHour;
    }

    return 3;
  };

  const calculateSessionsPerWeek = (type) => {
    if (!type) return 3;

    if (type.includes("주5회")) return 5;
    if (type.includes("주3회")) return 3;
    if (type.includes("주2회")) return 2;
    if (type.includes("주1회")) return 1;

    return 3;
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === undefined || amount === null) {
      return "0원";
    }
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
        {/* 📋 대시보드 헤더 */}
        <div className="dashboard-header">
          <h1>관리자 대시보드</h1>
          <p>전체 매칭 현황 및 통계</p>
        </div>

        {/* 📊 주요 통계 카드 */}
        <div className="statistics-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>전체 매칭</h3>
              <p className="stat-number">
                {dashboardData.overview.totalMatchings}
              </p>
              <p className="stat-description">총 매칭 요청 수</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>수락된 매칭</h3>
              <p className="stat-number">
                {dashboardData.overview.acceptedMatchings}
              </p>
              <p className="stat-description">성공적으로 매칭됨</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>대기중인 매칭</h3>
              <p className="stat-number">
                {dashboardData.overview.pendingMatchings}
              </p>
              <p className="stat-description">응답 대기중</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>거절된 매칭</h3>
              <p className="stat-number">
                {dashboardData.overview.rejectedMatchings}
              </p>
              <p className="stat-description">매칭 거절됨</p>
            </div>
          </div>
        </div>

        {/* 💰 수입 통계 */}
        <div className="revenue-section">
          <h3>💰 수입 통계</h3>
          <div className="revenue-grid">
            <div className="revenue-card">
              <h4>부모 지출</h4>
              <p className="revenue-amount">
                {formatCurrency(dashboardData.revenue.totalParentPayment)}
              </p>
              <p className="revenue-description">부모 수수료 5% 포함</p>
            </div>
            <div className="revenue-card">
              <h4>쌤 수입</h4>
              <p className="revenue-amount">
                {formatCurrency(dashboardData.revenue.totalTeacherEarnings)}
              </p>
              <p className="revenue-description">쌤 수수료 5% 차감</p>
            </div>
            <div className="revenue-card">
              <h4>회사 수입</h4>
              <p className="revenue-amount">
                {formatCurrency(dashboardData.revenue.totalCompanyRevenue)}
              </p>
              <p className="revenue-description">총 수수료 10%</p>
            </div>
          </div>
        </div>

        {/* 📋 계약 현황 */}
        <div className="contract-section">
          <h3>📋 계약 현황</h3>
          <div className="contract-grid">
            <div className="contract-card">
              <h4>계약 완료</h4>
              <p className="contract-number">
                {dashboardData.contracts.completed}
              </p>
              <p className="contract-amount">
                {formatCurrency(dashboardData.contracts.completedEarnings)}
              </p>
            </div>
            <div className="contract-card">
              <h4>계약 진행중</h4>
              <p className="contract-number">
                {dashboardData.contracts.progress}
              </p>
              <p className="contract-amount">
                {formatCurrency(dashboardData.contracts.progressEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* 👥 사용자 통계 */}
        <div className="users-section">
          <h3>👥 사용자 통계</h3>
          <div className="users-grid">
            <div className="user-card">
              <div className="user-icon">📝</div>
              <div className="user-content">
                <h4>전체 공고</h4>
                <p className="user-number">
                  {dashboardData.overview.totalApplications}
                </p>
              </div>
            </div>
            <div className="user-card">
              <div className="user-icon">👨‍🏫</div>
              <div className="user-content">
                <h4>등록된 쌤</h4>
                <p className="user-number">
                  {dashboardData.overview.totalTeachers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 매칭 상세 정보 */}
        <div className="matchings-section">
          <h3>📊 매칭 상세 정보</h3>
          <div className="matchings-table">
            <div className="table-header">
              <div className="table-cell">쌤 이름</div>
              <div className="table-cell">시급</div>
              <div className="table-cell">수업일수</div>
              <div className="table-cell">총 수입</div>
              <div className="table-cell">계약 상태</div>
            </div>
            {dashboardData.matchings.map((matching, index) => {
              const totalSessions =
                matching.sessionsPerWeek * 4 * matching.contractMonths;

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
                    {formatCurrency(matching.dailyWage)}원/일
                    <div className="wage-breakdown">
                      <small>
                        ({formatCurrency(matching.hourlyWage)}원/시간 ×{" "}
                        {matching.hoursPerSession}시간)
                      </small>
                    </div>
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
                    <span
                      className={`contract-status ${matching.contractStatus}`}
                    >
                      {matching.contractStatus === "progress" && "계약 진행중"}
                      {matching.contractStatus === "completed" && "계약 완료"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💳 부모 입금 현황 */}
        <div className="payment-section">
          <div className="section-header">
            <h3>💳 부모 입금 현황</h3>
            <Link
              to="/admin/payment-status"
              className="view-all-button"
              target="_blank"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="payment-summary">
            <div className="summary-card">
              <div className="summary-title">입금 현황 요약</div>
              <div className="summary-content">
                <div className="summary-item">
                  <span>입금완료:</span>
                  <span className="completed-count">
                    {dashboardData.payments.reduce(
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
                    {dashboardData.payments.reduce(
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
                    {dashboardData.payments.reduce(
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
          <div className="payment-table">
            <div className="table-header">
              <div className="table-cell">부모님</div>
              <div className="table-cell">쌤</div>
              <div className="table-cell">월별 입금액</div>
              <div className="table-cell">총 입금액</div>
            </div>
            {dashboardData.payments.map((payment, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">{payment.parentName}</div>
                <div className="table-cell">{payment.teacherName}</div>
                <div className="table-cell">
                  {formatCurrency(payment.monthlyAmount)}원/월
                </div>
                <div className="table-cell">
                  {formatCurrency(
                    payment.monthlyAmount * payment.months.length
                  )}
                  원
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 💸 쌤 급여 지급 현황 */}
        <div className="salary-section">
          <div className="section-header">
            <h3>💸 쌤 급여 지급 현황</h3>
            <Link
              to="/admin/salary-status"
              className="view-all-button"
              target="_blank"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="salary-summary">
            <div className="summary-card">
              <div className="summary-title">지급 현황 요약</div>
              <div className="summary-content">
                <div className="summary-item">
                  <span>지급완료:</span>
                  <span className="completed-count">
                    {dashboardData.salaries.reduce(
                      (sum, salary) =>
                        sum +
                        salary.sessions.filter((s) => s.status === "지급완료")
                          .length,
                      0
                    )}
                    회
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="salary-table">
            <div className="table-header">
              <div className="table-cell">쌤</div>
              <div className="table-cell">부모님</div>
              <div className="table-cell">일당</div>
              <div className="table-cell">총 급여</div>
            </div>
            {dashboardData.salaries.map((salary, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">{salary.teacherName}</div>
                <div className="table-cell">{salary.parentName}</div>
                <div className="table-cell">
                  {formatCurrency(salary.dailyWage)}원/일
                </div>
                <div className="table-cell">
                  {formatCurrency(salary.totalSalary)}원
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📈 최근 매칭 현황 */}
        <div className="recent-matchings">
          <h3>📈 최근 매칭 현황</h3>
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
      </div>
    </div>
  );
}

export default AdminDashboard;
