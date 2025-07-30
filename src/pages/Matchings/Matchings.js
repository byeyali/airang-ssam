import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatching } from "../../contexts/MatchingContext";
import { useUser } from "../../contexts/UserContext";
import "./Matchings.css";

function Matchings() {
  const { user } = useUser();
  const { getUserMatchings, getMatchingById, updateMatchingStatus } =
    useMatching();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMatching, setSelectedMatching] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState("");

  const matchings = user ? getUserMatchings(user.id) : [];

  // URL 파라미터에서 matchingId 확인
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const matchingId = params.get("matchingId");

    if (matchingId) {
      const matching = getMatchingById(matchingId);
      if (matching) {
        setSelectedMatching(matching);
        setShowDetail(true);
      }
    }
  }, [location.search, getMatchingById]);

  const handleViewDetail = (matching) => {
    setSelectedMatching(matching);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedMatching(null);
    setTeacherMessage("");
    // URL에서 matchingId 제거
    navigate("/matchings");
  };

  const handleAcceptMatching = () => {
    if (selectedMatching && teacherMessage.trim()) {
      updateMatchingStatus(selectedMatching.id, "accepted", teacherMessage);
      handleCloseDetail();
    }
  };

  const handleRejectMatching = () => {
    if (selectedMatching) {
      updateMatchingStatus(selectedMatching.id, "rejected", teacherMessage);
      handleCloseDetail();
    }
  };

  const handleCompleteMatching = () => {
    if (selectedMatching) {
      updateMatchingStatus(selectedMatching.id, "completed");
      handleCloseDetail();
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      case "completed":
        return "완료됨";
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
      case "completed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const isParent = user?.type === "parent";
  const isTeacher = user?.type === "teacher";

  if (!user) {
    return (
      <div className="matchings-page">
        <div className="login-required">
          <h2>로그인이 필요합니다</h2>
          <p>매칭 관리를 위해 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matchings-page">
      <div className="matchings-container">
        <div className="matchings-header">
          <h1>매칭 관리</h1>
          <p>나의 매칭 현황을 확인하고 관리하세요</p>
        </div>

        {matchings.length === 0 ? (
          <div className="no-matchings">
            <div className="no-matchings-content">
              <h2>매칭 내역이 없습니다</h2>
              <p>아직 매칭된 내역이 없습니다.</p>
              {isParent && (
                <button
                  className="create-application-button"
                  onClick={() => navigate("/Helpme")}
                >
                  공고 등록하기
                </button>
              )}
              {isTeacher && (
                <button
                  className="find-applications-button"
                  onClick={() => navigate("/teacher-applications")}
                >
                  공고 찾아보기
                </button>
              )}
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
                      {matching.applicationTitle}
                    </div>
                    <div className="matching-details">
                      <div className="matching-region">
                        📍 {matching.region}
                      </div>
                      <div className="matching-wage">
                        💰 {matching.hourlyWage}원
                      </div>
                      <div className="matching-hours">
                        ⏰ {matching.workingHours}
                      </div>
                    </div>
                  </div>

                  <div className="matching-participants">
                    {isParent ? (
                      <div className="participant-info">
                        <span className="participant-label">매칭된 쌤:</span>
                        <span className="participant-name">
                          {matching.teacherName}
                        </span>
                      </div>
                    ) : (
                      <div className="participant-info">
                        <span className="participant-label">부모님:</span>
                        <span className="participant-name">
                          {matching.parentName}
                        </span>
                      </div>
                    )}
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
                    <span className="detail-label">공고 제목:</span>
                    <span className="detail-value">
                      {selectedMatching.applicationTitle}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">지역:</span>
                    <span className="detail-value">
                      {selectedMatching.region}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">시급:</span>
                    <span className="detail-value">
                      {selectedMatching.hourlyWage}원
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">근무시간:</span>
                    <span className="detail-value">
                      {selectedMatching.workingHours}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">시작일:</span>
                    <span className="detail-value">
                      {selectedMatching.startDate}
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
                    <span className="detail-value">
                      {selectedMatching.teacherName}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>메시지</h3>
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
                        {selectedMatching.parentMessage}
                      </div>
                    </div>

                    {selectedMatching.teacherMessage && (
                      <div className="message-item">
                        <div className="message-header">
                          <span className="message-author">
                            {selectedMatching.teacherName}님
                          </span>
                          <span className="message-time">
                            {new Date(
                              selectedMatching.createdAt
                            ).toLocaleString("ko-KR")}
                          </span>
                        </div>
                        <div className="message-content">
                          {selectedMatching.teacherMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 쌤인 경우에만 메시지 입력 및 액션 버튼 표시 */}
                {isTeacher && selectedMatching.status === "pending" && (
                  <div className="detail-section">
                    <h3>답장하기</h3>
                    <textarea
                      className="message-input"
                      placeholder="부모님께 답장을 남겨주세요..."
                      value={teacherMessage}
                      onChange={(e) => setTeacherMessage(e.target.value)}
                      rows="4"
                    />
                    <div className="action-buttons">
                      <button
                        className="accept-button"
                        onClick={handleAcceptMatching}
                        disabled={!teacherMessage.trim()}
                      >
                        매칭 수락
                      </button>
                      <button
                        className="reject-button"
                        onClick={handleRejectMatching}
                      >
                        매칭 거절
                      </button>
                    </div>
                  </div>
                )}

                {/* 매칭 완료 버튼 */}
                {selectedMatching.status === "accepted" && (
                  <div className="detail-section">
                    <div className="action-buttons">
                      <button
                        className="complete-button"
                        onClick={handleCompleteMatching}
                      >
                        매칭 완료
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

export default Matchings;
