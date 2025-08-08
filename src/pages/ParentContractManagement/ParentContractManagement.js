import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./ParentContractManagement.css";

function ParentContractManagement() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getUserNotifications } = useNotification();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, progress, completed
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [draftMessages, setDraftMessages] = useState({}); // 임시 저장된 메시지들
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({}); // 지출내역 상태

  useEffect(() => {
    if (user?.type === "parent") {
      loadParentContracts();
      loadDraftMessages();
      loadPaymentStatus();
    }
  }, [user]);

  // 임시 저장된 메시지 불러오기
  const loadDraftMessages = () => {
    try {
      const savedDrafts = localStorage.getItem(`draftMessages_${user?.id}`);
      if (savedDrafts) {
        setDraftMessages(JSON.parse(savedDrafts));
      }
    } catch (error) {
      console.error("임시 저장된 메시지 불러오기 실패:", error);
    }
  };

  // 임시 저장된 메시지 저장하기
  const saveDraftMessage = (contractId, message) => {
    try {
      const updatedDrafts = {
        ...draftMessages,
        [contractId]: message,
      };
      setDraftMessages(updatedDrafts);
      localStorage.setItem(
        `draftMessages_${user?.id}`,
        JSON.stringify(updatedDrafts)
      );
    } catch (error) {
      console.error("임시 저장 실패:", error);
    }
  };

  // 자동 저장 기능
  const handleMessageChange = (e) => {
    const message = e.target.value;
    setNewMessage(message);

    // 이전 타이머 클리어
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // 3초 후 자동 저장
    const timer = setTimeout(() => {
      if (selectedContract && message.trim()) {
        saveDraftMessage(selectedContract.id, message);
      }
    }, 3000);

    setAutoSaveTimer(timer);
  };

  const loadParentContracts = () => {
    const allMatchings = getAllMatchingRequests();
    const parentContracts = allMatchings
      .filter((matching) => matching.parentId === user?.id)
      .map((matching) => ({
        ...matching,
        contractStatus: matching.contractStatus || "pending",
        contractDate: matching.contractDate || matching.createdAt,
        hourlyWage: matching.hourlyWage || "15,000원",
        contractDuration: matching.contractDuration || "3개월",
        sessionsPerWeek: matching.sessionsPerWeek || 3,
        hoursPerSession: matching.hoursPerSession || 2,
      }));

    setContracts(parentContracts);
  };

  const handleViewDetail = (contract) => {
    setSelectedContract(contract);
    setShowDetail(true);

    // 임시 저장된 메시지 불러오기
    const savedMessage = draftMessages[contract.id];
    if (savedMessage) {
      setNewMessage(savedMessage);
    } else {
      setNewMessage("");
    }

    // 모달이 열린 후 스크롤을 맨 아래로 자동 이동
    setTimeout(() => {
      const detailBody = document.querySelector(".detail-body");
      if (detailBody) {
        detailBody.scrollTop = detailBody.scrollHeight;
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    // 현재 메시지를 임시 저장
    if (selectedContract && newMessage.trim()) {
      saveDraftMessage(selectedContract.id, newMessage);
    }

    setShowDetail(false);
    setSelectedContract(null);
    setNewMessage("");
  };

  const handleCancelMessage = () => {
    // 임시 저장된 메시지 삭제
    if (selectedContract) {
      const updatedDrafts = { ...draftMessages };
      delete updatedDrafts[selectedContract.id];
      setDraftMessages(updatedDrafts);
      localStorage.setItem(
        `draftMessages_${user?.id}`,
        JSON.stringify(updatedDrafts)
      );
    }
    setNewMessage("");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSendingMessage(true);

    // 메시지 전송 시뮬레이션 (나중에 API 호출로 대체)
    setTimeout(() => {
      if (selectedContract) {
        // 임시 저장된 메시지 삭제
        const updatedDrafts = { ...draftMessages };
        delete updatedDrafts[selectedContract.id];
        setDraftMessages(updatedDrafts);
        localStorage.setItem(
          `draftMessages_${user?.id}`,
          JSON.stringify(updatedDrafts)
        );

        setSelectedContract({
          ...selectedContract,
          messages: [
            ...(selectedContract.messages || []),
            {
              id: Date.now().toString(),
              sender: "parent",
              content: newMessage,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
      setNewMessage("");
      setIsSendingMessage(false);

      // 메시지 전송 후 스크롤을 맨 아래로 이동
      setTimeout(() => {
        const detailBody = document.querySelector(".detail-body");
        if (detailBody) {
          detailBody.scrollTop = detailBody.scrollHeight;
        }
      }, 100);

      // 입금 안내 알림 표시
      showPaymentNotification();
    }, 1000);
  };

  const showPaymentNotification = () => {
    const contractId = selectedContract?.id;
    const requiredAmount = calculateRequiredAmount(selectedContract);

    console.log("입금 알림 생성:", { contractId, requiredAmount });

    const notification = {
      id: Date.now().toString(),
      type: "payment_notification",
      title: "💳 계약 진행을 위한 입금 안내",
      message: `계약 진행을 위해 회사 계좌로 입금이 필요합니다.\n\n📋 입금 정보:\n- 계좌번호: 123-456-789012\n- 예금주: (주)아이랑쌤\n- 입금액: ${formatCurrency(
        requiredAmount
      )}\n\n💡 입금 완료 후 계약이 진행됩니다.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    // 알림을 localStorage에 저장
    const existingNotifications = JSON.parse(
      localStorage.getItem(`notifications_${user?.id}`) || "[]"
    );
    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem(
      `notifications_${user?.id}`,
      JSON.stringify(updatedNotifications)
    );

    // 지출내역 상태 업데이트
    updatePaymentStatus(contractId, requiredAmount);

    console.log("지출내역 업데이트:", { contractId, requiredAmount });

    // 알림창 표시
    alert(notification.message);
  };

  const calculateRequiredAmount = (contract) => {
    if (!contract) return 0;
    const hourlyWage = parseInt(
      contract.hourlyWage?.replace(/[^0-9]/g, "") || 15000
    );
    const sessionsPerWeek = contract.sessionsPerWeek || 3;
    const hoursPerSession = contract.hoursPerSession || 2;
    const contractDuration = parseInt(
      contract.contractDuration?.replace(/[^0-9]/g, "") || 3
    );

    // 월 4주 기준으로 계산
    const totalHours = sessionsPerWeek * hoursPerSession * 4 * contractDuration;
    const totalAmount = hourlyWage * totalHours;

    console.log("금액 계산:", {
      hourlyWage,
      sessionsPerWeek,
      hoursPerSession,
      contractDuration,
      totalHours,
      totalAmount,
    });

    return totalAmount;
  };

  const updatePaymentStatus = (contractId, amount) => {
    const updatedStatus = {
      ...paymentStatus,
      [contractId]: {
        requiredAmount: amount,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    };
    setPaymentStatus(updatedStatus);
    localStorage.setItem(
      `paymentStatus_${user?.id}`,
      JSON.stringify(updatedStatus)
    );
  };

  const loadPaymentStatus = () => {
    try {
      const savedStatus = localStorage.getItem(`paymentStatus_${user?.id}`);
      if (savedStatus) {
        setPaymentStatus(JSON.parse(savedStatus));
      }
    } catch (error) {
      console.error("지출내역 상태 불러오기 실패:", error);
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR");
  };

  if (!user || user.type !== "parent") {
    return (
      <div className="parent-contract-management-page">
        <div className="login-required">
          <h2>부모님만 접근 가능합니다</h2>
          <p>부모님으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-contract-management-page">
      <div className="parent-contract-management-container">
        <div className="parent-contract-management-header">
          <h1>내 계약 관리</h1>
          <p>나의 계약 현황을 확인하고 관리하세요</p>
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
                      {formatDate(contract.contractDate)}
                    </div>
                  </div>

                  <div className="contract-info">
                    <div className="contract-title">
                      {contract.teacherName}님과의 계약
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
                      {formatDate(selectedContract.contractDate)}
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

                {/* 지출내역 섹션 */}
                {(() => {
                  console.log("지출내역 렌더링 체크:", {
                    selectedContractId: selectedContract?.id,
                    paymentStatus,
                    hasPaymentStatus: paymentStatus[selectedContract?.id],
                  });
                  return (
                    paymentStatus[selectedContract?.id] && (
                      <div className="detail-section">
                        <h3>💳 지출내역</h3>
                        <div className="payment-info">
                          <div className="payment-amount">
                            <span className="amount-label">필요 금액:</span>
                            <span className="amount-value">
                              {formatCurrency(
                                paymentStatus[selectedContract.id]
                                  .requiredAmount
                              )}
                            </span>
                          </div>
                          <div className="payment-status">
                            <span className="status-label">상태:</span>
                            <span className="status-value pending">
                              입금 대기중
                            </span>
                          </div>
                          <div className="payment-note">
                            💡 계약 진행을 위해 입금이 필요합니다.
                          </div>
                        </div>
                      </div>
                    )
                  );
                })()}

                <div className="detail-section">
                  <h3>계약 요청 메시지</h3>

                  {/* 메시지 작성 영역 */}
                  <div className="message-input-section">
                    <h4>새 계약 요청 메시지 작성</h4>
                    {draftMessages[selectedContract?.id] && (
                      <div className="draft-indicator">💾 임시 저장됨</div>
                    )}
                    <div className="message-input-container">
                      <textarea
                        className="message-input"
                        placeholder="계약 조건이나 요청사항을 입력하세요..."
                        value={newMessage}
                        onChange={handleMessageChange}
                        rows={5}
                      />
                      <div className="message-button-container">
                        <button
                          className="cancel-message-button"
                          onClick={handleCancelMessage}
                          disabled={isSendingMessage}
                          style={{
                            display: "block !important",
                            visibility: "visible !important",
                            opacity: "1 !important",
                            position: "relative",
                            zIndex: 999,
                            width: "80px",
                            height: "auto",
                            margin: "10px 5px 10px 0",
                            boxSizing: "border-box",
                            backgroundColor: "#adb5bd",
                            color: "white",
                          }}
                        >
                          취소
                        </button>
                        <button
                          className="send-message-button"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isSendingMessage}
                          style={{
                            display: "block !important",
                            visibility: "visible !important",
                            opacity: "1 !important",
                            position: "relative",
                            zIndex: 999,
                            width: "120px",
                            height: "auto",
                            margin: "10px 0",
                            boxSizing: "border-box",
                            backgroundColor: "#42a5f5",
                            color: "white",
                          }}
                        >
                          {isSendingMessage ? "전송 중..." : "계약 요청 전송"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 메시지 히스토리 */}
                  {selectedContract.messages &&
                    selectedContract.messages.length > 0 && (
                      <div className="message-history-section">
                        <h4>계약 요청 메시지 히스토리</h4>
                        <div className="message-history">
                          {selectedContract.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`message-item ${
                                msg.sender === "parent"
                                  ? "parent-message"
                                  : "teacher-message"
                              }`}
                            >
                              <div className="message-header">
                                <span className="message-sender">
                                  {msg.sender === "parent"
                                    ? "나"
                                    : selectedContract.teacherName}
                                </span>
                                <span className="message-time">
                                  {formatDate(msg.timestamp)}
                                </span>
                              </div>
                              <div className="message-text">{msg.content}</div>
                            </div>
                          ))}
                        </div>
                        {/* 메시지 히스토리 하단 여백 */}
                        <div style={{ height: "20px", width: "100%" }}></div>
                      </div>
                    )}
                </div>

                {/* 하단 여백 추가 */}
                <div style={{ height: "80px", width: "100%" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentContractManagement;
