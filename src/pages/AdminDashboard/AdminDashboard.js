import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useAdminDashboard } from "../../contexts/AdminDashboardContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useUser();
  const { dashboardData } = useAdminDashboard();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.type === "admin") {
      // 데이터 로딩 시뮬레이션
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR");
  };

  if (!user || user.type !== "admin") {
    return (
      <div className="admin-dashboard-page">
        <div className="login-required">
          <h2>관리자만 접근 가능합니다</h2>
          <p>관리자로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <h1>관리자 대시보드</h1>
          <p>전체 현황을 한눈에 확인하세요</p>
        </div>

        {/* 📊 전체 통계 */}
        <div className="overview-section">
          <h3>📊 전체 통계</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👨‍👩‍👧‍👦</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.totalParents}
                </div>
                <div className="stat-label">전체 부모님</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.totalApplications}
                </div>
                <div className="stat-label">전체 공고</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.totalTeachers}
                </div>
                <div className="stat-label">전체 쌤</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.totalAcceptedMatchings}
                </div>
                <div className="stat-label">전체 매칭 완료</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.totalCompletedContracts}
                </div>
                <div className="stat-label">전체 계약 완료</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.pendingMatchings}
                </div>
                <div className="stat-label">진행 중 매칭</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-value">
                  {dashboardData.overview.progressContracts}
                </div>
                <div className="stat-label">진행 중 계약</div>
              </div>
            </div>
          </div>
        </div>

        {/* 💰 수입 통계 */}
        <div className="revenue-section">
          <h3>💰 수입 통계</h3>
          <div className="revenue-grid">
            <div className="revenue-card">
              <div className="revenue-icon">💳</div>
              <div className="revenue-content">
                <div className="revenue-value">
                  {formatCurrency(dashboardData.revenue.totalParentPayment)}원
                </div>
                <div className="revenue-label">부모님 총 결제</div>
              </div>
            </div>
            <div className="revenue-card">
              <div className="revenue-icon">💰</div>
              <div className="revenue-content">
                <div className="revenue-value">
                  {formatCurrency(dashboardData.revenue.totalTeacherEarnings)}원
                </div>
                <div className="revenue-label">쌤 총 수입</div>
              </div>
            </div>
            <div className="revenue-card">
              <div className="revenue-icon">🏢</div>
              <div className="revenue-content">
                <div className="revenue-value">
                  {formatCurrency(dashboardData.revenue.totalCompanyRevenue)}원
                </div>
                <div className="revenue-label">회사 수익</div>
              </div>
            </div>
            <div className="revenue-card">
              <div className="revenue-icon">📅</div>
              <div className="revenue-content">
                <div className="revenue-value">
                  {formatCurrency(dashboardData.revenue.monthlyRevenue)}원
                </div>
                <div className="revenue-label">이번 달 수익</div>
              </div>
            </div>
            <div className="revenue-card">
              <div className="revenue-icon">⏰</div>
              <div className="revenue-content">
                <div className="revenue-value">
                  {formatCurrency(dashboardData.revenue.averageHourlyWage)}원
                </div>
                <div className="revenue-label">평균 시급</div>
              </div>
            </div>
            <div className="revenue-card">
              <div className="revenue-icon">📊</div>
              <div className="revenue-content">
                <div className="revenue-value">
                  {dashboardData.revenue.monthlyMatchings}건
                </div>
                <div className="revenue-label">이번 달 매칭</div>
              </div>
            </div>
          </div>
        </div>

        {/* 📋 계약 현황 */}
        <div className="contracts-section">
          <h3>📋 계약 현황</h3>
          <div className="contracts-grid">
            <div className="contract-card">
              <div className="contract-icon">🔄</div>
              <div className="contract-content">
                <div className="contract-value">
                  {dashboardData.contracts.progress}
                </div>
                <div className="contract-label">계약 진행중</div>
                <div className="contract-amount">
                  {formatCurrency(dashboardData.contracts.progressEarnings)}원
                </div>
              </div>
            </div>
            <div className="contract-card">
              <div className="contract-icon">✅</div>
              <div className="contract-content">
                <div className="contract-value">
                  {dashboardData.contracts.completed}
                </div>
                <div className="contract-label">계약 완료</div>
                <div className="contract-amount">
                  {formatCurrency(dashboardData.contracts.completedEarnings)}원
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 계약 상세 정보 */}
        <div className="matchings-section">
          <h3>📊 계약 상세 정보</h3>
          <div className="matchings-table">
            <div className="table-header">
              <div className="table-cell">날짜</div>
              <div className="table-cell">부모님</div>
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
                    {formatDate(matching.contractDate)}
                  </div>
                  <div className="table-cell">{matching.parentName}</div>
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
                    {totalSessions}일
                    <div className="sessions-breakdown">
                      <small>
                        (주 {matching.sessionsPerWeek}회 ×{" "}
                        {matching.contractMonths}개월)
                      </small>
                    </div>
                  </div>
                  <div className="table-cell">
                    {formatCurrency(matching.totalEarnings)}원
                    <div className="earnings-breakdown">
                      <small>
                        (총 {totalSessions}일 ×{" "}
                        {formatCurrency(matching.dailyWage)}원)
                      </small>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span
                      className={`status-dot ${matching.contractStatus}`}
                    ></span>
                    {matching.contractStatus === "progress" && "계약 진행중"}
                    {matching.contractStatus === "completed" && "계약 완료"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💳 결제 현황 요약 */}
        <div className="payment-summary-section">
          <h3>💳 결제 현황 요약</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">✅</div>
              <div className="summary-content">
                <div className="summary-value">
                  {dashboardData.completedPayments}건
                </div>
                <div className="summary-label">완료된 결제</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⏳</div>
              <div className="summary-content">
                <div className="summary-value">
                  {dashboardData.pendingPayments}건
                </div>
                <div className="summary-label">대기 중 결제</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <div className="summary-value">
                  {formatCurrency(dashboardData.totalPaymentAmount)}원
                </div>
                <div className="summary-label">총 결제 금액</div>
              </div>
            </div>
          </div>
        </div>

        {/* 💸 급여 현황 요약 */}
        <div className="salary-summary-section">
          <h3>💸 급여 현황 요약</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">✅</div>
              <div className="summary-content">
                <div className="summary-value">
                  {dashboardData.paidSalaries}건
                </div>
                <div className="summary-label">지급 완료</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⏳</div>
              <div className="summary-content">
                <div className="summary-value">
                  {dashboardData.pendingSalaries}건
                </div>
                <div className="summary-label">지급 대기</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <div className="summary-value">
                  {formatCurrency(dashboardData.totalSalaryAmount)}원
                </div>
                <div className="summary-label">총 급여 금액</div>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ 리뷰 현황 */}
        <div className="reviews-section">
          <h3>⭐ 리뷰 현황</h3>
          <div className="reviews-summary">
            <div className="reviews-stats">
              <div className="review-stat">
                <div className="stat-number">
                  {dashboardData.overview.totalReviews}개
                </div>
                <div className="stat-label">전체 리뷰</div>
              </div>
              <div className="review-stat">
                <div className="stat-number">
                  {dashboardData.overview.averageRating}점
                </div>
                <div className="stat-label">평균 평점</div>
              </div>
            </div>
            <div className="reviews-list">
              {dashboardData.reviews?.slice(0, 3).map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="review-rating">
                      {"⭐".repeat(review.rating)}
                    </div>
                    <div className="review-date">{formatDate(review.date)}</div>
                  </div>
                  <div className="review-content">
                    <div className="review-names">
                      {review.parentName} → {review.teacherName}
                    </div>
                    <div className="review-comment">{review.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📞 문의 현황 */}
        <div className="inquiries-section">
          <h3>📞 문의 현황</h3>
          <div className="inquiries-summary">
            <div className="inquiries-stats">
              <div className="inquiry-stat">
                <div className="stat-number">
                  {dashboardData.overview.totalInquiries}건
                </div>
                <div className="stat-label">전체 문의</div>
              </div>
              <div className="inquiry-stat">
                <div className="stat-number">
                  {dashboardData.inquiries?.filter(
                    (i) => i.status === "answered"
                  ).length || 0}
                  건
                </div>
                <div className="stat-label">답변 완료</div>
              </div>
            </div>
            <div className="inquiries-list">
              {dashboardData.inquiries?.slice(0, 3).map((inquiry, index) => (
                <div key={index} className="inquiry-item">
                  <div className="inquiry-header">
                    <div className="inquiry-subject">{inquiry.subject}</div>
                    <div className="inquiry-status">
                      <span className={`status-dot ${inquiry.status}`}></span>
                      {inquiry.status === "answered" && "답변완료"}
                      {inquiry.status === "pending" && "답변대기"}
                    </div>
                  </div>
                  <div className="inquiry-content">
                    <div className="inquiry-names">{inquiry.parentName}</div>
                    <div className="inquiry-message">{inquiry.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
