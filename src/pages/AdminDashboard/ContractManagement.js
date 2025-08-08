import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import "./ContractManagement.css";

function ContractManagement() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, progress, completed

  useEffect(() => {
    if (user?.type === "admin") {
      loadContracts();
    }
  }, [user]);

  const loadContracts = () => {
    const allMatchings = getAllMatchingRequests();
    const contractData = allMatchings
      .filter((matching) => matching.status === "accepted")
      .map((matching) => ({
        ...matching,
        contractStatus: matching.contractStatus || "pending",
        contractDate: matching.contractDate || matching.createdAt,
        hourlyWage: matching.hourlyWage || "15,000원",
        contractDuration: matching.contractDuration || "3개월",
        sessionsPerWeek: matching.sessionsPerWeek || 3,
        hoursPerSession: matching.hoursPerSession || 2,
      }));

    setContracts(contractData);
  };

  const handleViewDetail = (contract) => {
    setSelectedContract(contract);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedContract(null);
  };

  const handleUpdateContractStatus = (contractId, newStatus) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, contractStatus: newStatus }
          : contract
      )
    );
    setSelectedContract((prev) =>
      prev && prev.id === contractId
        ? { ...prev, contractStatus: newStatus }
        : prev
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "계약 대기";
      case "progress":
        return "계약 진행중";
      case "completed":
        return "계약 완료";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#2196f3";
      case "progress":
        return "#ff9800";
      case "completed":
        return "#4caf50";
      default:
        return "#6c757d";
    }
  };

  const getFilteredContracts = () => {
    if (filterStatus === "all") {
      return contracts;
    }
    return contracts.filter(
      (contract) => contract.contractStatus === filterStatus
    );
  };

  if (!user || user.type !== "admin") {
    return (
      <div className="contract-management-page">
        <div className="login-required">
          <h2>관리자만 접근 가능합니다</h2>
          <p>관리자로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-management-page">
      <div className="contract-management-container">
        <div className="contract-management-header">
          <h1>계약 관리</h1>
          <p>모든 계약 현황을 확인하고 관리하세요</p>
        </div>

        <div className="contract-filters">
          <button
            className={`filter-button ${
              filterStatus === "all" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("all")}
          >
            전체 ({contracts.length})
          </button>
          <button
            className={`filter-button ${
              filterStatus === "pending" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("pending")}
          >
            계약 대기 (
            {contracts.filter((c) => c.contractStatus === "pending").length})
          </button>
          <button
            className={`filter-button ${
              filterStatus === "progress" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("progress")}
          >
            계약 진행중 (
            {contracts.filter((c) => c.contractStatus === "progress").length})
          </button>
          <button
            className={`filter-button ${
              filterStatus === "completed" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("completed")}
          >
            계약 완료 (
            {contracts.filter((c) => c.contractStatus === "completed").length})
          </button>
        </div>

        {getFilteredContracts().length === 0 ? (
          <div className="no-contracts">
            <div className="no-contracts-content">
              <h2>계약 내역이 없습니다</h2>
              <p>아직 계약 내역이 없습니다.</p>
            </div>
          </div>
        ) : (
          <div className="contracts-content">
            <div className="contracts-list">
              {getFilteredContracts().map((contract) => (
                <div key={contract.id} className="contract-item">
                  <div className="contract-header">
                    <div className="contract-status">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(
                            contract.contractStatus
                          ),
                        }}
                      >
                        {getStatusText(contract.contractStatus)}
                      </span>
                    </div>
                    <div className="contract-date">
                      {new Date(contract.contractDate).toLocaleDateString(
                        "ko-KR"
                      )}
                    </div>
                  </div>

                  <div className="contract-info">
                    <div className="contract-title">
                      {contract.parentName}님 ↔ {contract.teacherName}님
                    </div>
                    <div className="contract-details">
                      <div className="contract-message">{contract.message}</div>
                      <div className="contract-summary">
                        <span>시급: {contract.hourlyWage}</span>
                        <span>주 {contract.sessionsPerWeek}회</span>
                        <span>회당 {contract.hoursPerSession}시간</span>
                        <span>계약기간: {contract.contractDuration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="contract-actions">
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetail(contract)}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 상세 보기 모달 */}
        {showDetail && selectedContract && (
          <div className="detail-modal">
            <div className="detail-content">
              <div className="detail-header">
                <h2>계약 상세 정보</h2>
                <button className="close-button" onClick={handleCloseDetail}>
                  ×
                </button>
              </div>

              <div className="detail-body">
                <div className="detail-section">
                  <h3>계약 정보</h3>
                  <div className="detail-row">
                    <span className="detail-label">계약 상태:</span>
                    <span
                      className="detail-value status-badge"
                      style={{
                        backgroundColor: getStatusColor(
                          selectedContract.contractStatus
                        ),
                      }}
                    >
                      {getStatusText(selectedContract.contractStatus)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">계약일:</span>
                    <span className="detail-value">
                      {new Date(
                        selectedContract.contractDate
                      ).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">부모님:</span>
                    <span className="detail-value">
                      {selectedContract.parentName}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">쌤:</span>
                    <span className="detail-value">
                      {selectedContract.teacherName}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>계약 조건</h3>
                  <div className="detail-row">
                    <span className="detail-label">시급:</span>
                    <span className="detail-value">
                      {selectedContract.hourlyWage}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">주간 횟수:</span>
                    <span className="detail-value">
                      주 {selectedContract.sessionsPerWeek}회
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">회당 시간:</span>
                    <span className="detail-value">
                      {selectedContract.hoursPerSession}시간
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">계약기간:</span>
                    <span className="detail-value">
                      {selectedContract.contractDuration}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>메시지</h3>
                  <div className="message-content">
                    {selectedContract.message}
                  </div>
                </div>

                {selectedContract.contractStatus === "pending" && (
                  <div className="detail-section">
                    <h3>계약 상태 변경</h3>
                    <div className="action-buttons">
                      <button
                        className="progress-button"
                        onClick={() =>
                          handleUpdateContractStatus(
                            selectedContract.id,
                            "progress"
                          )
                        }
                      >
                        계약 진행중으로 변경
                      </button>
                    </div>
                  </div>
                )}

                {selectedContract.contractStatus === "progress" && (
                  <div className="detail-section">
                    <h3>계약 상태 변경</h3>
                    <div className="action-buttons">
                      <button
                        className="complete-button"
                        onClick={() =>
                          handleUpdateContractStatus(
                            selectedContract.id,
                            "completed"
                          )
                        }
                      >
                        계약 완료로 변경
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractManagement;
