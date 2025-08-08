import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import "./TeacherMyPage.css";

function TeacherMyPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("matching");
  const [matchings, setMatchings] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [earnings, setEarnings] = useState([]);

  // 임시 데이터
  const mockMatchings = [
    {
      id: "matching_001",
      parentName: "김가정",
      childName: "김민수",
      childGender: "boy",
      subject: "수학",
      hourlyWage: 25000,
      status: "pending",
      createdAt: "2024-01-15T10:30:00",
      message:
        "수학 과목을 가르쳐주세요. 아이가 수학을 어려워해서 기초부터 차근차근 가르쳐주시면 좋겠습니다.",
    },
    {
      id: "matching_002",
      parentName: "박영희",
      childName: "박소영",
      childGender: "girl",
      subject: "영어",
      hourlyWage: 30000,
      status: "accepted",
      createdAt: "2024-01-14T14:20:00",
      message: "영어 회화를 중점적으로 가르쳐주세요.",
    },
  ];

  const mockContracts = [
    {
      id: "contract_001",
      parentName: "김가정",
      childName: "김민수",
      subject: "수학",
      hourlyWage: 25000,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      contractDuration: 3,
      status: "pending",
      createdAt: "2024-01-15T10:30:00",
      message:
        "수학 과목을 가르쳐주세요. 아이가 수학을 어려워해서 기초부터 차근차근 가르쳐주시면 좋겠습니다.",
    },
    {
      id: "contract_002",
      parentName: "박영희",
      childName: "박소영",
      subject: "영어",
      hourlyWage: 30000,
      sessionsPerWeek: 3,
      hoursPerSession: 1.5,
      contractDuration: 6,
      status: "accepted",
      createdAt: "2024-01-14T14:20:00",
      message: "영어 회화를 중점적으로 가르쳐주세요.",
    },
  ];

  const mockEarnings = [
    {
      id: "earning_001",
      parentName: "박영희",
      childName: "박소영",
      subject: "영어",
      date: "2024-01-15",
      hours: 3,
      hourlyWage: 30000,
      totalAmount: 90000,
      status: "paid",
    },
    {
      id: "earning_002",
      parentName: "이미영",
      childName: "이준호",
      subject: "수학",
      date: "2024-01-14",
      hours: 2,
      hourlyWage: 25000,
      totalAmount: 50000,
      status: "pending",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMatchings(mockMatchings);
    setContracts(mockContracts);
    setEarnings(mockEarnings);
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
        return "지급완료";
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
      default:
        return "#757575";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const handleAcceptMatching = (matchingId) => {
    setMatchings((prev) =>
      prev.map((matching) =>
        matching.id === matchingId
          ? { ...matching, status: "accepted" }
          : matching
      )
    );
  };

  const handleRejectMatching = (matchingId) => {
    setMatchings((prev) =>
      prev.map((matching) =>
        matching.id === matchingId
          ? { ...matching, status: "rejected" }
          : matching
      )
    );
  };

  const handleAcceptContract = (contractId) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "accepted" }
          : contract
      )
    );
  };

  const handleRejectContract = (contractId) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "rejected" }
          : contract
      )
    );
  };

  if (!user || (user.type !== "teacher" && user.type !== "tutor")) {
    return (
      <div className="teacher-my-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>선생님 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-my-page">
      <div className="teacher-my-page-container">
        <div className="page-header">
          <h1>마이 페이지</h1>
          <p>{user.name} 선생님의 활동 내역을 확인하세요</p>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "matching" ? "active" : ""}`}
            onClick={() => setActiveTab("matching")}
          >
            매칭 요청 ({matchings.filter((m) => m.status === "pending").length})
          </button>
          <button
            className={`tab-button ${activeTab === "contract" ? "active" : ""}`}
            onClick={() => setActiveTab("contract")}
          >
            계약 요청 ({contracts.filter((c) => c.status === "pending").length})
          </button>
          <button
            className={`tab-button ${activeTab === "earnings" ? "active" : ""}`}
            onClick={() => setActiveTab("earnings")}
          >
            수당 내역
          </button>
        </div>

        <div className="content-area">
          {/* 매칭 요청 탭 */}
          {activeTab === "matching" && (
            <div className="matching-section">
              <h2>받은 매칭 요청</h2>
              {matchings.length === 0 ? (
                <div className="no-data">
                  <p>받은 매칭 요청이 없습니다.</p>
                </div>
              ) : (
                <div className="items-list">
                  {matchings.map((matching) => (
                    <div key={matching.id} className="item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h3>{matching.parentName}님의 요청</h3>
                          <p className="child-info">
                            {matching.childName} (
                            {matching.childGender === "boy" ? "남" : "여"})
                          </p>
                        </div>
                        <div className="item-status">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(matching.status),
                            }}
                          >
                            {getStatusText(matching.status)}
                          </span>
                        </div>
                      </div>

                      <div className="item-details">
                        <div className="detail-row">
                          <span className="label">과목:</span>
                          <span className="value">{matching.subject}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">시급:</span>
                          <span className="value">
                            {formatCurrency(matching.hourlyWage)}원
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">요청일:</span>
                          <span className="value">
                            {formatDate(matching.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="item-message">
                        <p>{matching.message}</p>
                      </div>

                      {matching.status === "pending" && (
                        <div className="item-actions">
                          <button
                            className="accept-btn"
                            onClick={() => handleAcceptMatching(matching.id)}
                          >
                            수락
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleRejectMatching(matching.id)}
                          >
                            거절
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 계약 요청 탭 */}
          {activeTab === "contract" && (
            <div className="contract-section">
              <h2>받은 계약 요청</h2>
              {contracts.length === 0 ? (
                <div className="no-data">
                  <p>받은 계약 요청이 없습니다.</p>
                </div>
              ) : (
                <div className="items-list">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h3>{contract.parentName}님의 요청</h3>
                          <p className="child-info">
                            {contract.childName} (
                            {contract.childGender === "boy" ? "남" : "여"})
                          </p>
                        </div>
                        <div className="item-status">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(contract.status),
                            }}
                          >
                            {getStatusText(contract.status)}
                          </span>
                        </div>
                      </div>

                      <div className="item-details">
                        <div className="detail-row">
                          <span className="label">과목:</span>
                          <span className="value">{contract.subject}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">시급:</span>
                          <span className="value">
                            {formatCurrency(contract.hourlyWage)}원
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">주당 횟수:</span>
                          <span className="value">
                            {contract.sessionsPerWeek}회
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">회당 시간:</span>
                          <span className="value">
                            {contract.hoursPerSession}시간
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">계약 기간:</span>
                          <span className="value">
                            {contract.contractDuration}개월
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">요청일:</span>
                          <span className="value">
                            {formatDate(contract.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="item-message">
                        <p>{contract.message}</p>
                      </div>

                      {contract.status === "pending" && (
                        <div className="item-actions">
                          <button
                            className="accept-btn"
                            onClick={() => handleAcceptContract(contract.id)}
                          >
                            계약 수락
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleRejectContract(contract.id)}
                          >
                            계약 거절
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 수당 내역 탭 */}
          {activeTab === "earnings" && (
            <div className="earnings-section">
              <h2>수당 내역</h2>
              {earnings.length === 0 ? (
                <div className="no-data">
                  <p>수당 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="items-list">
                  {earnings.map((earning) => (
                    <div key={earning.id} className="item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h3>
                            {earning.parentName}님 - {earning.childName}
                          </h3>
                          <p className="subject-info">{earning.subject}</p>
                        </div>
                        <div className="item-status">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(earning.status),
                            }}
                          >
                            {getStatusText(earning.status)}
                          </span>
                        </div>
                      </div>

                      <div className="item-details">
                        <div className="detail-row">
                          <span className="label">수업일:</span>
                          <span className="value">
                            {formatDate(earning.date)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">수업 시간:</span>
                          <span className="value">{earning.hours}시간</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">시급:</span>
                          <span className="value">
                            {formatCurrency(earning.hourlyWage)}원
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">총 수당:</span>
                          <span className="value total-amount">
                            {formatCurrency(earning.totalAmount)}원
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="earnings-summary">
                <h3>수당 요약</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">이번 달 총 수당:</span>
                    <span className="value">
                      {formatCurrency(
                        earnings.reduce((sum, e) => sum + e.totalAmount, 0)
                      )}
                      원
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">지급 완료:</span>
                    <span className="value">
                      {formatCurrency(
                        earnings
                          .filter((e) => e.status === "paid")
                          .reduce((sum, e) => sum + e.totalAmount, 0)
                      )}
                      원
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">지급 대기:</span>
                    <span className="value">
                      {formatCurrency(
                        earnings
                          .filter((e) => e.status === "pending")
                          .reduce((sum, e) => sum + e.totalAmount, 0)
                      )}
                      원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherMyPage;
