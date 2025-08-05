import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatching } from "../../contexts/MatchingContext";
import { useUser } from "../../contexts/UserContext";
import "./Matchings.css";

function AdminMatchings() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMatching, setSelectedMatching] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 쌤 이미지 매핑 함수
  const getTeacherImage = (teacherId) => {
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
  };

  // 부모 아바타 이미지 매핑 함수
  const getParentAvatar = (parentId) => {
    return "/img/mani-talk2-06.png"; // 기본 부모 아바타
  };

  const matchings = getAllMatchingRequests();

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

  const getContractStatusText = (matching) => {
    if (matching.contractStatus === "progress") return "계약 진행중";
    if (matching.contractStatus === "completed") return "계약 완료";
    if (matching.status === "accepted") return "계약 대기";
    return null;
  };

  const getContractStatusColor = (matching) => {
    if (matching.contractStatus === "progress") return "#ff9800";
    if (matching.contractStatus === "completed") return "#4caf50";
    if (matching.status === "accepted") return "#2196f3";
    return "#6c757d";
  };

  if (!user || user.type !== "admin") {
    return (
      <div className="matchings-page">
        <div className="login-required">
          <h2>관리자만 접근 가능합니다</h2>
          <p>관리자로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matchings-page">
      <div className="matchings-container">
        <div className="matchings-header">
          <h1>전체 매칭 관리</h1>
          <p>모든 매칭 현황을 확인하고 관리하세요</p>
        </div>

        {matchings.length === 0 ? (
          <div className="no-matchings">
            <div className="no-matchings-content">
              <h2>매칭 내역이 없습니다</h2>
              <p>아직 매칭 내역이 없습니다.</p>
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
                      {getContractStatusText(matching) && (
                        <span
                          className="contract-status-badge"
                          style={{
                            backgroundColor: getContractStatusColor(matching),
                          }}
                        >
                          {getContractStatusText(matching)}
                        </span>
                      )}
                    </div>
                    <div className="matching-date">
                      {new Date(matching.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                  </div>

                  <div className="matching-info">
                    <div className="matching-title">
                      {matching.parentName}님 ↔ {matching.teacherName}님
                    </div>
                    <div className="matching-details">
                      <div className="matching-message">{matching.message}</div>
                      <div className="matching-status-info">
                        {matching.status === "pending" && "응답 대기중입니다"}
                        {matching.status === "accepted" &&
                          "매칭이 수락되었습니다"}
                        {matching.status === "rejected" &&
                          "매칭이 거절되었습니다"}
                      </div>
                    </div>
                  </div>

                  <div className="matching-participants">
                    <div className="participant-info">
                      <div className="teacher-profile-section">
                        <img
                          src={getParentAvatar(matching.parentId)}
                          alt="부모님 아바타"
                          className="teacher-profile-image"
                        />
                        <div className="teacher-info-text">
                          <span className="participant-label">부모님:</span>
                          <span className="participant-name">
                            {matching.parentName}
                          </span>
                        </div>
                      </div>
                      <div className="teacher-profile-section">
                        <img
                          src={getTeacherImage(matching.teacherId)}
                          alt="쌤 프로필"
                          className="teacher-profile-image"
                        />
                        <div className="teacher-info-text">
                          <span className="participant-label">쌤:</span>
                          <span className="participant-name">
                            {matching.teacherName}
                          </span>
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
                  {getContractStatusText(selectedMatching) && (
                    <div className="detail-row">
                      <span className="detail-label">계약 상태:</span>
                      <span
                        className="detail-value status-badge"
                        style={{
                          backgroundColor:
                            getContractStatusColor(selectedMatching),
                        }}
                      >
                        {getContractStatusText(selectedMatching)}
                      </span>
                    </div>
                  )}
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
                            {selectedMatching.parentName}님
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMatchings;
