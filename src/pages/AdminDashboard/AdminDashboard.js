import React, { useState, useEffect } from "react";
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
        // 매칭 ID에 따라 공고 찾기
        let application;
        if (matching.id === "matching_002") {
          // 계약 진행중 - 박민수 쌤
          application = allApplications.find((app) => app.id === "app_002");
        } else if (matching.id === "matching_003") {
          // 계약 완료 - 이수진 쌤
          application = allApplications.find((app) => app.id === "app_003");
        } else if (matching.id === "matching_005") {
          // 박민수 쌤의 두 번째 매칭
          application = allApplications.find((app) => app.id === "app_007");
        } else {
          // 기타 매칭들
          application = allApplications.find(
            (app) => app.id === matching.applicationId
          );
        }

        // 시급 파싱 개선
        let hourlyWage = 0;
        if (application?.payment) {
          // 쉼표가 있는 숫자 패턴 (예: 20,000)
          const commaMatch = application.payment.match(/\d{1,3}(?:,\d{3})*/);
          if (commaMatch) {
            hourlyWage = parseInt(commaMatch[0].replace(/,/g, ""));
          } else {
            // 일반 숫자 패턴 (예: 20000)
            const numberMatch = application.payment.match(/\d+/);
            if (numberMatch) {
              hourlyWage = parseInt(numberMatch[0]);
            }
          }
        }
        const workingHours = application?.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(
          application?.type || ""
        );
        const totalHours = hoursPerSession * sessionsPerWeek * 4; // 월 4주
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
    setChartData({
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
    });
  };

  const calculateHoursFromWorkingHours = (workingHours) => {
    if (!workingHours) return 0;
    const match = workingHours.match(/(\d+)시~(\d+)시/);
    if (match) {
      const startHour = parseInt(match[1]);
      const endHour = parseInt(match[2]);
      return endHour - startHour;
    }
    return 3;
  };

  const calculateSessionsPerWeek = (type) => {
    if (!type) return 0;
    if (type.includes("주5회")) return 5;
    if (type.includes("주3회")) return 3;
    if (type.includes("주2회")) return 2;
    if (type.includes("주1회")) return 1;
    return 2;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
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

        {/* 차트 및 상세 통계 */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-card">
              <h3>매칭 상태 분포</h3>
              <div className="chart-content">
                <div className="pie-chart">
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
                          {item.label}: {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-card">
              <h3>계약 현황</h3>
              <div className="contract-stats">
                <div className="contract-item">
                  <div className="contract-number">
                    {statistics.contractProgress}
                  </div>
                  <div className="contract-label">계약 진행중</div>
                </div>
                <div className="contract-item">
                  <div className="contract-number">
                    {statistics.contractCompleted}
                  </div>
                  <div className="contract-label">계약 완료</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수입 통계 */}
        <div className="earnings-section">
          <div className="earnings-card">
            <h3>수입 통계</h3>
            <div className="earnings-grid">
              <div className="earnings-item">
                <div className="earnings-label">부모 총 지불액</div>
                <div className="earnings-value">
                  {formatCurrency(statistics.totalParentPayment)}원
                </div>
                <div className="earnings-detail">
                  계약 진행중:{" "}
                  {formatCurrency(
                    statistics.contractProgressEarnings +
                      statistics.contractProgressEarnings * 0.05
                  )}
                  원
                  <br />
                  계약 완료:{" "}
                  {formatCurrency(
                    statistics.contractCompletedEarnings +
                      statistics.contractCompletedEarnings * 0.05
                  )}
                  원
                </div>
              </div>
              <div className="earnings-item">
                <div className="earnings-label">총 쌤 수당</div>
                <div className="earnings-value">
                  {formatCurrency(statistics.totalTeacherEarnings)}원
                </div>
                <div className="earnings-detail">
                  쌤이 실제 받는 수당 (수수료 차감 후)
                </div>
              </div>
              <div className="earnings-item">
                <div className="earnings-label">회사 수입</div>
                <div className="earnings-value">
                  {formatCurrency(statistics.totalCompanyRevenue)}원
                </div>
                <div className="earnings-detail">
                  부모 수수료 + 쌤 수수료 (각 5%)
                </div>
              </div>
              <div className="earnings-item">
                <div className="earnings-label">평균 시급</div>
                <div className="earnings-value">
                  {formatCurrency(Math.round(statistics.averageHourlyWage))}원
                </div>
                <div className="earnings-detail">수락된 매칭 기준</div>
              </div>
            </div>

            {/* 쌤별 상세 수입 정보 */}
            <div className="earnings-details">
              <h4>쌤별 수입 상세</h4>
              <div className="earnings-table">
                <div className="table-header">
                  <div className="table-cell">쌤 이름</div>
                  <div className="table-cell">시급</div>
                  <div className="table-cell">월 근무시간</div>
                  <div className="table-cell">계약기간</div>
                  <div className="table-cell">기본 수당</div>
                  <div className="table-cell">쌤 실제 수당</div>
                  <div className="table-cell">부모 지불액</div>
                  <div className="table-cell">회사 수입</div>
                </div>
                {statistics.acceptedMatchingsWithEarnings.map(
                  (matching, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell">
                        <div className="teacher-name">
                          {matching.teacherName}
                        </div>
                        <div className="teacher-status">
                          {matching.contractStatus === "progress" &&
                            "계약 진행중"}
                          {matching.contractStatus === "completed" &&
                            "계약 완료"}
                        </div>
                      </div>
                      <div className="table-cell">
                        {formatCurrency(matching.hourlyWage)}원/시간
                      </div>
                      <div className="table-cell">
                        {matching.totalHours}시간/월
                        <br />
                        <small>
                          ({matching.hoursPerSession}시간 ×{" "}
                          {matching.sessionsPerWeek}회 × 4주)
                        </small>
                      </div>
                      <div className="table-cell">
                        {matching.contractMonths}개월
                      </div>
                      <div className="table-cell earnings-total">
                        {formatCurrency(matching.teacherTotalEarnings)}원
                      </div>
                      <div className="table-cell teacher-actual">
                        {formatCurrency(matching.teacherActualEarnings)}원
                      </div>
                      <div className="table-cell parent-payment">
                        {formatCurrency(matching.parentTotalPayment)}원
                      </div>
                      <div className="table-cell company-revenue">
                        {formatCurrency(matching.companyRevenue)}원
                      </div>
                    </div>
                  )
                )}
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
