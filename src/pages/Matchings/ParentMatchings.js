import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatching } from "../../contexts/MatchingContext";
import { useUser } from "../../contexts/UserContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./Matchings.css";

function ParentMatchings() {
  const { user } = useUser();
  const {
    getMatchingRequestsForParent,
    acceptMatchingRequest,
    rejectMatchingRequest,
  } = useMatching();
  const {
    createContractProgressNotification,
    createContractCompletedNotification,
    createNotification,
  } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMatching, setSelectedMatching] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractStatus, setContractStatus] = useState({});

  // 쌤 이미지 매핑 함수
  const getTeacherImage = useCallback((teacherId) => {
    const imageMap = {
      teacher_001: "/img/teacher-kimyouhghee-womam.png", // 김영희
      teacher_002: "/img/teacher-30-man.png", // 박민수
      teacher_003: "/img/teacher-kimjiyoung.jpg", // 김지영
      teacher_004: "/img/teacher-math-english.jpg", // 최지영
      teacher_005: "/img/teacher-studing-with-2children.jpeg", // 한미영
      teacher_006: "/img/teacher-30-man.png", // 정성훈
      teacher_007: "/img/teacher-30-man.png", // 김태현
      teacher_008: "/img/teacher-30-man.png", // 박성훈
      teacher_010: "/img/teacher-40-woman.png", // 박O영 (45세)
    };
    return imageMap[teacherId] || "/img/teacher-30-woman.png";
  }, []);

  const matchings = user ? getMatchingRequestsForParent(user.id) : [];

  // URL 파라미터에서 matchingId 확인
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const matchingId = params.get("matchingId");

    if (matchingId) {
      const matching = matchings.find((m) => m.id === matchingId);
      if (matching) {
        setSelectedMatching(matching);
        setShowDetail(true);
      }
    }
  }, [location.search, matchings]);

  const handleViewDetail = (matching) => {
    setSelectedMatching(matching);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedMatching(null);
    navigate("/matchings");
  };

  const handleOpenContractModal = () => {
    setShowContractModal(true);
  };

  const handleCloseContractModal = () => {
    setShowContractModal(false);
  };

  // 계약 진행하기
  const handleStartContract = () => {
    if (selectedMatching) {
      console.log("계약이 진행중입니다.");
      setContractStatus((prev) => ({
        ...prev,
        [selectedMatching.id]: "progress",
      }));
      setShowContractModal(false);
      handleCloseDetail();
      // 쌤에게 계약 진행 알림 생성
      createContractProgressNotification(
        selectedMatching.teacherId,
        selectedMatching.parentName
      );
      // 부모에게도 계약 진행 알림 생성
      createNotification({
        userId: selectedMatching.parentId,
        type: "contract_progress_parent",
        title: "계약 진행 시작",
        message: `${selectedMatching.teacherName}님과의 계약이 진행중입니다. 쌤의 수락을 기다려주세요.`,
        isRead: false,
      });
      showNotification(
        "계약이 진행중입니다. 쌤의 수락을 기다려주세요.",
        "info"
      );
    }
  };

  const getContractStatusText = (matchingId) => {
    const status = contractStatus[matchingId];
    if (status === "progress") return "계약 진행중";
    if (status === "completed") return "계약 완료";
    return null;
  };

  const getContractStatusColor = (matchingId) => {
    const status = contractStatus[matchingId];
    if (status === "progress") return "#ff9800";
    if (status === "completed") return "#4caf50";
    return "#6c757d";
  };

  const showNotification = (message, type = "info") => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("아이랑 쌤이랑", {
        body: message,
        icon: "/img/Image_fx.png",
      });
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
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
        return "#ffc107";
      case "accepted":
        return "#28a745";
      case "rejected":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (!user || user.type !== "parent") {
    return (
      <div className="matchings-page">
        <div className="login-required">
          <h2>부모 회원만 접근 가능합니다</h2>
          <p>부모 회원으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matchings-page">
      <div className="matchings-container">
        <div className="matchings-header">
          <h1>내 매칭 관리</h1>
          <p>내가 보낸 매칭 요청 현황을 확인하고 관리하세요</p>
        </div>

        {matchings.length === 0 ? (
          <div className="no-matchings">
            <div className="no-matchings-content">
              <h2>매칭 내역이 없습니다</h2>
              <p>아직 매칭 요청을 보내지 않았습니다.</p>
              <button
                className="create-application-button"
                onClick={() => navigate("/Helpme")}
              >
                공고 등록하기
              </button>
            </div>
          </div>
        ) : (
          <div className="matchings-content">
            <div className="matchings-list">
              {matchings.map((matching) => (
                <div key={matching.id} className="matching-item">
                  <div className="matching-header">
                    <div className="matching-status">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(matching.status),
                        }}
                      >
                        {getStatusText(matching.status)}
                      </span>
                    </div>
                    <div className="matching-date">
                      {new Date(matching.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                  </div>

                  <div className="matching-info">
                    <div className="matching-title">
                      {matching.teacherName}님에게 보낸 매칭 요청
                    </div>
                    <div className="matching-details">
                      <div className="matching-message">{matching.message}</div>
                      <div className="matching-status-info">
                        {matching.status === "pending" &&
                          "쌤의 응답을 기다리는 중입니다"}
                        {matching.status === "accepted" &&
                          "쌤이 매칭을 수락했습니다"}
                        {matching.status === "rejected" &&
                          "쌤이 매칭을 거절했습니다"}
                      </div>
                    </div>
                  </div>

                  <div className="matching-participants">
                    <div className="participant-info">
                      <div className="teacher-profile-section">
                        <img
                          src={getTeacherImage(matching.teacherId)}
                          alt="쌤 프로필"
                          className="teacher-profile-image"
                        />
                        <div className="teacher-info-text">
                          <span className="participant-label">
                            매칭 중인 쌤:
                          </span>
                          <span className="participant-name">
                            {matching.teacherName}
                          </span>
                          {getContractStatusText(matching.id) && (
                            <span
                              className="contract-status-badge"
                              style={{
                                backgroundColor: getContractStatusColor(
                                  matching.id
                                ),
                              }}
                            >
                              {getContractStatusText(matching.id)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="matching-actions">
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetail(matching)}
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
        {showDetail && selectedMatching && (
          <div className="detail-modal">
            <div className="detail-content">
              <div className="detail-header">
                <h2>매칭 상세 정보</h2>
                <button className="close-button" onClick={handleCloseDetail}>
                  ×
                </button>
              </div>

              <div className="detail-body">
                <div className="detail-section">
                  <h3>매칭 정보</h3>
                  <div className="detail-row">
                    <span className="detail-label">상태:</span>
                    <span
                      className="detail-value status-badge"
                      style={{
                        backgroundColor: getStatusColor(
                          selectedMatching.status
                        ),
                      }}
                    >
                      {getStatusText(selectedMatching.status)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">요청일:</span>
                    <span className="detail-value">
                      {new Date(selectedMatching.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>참여자 정보</h3>
                  <div className="detail-row">
                    <span className="detail-label">부모님:</span>
                    <span className="detail-value">
                      {selectedMatching.parentName}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">쌤:</span>
                    <div className="teacher-detail-section">
                      <img
                        src={getTeacherImage(selectedMatching.teacherId)}
                        alt="쌤 프로필"
                        className="teacher-detail-image"
                      />
                      <span className="detail-value">
                        {selectedMatching.teacherName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>매칭 요청 메시지</h3>
                  <div className="message-section">
                    <div className="message-item">
                      <div className="message-header">
                        <span className="message-author">
                          {selectedMatching.parentName}님
                        </span>
                        <span className="message-time">
                          {new Date(selectedMatching.createdAt).toLocaleString(
                            "ko-KR"
                          )}
                        </span>
                      </div>
                      <div className="message-content">
                        {selectedMatching.message}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 계약 요청 내용 표시 */}
                {selectedMatching.contractRequest && (
                  <div className="detail-section">
                    <h3>계약 요청 내용</h3>
                    <div className="message-section">
                      <div className="message-item">
                        <div className="message-header">
                          <span className="message-author">
                            {selectedMatching.teacherName}님
                          </span>
                          <span className="message-time">
                            {selectedMatching.contractRequest.createdAt &&
                              new Date(
                                selectedMatching.contractRequest.createdAt
                              ).toLocaleString("ko-KR")}
                          </span>
                        </div>
                        <div className="message-content">
                          {selectedMatching.contractRequest.message}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 매칭 완료 버튼 */}
                {selectedMatching.status === "accepted" && (
                  <div className="detail-section">
                    <div className="action-buttons">
                      {!contractStatus[selectedMatching.id] && (
                        <button
                          className="contract-button"
                          onClick={handleOpenContractModal}
                        >
                          계약 진행하기
                        </button>
                      )}
                      {contractStatus[selectedMatching.id] === "progress" && (
                        <div className="contract-status-info">
                          <span className="contract-status-text">
                            계약 진행중입니다. 쌤의 수락을 기다려주세요.
                          </span>
                        </div>
                      )}
                      {contractStatus[selectedMatching.id] === "completed" && (
                        <div className="contract-completed-info">
                          <span className="contract-completed-text">
                            계약이 완료되었습니다!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 계약 진행 질문 모달 */}
      {showContractModal && (
        <div className="contract-modal">
          <div className="contract-content">
            <div className="contract-header">
              <h2>계약 진행</h2>
              <button
                className="close-button"
                onClick={handleCloseContractModal}
              >
                ×
              </button>
            </div>
            <div className="contract-body">
              <div className="contract-question">
                <h3>매칭된 쌤과는 계약을 해야 합니다.</h3>
                <p>계약을 진행하시겠습니까?</p>
              </div>
              <div className="contract-actions">
                <button
                  className="contract-yes-button"
                  onClick={handleStartContract}
                >
                  네
                </button>
                <button
                  className="contract-no-button"
                  onClick={handleCloseContractModal}
                >
                  아니요
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentMatchings;
