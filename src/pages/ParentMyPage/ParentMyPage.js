import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useApplication } from "../../contexts/ApplicationContext";
import { useMatching } from "../../contexts/MatchingContext";
import "./ParentMyPage.css";

function ParentMyPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { getAllApplications } = useApplication();
  const { getMatchingRequestsForParent } = useMatching();
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [matchings, setMatchings] = useState([]);
  const [payments, setPayments] = useState([]);

  // 공고 상태 토글 함수
  const toggleApplicationStatus = (applicationId) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === applicationId
          ? { ...app, status: app.status === "active" ? "inactive" : "active" }
          : app
      )
    );
  };

  // 결제 내역 데이터 생성 함수
  const generatePaymentData = () => {
    const allMatchings = getMatchingRequestsForParent(user.id);
    const allApplications = getAllApplications();

    // 수락된 매칭만 필터링
    const acceptedMatchings = allMatchings.filter(
      (m) => m.status === "accepted"
    );

    return acceptedMatchings
      .map((matching) => {
        // 해당 공고 정보 찾기
        const application = allApplications.find(
          (app) => app.id === matching.applicationId
        );

        if (!application) {
          return null;
        }

        // 시급 파싱
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

        // 수업 시간 계산
        const workingHours = application.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(
          application.type || ""
        );
        const totalHours = hoursPerSession * sessionsPerWeek * 4; // 월 4주 기준
        const monthlyEarnings = hourlyWage * totalHours;

        // 계약 기간 설정 (각 매칭별로 다른 기간)
        let contractMonths = 5; // 기본값
        if (matching.id === "matching_001")
          contractMonths = 6; // 김가정-김영희: 6개월
        else if (matching.id === "matching_002")
          contractMonths = 4; // 박영희-박민수: 4개월
        else if (matching.id === "matching_003")
          contractMonths = 12; // 이민수-김지영: 12개월
        else if (matching.id === "matching_004")
          contractMonths = 5; // 최지영-김태현: 5개월
        else if (matching.id === "matching_007")
          contractMonths = 3; // 김태현-김영희: 3개월
        else if (matching.id === "matching_008")
          contractMonths = 4; // 박성훈-박민수: 4개월
        else if (matching.id === "matching_010") contractMonths = 6; // 김지훈-한미영: 6개월

        const teacherTotalEarnings = monthlyEarnings * contractMonths;
        const parentTotalPayment = teacherTotalEarnings * 1.05; // 5% 수수료 포함
        const monthlyParentPayment = parentTotalPayment / contractMonths;

        // 계약 시작일과 종료일 계산
        const contractStartDate = new Date(matching.createdAt);
        const contractEndDate = new Date(contractStartDate);
        contractEndDate.setMonth(
          contractEndDate.getMonth() + contractMonths - 1
        );

        // 현재 진행 상황 계산 (2025년 8월 기준)
        const currentDate = new Date("2025-08-15"); // 고정된 현재 날짜
        const completedMonths = Math.min(
          Math.max(
            0,
            currentDate.getMonth() -
              contractStartDate.getMonth() +
              (currentDate.getFullYear() - contractStartDate.getFullYear()) * 12
          ),
          contractMonths
        );

        // 디버깅 로그
        console.log(`매칭 ${matching.id} 계산 결과:`, {
          teacherName: matching.teacherName,
          hourlyWage,
          workingHours,
          hoursPerSession,
          sessionsPerWeek,
          totalHours,
          monthlyEarnings,
          contractMonths,
          monthlyParentPayment,
          parentTotalPayment,
          completedMonths,
        });

        return {
          id: matching.id,
          teacherName: matching.teacherName,
          applicationTitle: application.title,
          hourlyWage: hourlyWage,
          hoursPerSession: hoursPerSession,
          sessionsPerWeek: sessionsPerWeek,
          monthlyHours: totalHours,
          monthlyAmount: monthlyParentPayment,
          contractMonths: contractMonths,
          totalAmount: parentTotalPayment,
          contractStartDate: contractStartDate.toLocaleDateString("ko-KR"),
          contractEndDate: contractEndDate.toLocaleDateString("ko-KR"),
          completedMonths: completedMonths,
          remainingMonths: Math.max(0, contractMonths - completedMonths),
          status: completedMonths >= contractMonths ? "completed" : "active",
        };
      })
      .filter(Boolean); // null 값 제거
  };

  // 수업 시간 계산 함수
  const calculateHoursFromWorkingHours = (workingHours) => {
    if (!workingHours) return 3; // 기본값

    // "오후 2시~7시" 형식 파싱
    const afternoonMatch = workingHours.match(/오후\s*(\d+)시~(\d+)시/);
    if (afternoonMatch) {
      const startHour = parseInt(afternoonMatch[1]) + 12; // 오후는 12를 더함
      const endHour = parseInt(afternoonMatch[2]) + 12;
      return endHour - startHour;
    }

    // "오전 9시~12시" 형식 파싱
    const morningMatch = workingHours.match(/오전\s*(\d+)시~(\d+)시/);
    if (morningMatch) {
      const startHour = parseInt(morningMatch[1]);
      const endHour = parseInt(morningMatch[2]);
      return endHour - startHour;
    }

    // 일반적인 "2시~5시" 형식 파싱
    const generalMatch = workingHours.match(/(\d+)시~(\d+)시/);
    if (generalMatch) {
      const startHour = parseInt(generalMatch[1]);
      const endHour = parseInt(generalMatch[2]);
      return endHour - startHour;
    }

    return 3; // 기본값
  };

  // 주간 수업 횟수 계산 함수
  const calculateSessionsPerWeek = (type) => {
    if (!type) return 0;
    if (type.includes("주5회")) return 5;
    if (type.includes("주3회")) return 3;
    if (type.includes("주2회")) return 2;
    if (type.includes("주1회")) return 1;
    return 2;
  };

  useEffect(() => {
    const isParentUser =
      user &&
      (user.type === "parent" ||
        user.type === "Parent" ||
        user.type === "PARENT");
    if (isParentUser) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    // 부모의 공고 목록
    const parentApplications = getAllApplications().filter(
      (app) => app.parentId === user.id
    );
    setApplications(parentApplications);

    // 부모의 매칭 목록 (공고 정보와 연결)
    const parentMatchings = getMatchingRequestsForParent(user.id).map(
      (matching) => {
        // 해당 공고 정보 찾기
        const application = getAllApplications().find(
          (app) => app.id === matching.applicationId
        );
        return {
          ...matching,
          childName: application?.target || "정보 없음",
          hourlyWage: application?.payment || "협의",
          applicationTitle: application?.title || "공고 제목 없음",
        };
      }
    );
    setMatchings(parentMatchings);

    // 결제 내역 (실제 데이터 기반)
    const paymentData = generatePaymentData();
    setPayments(paymentData);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      case "paid":
        return "결제완료";
      case "matched":
        return "매칭완료";
      case "active":
        return "활성";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "accepted":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      case "paid":
        return "#2196f3";
      case "matched":
        return "#4caf50";
      case "active":
        return "#2196f3";
      default:
        return "#757575";
    }
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === undefined || amount === null) {
      return "0";
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return "0";
    }
    return new Intl.NumberFormat("ko-KR").format(numAmount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const handleViewMatching = (matchingId) => {
    navigate(`/matchings?matchingId=${matchingId}`);
  };

  // 접근 권한 확인
  console.log("ParentMyPage - 현재 사용자 정보:", user);
  console.log("ParentMyPage - 사용자 타입:", user?.type);

  if (!user) {
    console.log("ParentMyPage - 사용자 정보 없음");
    return (
      <div className="parent-my-page">
        <div className="access-denied">
          <h2>로그인이 필요합니다</h2>
          <p>마이페이지를 이용하려면 로그인해주세요.</p>
          <button onClick={() => navigate("/login")} className="login-button">
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  // 부모 회원 타입 확인 (여러 가능한 타입 허용)
  const isParentUser =
    user.type === "parent" || user.type === "Parent" || user.type === "PARENT";

  if (!isParentUser) {
    console.log("ParentMyPage - 부모 회원이 아님:", user.type);
    return (
      <div className="parent-my-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>부모님 마이페이지는 부모 회원만 이용할 수 있습니다.</p>
          <p>
            현재 로그인된 계정:{" "}
            {user.type === "teacher" || user.type === "tutor"
              ? "선생님"
              : user.type === "admin"
              ? "관리자"
              : "기타"}{" "}
            계정
          </p>
          <p>사용자 타입: {user.type}</p>
          <button onClick={() => navigate("/login")} className="login-button">
            부모님 계정으로 로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-my-page">
      <div className="parent-my-page-container">
        <div className="page-header">
          <h1>마이 페이지</h1>
          <p>{user.name}님의 활동 내역을 확인하세요</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${
              activeTab === "applications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("applications")}
          >
            내 공고 관리
          </button>
          <button
            className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            결제 내역
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="tab-content">
          {/* 내 공고 관리 탭 */}
          {activeTab === "applications" && (
            <div className="applications-tab">
              <div className="section-header">
                <h2>내 공고 목록</h2>
                <button
                  onClick={() => navigate("/Helpme")}
                  className="add-application-button"
                >
                  공고 수정
                </button>
              </div>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <p>등록된 공고가 없습니다.</p>
                  <button
                    onClick={() => navigate("/Helpme")}
                    className="add-application-button"
                  >
                    첫 공고 작성하기
                  </button>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map((application) => (
                    <div key={application.id} className="application-card">
                      <div className="application-header">
                        <h3>{application.title}</h3>
                        <div className="status-toggle-container">
                          <span className="status-label">
                            {application.status === "active"
                              ? "활성"
                              : "비활성"}
                          </span>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={application.status === "active"}
                              onChange={() =>
                                toggleApplicationStatus(application.id)
                              }
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      <div className="application-details">
                        <p>
                          <strong>대상:</strong> {application.target} (
                          {application.region.title})
                        </p>
                        <p>
                          <strong>시작일:</strong> {application.startDate}
                        </p>
                        <p>
                          <strong>희망 시급:</strong> {application.payment}
                        </p>
                        <p>
                          <strong>공고 유형:</strong> {application.type}
                        </p>
                        <p>
                          <strong>상세 내용:</strong> {application.description}
                        </p>
                        <p>
                          <strong>요구사항:</strong> {application.requirements}
                        </p>
                        <p>
                          <strong>선호사항:</strong> {application.preferences}
                        </p>
                        <p>
                          <strong>등록일:</strong>{" "}
                          {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 결제 내역 탭 */}
          {activeTab === "payments" && (
            <div className="payments-tab">
              <div className="section-header">
                <h2>결제 내역</h2>
              </div>
              {payments.length === 0 ? (
                <div className="empty-state">
                  <p>결제 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="payments-list">
                  {payments.map((payment) => (
                    <div key={payment.id} className="payment-card">
                      <div className="payment-header">
                        <h3>{payment.teacherName}</h3>
                      </div>
                      <div className="payment-details">
                        <p>
                          <strong>공고:</strong> {payment.applicationTitle}
                        </p>
                        <p>
                          <strong>시급:</strong>{" "}
                          {formatCurrency(payment.hourlyWage)}원
                        </p>
                        <p>
                          <strong>일당:</strong>{" "}
                          {formatCurrency(
                            (payment.hourlyWage || 0) *
                              (payment.hoursPerSession || 0)
                          )}
                          원
                          <span className="detail-info">
                            {" "}
                            (1회 {payment.hoursPerSession || 0}시간 ×{" "}
                            {payment.sessionsPerWeek || 0}회/주)
                          </span>
                        </p>
                        <p>
                          <strong>월 금액:</strong>{" "}
                          {formatCurrency(payment.monthlyAmount)}원
                          <span className="detail-info">
                            {" "}
                            (월 {payment.monthlyHours}시간)
                          </span>
                        </p>
                        <p>
                          <strong>계약 기간:</strong> {payment.contractMonths}
                          개월
                          <span className="detail-info">
                            {" "}
                            ({payment.contractStartDate} ~{" "}
                            {payment.contractEndDate})
                          </span>
                        </p>
                        <p>
                          <strong>총 계약 금액:</strong>{" "}
                          <span className="total-amount">
                            {formatCurrency(payment.totalAmount)}원
                          </span>
                        </p>
                        <p>
                          <strong>진행 상황:</strong> {payment.completedMonths}
                          개월 완료 / {payment.remainingMonths}개월 남음
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentMyPage;
