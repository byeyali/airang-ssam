import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import "./TeacherContractManagement.css";

function TeacherContractManagement() {
  const { user } = useUser();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // 쌤이 받은 계약 요청 목록 (임시 데이터)
  const mockContracts = [
    {
      id: "contract_001",
      parentName: "김가정",
      childName: "김민수",
      childGender: "boy",
      subject: "수학",
      hourlyWage: 25000,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      contractDuration: 3,
      status: "pending",
      message:
        "수학 과목을 가르쳐주세요. 아이가 수학을 어려워해서 기초부터 차근차근 가르쳐주시면 좋겠습니다.",
      createdAt: "2024-01-15T10:30:00",
      messages: [
        {
          id: 1,
          sender: "parent",
          message: "안녕하세요! 수학 과목을 가르쳐주실 선생님을 찾고 있습니다.",
          timestamp: "2024-01-15T10:30:00",
        },
      ],
    },
    {
      id: "contract_002",
      parentName: "박영희",
      childName: "박소영",
      childGender: "girl",
      subject: "영어",
      hourlyWage: 30000,
      sessionsPerWeek: 3,
      hoursPerSession: 1.5,
      contractDuration: 6,
      status: "accepted",
      message:
        "영어 회화를 중점적으로 가르쳐주세요. 아이가 영어에 관심이 많아서 재미있게 가르쳐주시면 좋겠습니다.",
      createdAt: "2024-01-14T14:20:00",
      messages: [
        {
          id: 1,
          sender: "parent",
          message: "영어 회화를 중점적으로 가르쳐주실 선생님을 찾고 있습니다.",
          timestamp: "2024-01-14T14:20:00",
        },
        {
          id: 2,
          sender: "teacher",
          message: "네, 영어 회화를 재미있게 가르쳐드리겠습니다!",
          timestamp: "2024-01-14T15:00:00",
        },
      ],
    },
  ];

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = () => {
    // 실제로는 API 호출
    setContracts(mockContracts);
  };

  const handleViewDetail = (contract) => {
    setSelectedContract(contract);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedContract(null);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
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
      default:
        return "#757575";
    }
  };

  const handleAcceptContract = (contractId) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "accepted" }
          : contract
      )
    );
    if (selectedContract?.id === contractId) {
      setSelectedContract((prev) => ({ ...prev, status: "accepted" }));
    }
  };

  const handleRejectContract = (contractId) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "rejected" }
          : contract
      )
    );
    if (selectedContract?.id === contractId) {
      setSelectedContract((prev) => ({ ...prev, status: "rejected" }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const filteredContracts = contracts.filter((contract) => {
    if (filterStatus === "all") return true;
    return contract.status === filterStatus;
  });

  if (!user || (user.type !== "teacher" && user.type !== "tutor")) {
    return (
      <div className="teacher-contract-management-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>선생님 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-contract-management-page">
      <div className="teacher-contract-management-container">
        <div className="page-header">
          <h1>계약 요청 관리</h1>
          <p>받은 계약 요청을 확인하고 응답하세요</p>
        </div>

        <div className="filter-section">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">전체</option>
            <option value="pending">대기중</option>
            <option value="accepted">수락됨</option>
            <option value="rejected">거절됨</option>
          </select>
        </div>

        <div className="contracts-list">
          {filteredContracts.length === 0 ? (
            <div className="no-contracts">
              <p>계약 요청이 없습니다.</p>
            </div>
          ) : (
            filteredContracts.map((contract) => (
              <div key={contract.id} className="contract-item">
                <div className="contract-header">
                  <div className="contract-info">
                    <h3>{contract.parentName}님의 요청</h3>
                    <p className="child-info">
                      {contract.childName} (
                      {contract.childGender === "boy" ? "남" : "여"})
                    </p>
                  </div>
                  <div className="contract-status">
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

                <div className="contract-details">
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
                    <span className="label">요청일:</span>
                    <span className="value">
                      {formatDate(contract.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="contract-actions">
                  <button
                    className="view-detail-btn"
                    onClick={() => handleViewDetail(contract)}
                  >
                    상세보기
                  </button>
                  {contract.status === "pending" && (
                    <div className="response-buttons">
                      <button
                        className="accept-btn"
                        onClick={() => handleAcceptContract(contract.id)}
                      >
                        수락
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleRejectContract(contract.id)}
                      >
                        거절
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 상세 모달 */}
      {showDetail && selectedContract && (
        <div className="detail-modal-overlay" onClick={handleCloseDetail}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h2>{selectedContract.parentName}님의 계약 요청</h2>
              <button className="close-btn" onClick={handleCloseDetail}>
                ✕
              </button>
            </div>

            <div className="detail-body">
              <div className="detail-section">
                <h3>기본 정보</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">아이 이름:</span>
                    <span className="value">{selectedContract.childName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">성별:</span>
                    <span className="value">
                      {selectedContract.childGender === "boy" ? "남" : "여"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">과목:</span>
                    <span className="value">{selectedContract.subject}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">시급:</span>
                    <span className="value">
                      {formatCurrency(selectedContract.hourlyWage)}원
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">주당 횟수:</span>
                    <span className="value">
                      {selectedContract.sessionsPerWeek}회
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">회당 시간:</span>
                    <span className="value">
                      {selectedContract.hoursPerSession}시간
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">계약 기간:</span>
                    <span className="value">
                      {selectedContract.contractDuration}개월
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>요청 메시지</h3>
                <div className="message-content">
                  {selectedContract.message}
                </div>
              </div>

              <div className="detail-section">
                <h3>메시지 내역</h3>
                <div className="message-history">
                  {selectedContract.messages.map((msg) => (
                    <div key={msg.id} className={`message-item ${msg.sender}`}>
                      <div className="message-header">
                        <span className="sender">
                          {msg.sender === "parent"
                            ? selectedContract.parentName
                            : "나"}
                        </span>
                        <span className="time">
                          {new Date(msg.timestamp).toLocaleString("ko-KR")}
                        </span>
                      </div>
                      <div className="message-text">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedContract.status === "pending" && (
                <div className="detail-actions">
                  <button
                    className="accept-btn large"
                    onClick={() => {
                      handleAcceptContract(selectedContract.id);
                      handleCloseDetail();
                    }}
                  >
                    계약 수락
                  </button>
                  <button
                    className="reject-btn large"
                    onClick={() => {
                      handleRejectContract(selectedContract.id);
                      handleCloseDetail();
                    }}
                  >
                    계약 거절
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherContractManagement;
