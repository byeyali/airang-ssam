import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import "./ParentPaymentHistory.css";

function ParentPaymentHistory() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getAllApplications } = useApplication();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    totalPayments: 0,
    thisMonthSpent: 0,
    thisMonthPayments: 0,
    remainingBalance: 0, // 잔액 추가
  });

  useEffect(() => {
    if (user && user.type === "parent") {
      loadParentPaymentData();
    }
  }, [user]);

  const loadParentPaymentData = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();

    // 부모의 매칭만 필터링
    const parentMatchings = allMatchings.filter(
      (matching) => matching.parentId === user.id
    );

    const history = [];
    let totalSpent = 0;
    let totalPayments = 0;
    let thisMonthSpent = 0;
    let thisMonthPayments = 0;
    let totalRemainingBalance = 0; // 총 잔액
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    parentMatchings.forEach((matching) => {
      const application = allApplications.find(
        (app) => app.id === matching.applicationId
      );

      if (application) {
        // 시간당 수당 파싱 - "시간 당 18,000 (협의가능)" 형식에서 숫자 추출
        const hourlyWageMatch =
          application.payment.match(/(\d{1,3}(?:,\d{3})*)/);
        const hourlyWage = hourlyWageMatch
          ? parseInt(hourlyWageMatch[1].replace(/,/g, ""))
          : 0;

        // 근무 시간 파싱 - "오후 2시~5시" 형식에서 시간 차이 계산
        const timeMatch = application.workingHours.match(/(\d+)시~(\d+)시/);
        let hoursPerSession = 3; // 기본값
        if (timeMatch) {
          const startHour = parseInt(timeMatch[1]);
          const endHour = parseInt(timeMatch[2]);
          hoursPerSession = endHour - startHour;
        }

        // 주당 세션 수 계산 - "정기 매주 월,수,금 (주3회)" 형식에서 추출
        const sessionsPerWeekMatch = application.type.match(/주(\d+)회/);
        const sessionsPerWeek = sessionsPerWeekMatch
          ? parseInt(sessionsPerWeekMatch[1])
          : 1;

        // 월 예상 지출 계산
        const monthlyExpected =
          hourlyWage * hoursPerSession * sessionsPerWeek * 4; // 4주 기준

        // 실제 지출 시뮬레이션 (계약 완료된 매칭만)
        if (matching.contractStatus === "completed") {
          // 실제 지출 데이터 생성 (예시)
          const paymentDate = new Date(2024, 0, 15); // 1월 15일 지급
          const totalAmount = monthlyExpected; // 부모가 회사에 낸 전체 금액
          const teacherPayment = monthlyExpected * 0.95; // 쌤에게 지불된 금액 (수수료 5% 차감)
          const commission = monthlyExpected * 0.05; // 회사 수수료
          const remainingBalance = 0; // 잔액 (이번 달은 0원)

          const paymentRecord = {
            id: `payment_${matching.id}`,
            date: paymentDate.toLocaleDateString("ko-KR"),
            teacherName: matching.teacherName,
            totalAmount: totalAmount, // 부모가 회사에 낸 전체 금액
            teacherPayment: teacherPayment, // 쌤에게 지불된 금액
            commission: commission, // 회사 수수료
            remainingBalance: remainingBalance, // 잔액
            status: "지급완료",
            matchingId: matching.id,
          };

          history.push(paymentRecord);
          totalSpent += totalAmount; // 부모가 회사에 낸 전체 금액
          totalPayments++;
          totalRemainingBalance += paymentRecord.remainingBalance; // 잔액 누적

          // 이번 달 지출 계산
          if (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear
          ) {
            thisMonthSpent += totalAmount; // 부모가 회사에 낸 전체 금액
            thisMonthPayments++;
          }
        }
      }
    });

    setPaymentHistory(
      history.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    setSummary({
      totalSpent,
      totalPayments,
      thisMonthSpent,
      thisMonthPayments,
      remainingBalance: totalRemainingBalance,
    });

    // 잔액이 0원일 때 충전 안내 콘솔 출력
    if (totalRemainingBalance === 0 && totalSpent > 0) {
      console.log("💰 충전 안내 💰");
      console.log("현재 잔액이 0원입니다.");
      console.log("새로운 매칭을 위해 회사 계좌로 충전해주세요.");
      console.log("충전 계좌: 신한은행 123-456-789012");
      console.log("예금주: (주)아이랑쌤");
    }
  };

  if (!user || user.type !== "parent") {
    return (
      <div className="parent-payment-history-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>부모 회원만 이용할 수 있는 서비스입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-payment-history-page">
      <div className="payment-history-container">
        <div className="payment-history-header">
          <h1>내 지출 내역</h1>
          <p>매칭을 통해 지출한 내역을 확인하세요</p>
        </div>

        {/* 요약 카드 */}
        <div className="payment-summary-cards">
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h3>총 지출액</h3>
              <p className="summary-amount">
                {summary.totalSpent.toLocaleString()}원
              </p>
              <span className="summary-detail">
                총 {summary.totalPayments}건
              </span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📅</div>
            <div className="summary-content">
              <h3>이번 달 지출</h3>
              <p className="summary-amount">
                {summary.thisMonthSpent.toLocaleString()}원
              </p>
              <span className="summary-detail">
                {summary.thisMonthPayments}건
              </span>
            </div>
          </div>
          <div
            className={`summary-card ${
              summary.remainingBalance === 0 ? "low-balance" : ""
            }`}
            onClick={() => {
              if (summary.remainingBalance === 0) {
                navigate("/parent/recharge");
              }
            }}
            style={{
              cursor: summary.remainingBalance === 0 ? "pointer" : "default",
            }}
          >
            <div className="summary-icon">
              {summary.remainingBalance === 0 ? "⚠️" : "💳"}
            </div>
            <div className="summary-content">
              <h3>현재 잔액</h3>
              <p
                className={`summary-amount ${
                  summary.remainingBalance === 0 ? "low-balance-text" : ""
                }`}
              >
                {summary.remainingBalance.toLocaleString()}원
              </p>
              <span className="summary-detail">
                {summary.remainingBalance === 0 ? "충전 필요" : "충전 완료"}
              </span>
            </div>
          </div>
        </div>

        {/* 지출 내역 테이블 */}
        <div className="payment-history-section">
          <h2>지출 상세 내역</h2>
          {paymentHistory.length > 0 ? (
            <div className="payment-history-table">
              <div className="table-header">
                <div className="table-cell">지급일</div>
                <div className="table-cell">선생님</div>
                <div className="table-cell">전체 금액</div>
                <div className="table-cell">쌤 지급액</div>
                <div className="table-cell">회사 수수료</div>
                <div className="table-cell">잔액</div>
                <div className="table-cell">상태</div>
              </div>
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="table-row">
                  <div className="table-cell">{payment.date}</div>
                  <div className="table-cell">{payment.teacherName}</div>
                  <div className="table-cell">
                    {payment.totalAmount.toLocaleString()}원
                  </div>
                  <div className="table-cell">
                    {payment.teacherPayment.toLocaleString()}원
                  </div>
                  <div className="table-cell">
                    {payment.commission.toLocaleString()}원
                  </div>
                  <div className="table-cell">
                    {payment.remainingBalance.toLocaleString()}원
                  </div>
                  <div className="table-cell">
                    <span className="status-completed">{payment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-payment-history">
              <div className="no-payment-icon">💳</div>
              <h3>아직 지출 내역이 없습니다</h3>
              <p>
                매칭을 통해 선생님과 계약을 완료하면 지출 내역이 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentPaymentHistory;
