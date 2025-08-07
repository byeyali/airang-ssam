import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import "./PaymentHistoryPage.css";

function PaymentHistoryPage() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getAllApplications } = useApplication();

  const [myPayments, setMyPayments] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    if (user?.type === "parent") {
      loadMyPayments();
    }
  }, [user]);

  const loadMyPayments = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();

    // 관리자는 모든 부모의 매칭을, 부모는 자신의 매칭만 필터링
    const myMatchings = allMatchings.filter(
      (matching) =>
        (user.type === "admin" || matching.parentId === user.id) &&
        matching.status === "accepted"
    );

    const paymentData = myMatchings
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

        if (!application) return null;

        // 시급 계산
        let hourlyWage = 0;
        if (application.payment) {
          const paymentText = application.payment;
          const numberMatch = paymentText.match(/\d{1,3}(?:,\d{3})*/);
          if (numberMatch) {
            hourlyWage = parseInt(numberMatch[0].replace(/,/g, ""));
          }
        }

        if (hourlyWage === 0) {
          hourlyWage = 15000;
        }

        // 근무시간 계산
        const workingHours = application.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(application.type);
        const totalHours = hoursPerSession * sessionsPerWeek * 4;
        const monthlyEarnings = hourlyWage * totalHours;
        const contractMonths = 5;
        const teacherTotalEarnings = monthlyEarnings * contractMonths;
        const parentCommission = teacherTotalEarnings * 0.05;
        const parentTotalPayment = teacherTotalEarnings + parentCommission;

        return {
          ...matching,
          application,
          hourlyWage,
          hoursPerSession,
          sessionsPerWeek,
          totalHours,
          monthlyEarnings,
          contractMonths,
          teacherTotalEarnings,
          parentCommission,
          parentTotalPayment,
          teacherName: matching.teacherName,
          contractStatus: matching.contractStatus,
          createdAt: matching.createdAt,
        };
      })
      .filter(Boolean);

    setMyPayments(paymentData);

    const total = paymentData.reduce(
      (sum, item) => sum + item.parentTotalPayment,
      0
    );
    const totalCommissionAmount = paymentData.reduce(
      (sum, item) => sum + item.parentCommission,
      0
    );

    setTotalPayment(total);
    setTotalCommission(totalCommissionAmount);
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
    return amount.toLocaleString("ko-KR");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  if (!user || (user.type !== "parent" && user.type !== "admin")) {
    return (
      <div className="payment-history-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>부모 계정 또는 관리자 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <div className="payment-history-container">
        <div className="page-header">
          <h1>{user.type === "admin" ? "부모별 지출 내역" : "내 지출 내역"}</h1>
          <p>
            {user.type === "admin"
              ? "전체 부모의 지출 현황"
              : `${user.name} 부모님의 지출 현황`}
          </p>
        </div>

        {/* 지출 요약 */}
        <div className="payment-summary">
          <div className="summary-card">
            <h3>💰 지출 요약</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">총 지출액</span>
                <span className="summary-value">
                  {formatCurrency(totalPayment)}원
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">쌤 수당</span>
                <span className="summary-value">
                  {formatCurrency(totalPayment - totalCommission)}원
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">수수료</span>
                <span className="summary-value">
                  {formatCurrency(totalCommission)}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 지출 상세 테이블 */}
        <div className="payment-details">
          <h3>📊 지출 상세 내역</h3>
          <div className="payment-table">
            <div className="table-header">
              <div className="table-cell">계약 정보</div>
              <div className="table-cell">시급</div>
              <div className="table-cell">근무시간</div>
              <div className="table-cell">월 수당</div>
              <div className="table-cell">계약 기간</div>
              <div className="table-cell">쌤 수당</div>
              <div className="table-cell">수수료</div>
              <div className="table-cell">총 지출액</div>
              <div className="table-cell">계약 상태</div>
            </div>
            {myPayments.map((payment, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">
                  <div className="contract-info">
                    <div className="teacher-name">{payment.teacherName} 쌤</div>
                    <div className="contract-date">
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  {formatCurrency(payment.hourlyWage)}원/시간
                </div>
                <div className="table-cell">
                  <div className="hours-info">
                    <span>{payment.totalHours}시간/월</span>
                    <small>
                      ({payment.hoursPerSession}시간 × {payment.sessionsPerWeek}
                      회 × 4주)
                    </small>
                  </div>
                </div>
                <div className="table-cell">
                  {formatCurrency(payment.monthlyEarnings)}원/월
                </div>
                <div className="table-cell">{payment.contractMonths}개월</div>
                <div className="table-cell teacher-earnings">
                  {formatCurrency(payment.teacherTotalEarnings)}원
                </div>
                <div className="table-cell commission">
                  {formatCurrency(payment.parentCommission)}원
                </div>
                <div className="table-cell total-payment">
                  {formatCurrency(payment.parentTotalPayment)}원
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${payment.contractStatus}`}>
                    {payment.contractStatus === "completed"
                      ? "계약 완료"
                      : "계약 진행중"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {myPayments.length === 0 && (
          <div className="no-data">
            <p>아직 지출 내역이 없습니다.</p>
            <p>매칭이 완료되면 지출 내역이 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistoryPage;
