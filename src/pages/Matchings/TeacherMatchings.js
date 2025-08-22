import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatching } from "../../contexts/MatchingContext";
import { useUser } from "../../contexts/UserContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./Matchings.css";

function TeacherMatchings() {
  const { user } = useUser();
  const {
    getMatchingRequestsForTeacher,
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

  // 부모 아바타 이미지 매핑 함수
  const getParentAvatar = (parentId) => {
    return "/img/mani-talk2-06.png"; // 기본 부모 아바타
  };

  // 아이 성별에 따른 이미지 매핑 함수
  const getChildAvatar = (childGender) => {
    if (childGender === "male") {
      return "/img/boy.png"; // 남자아이
    } else if (childGender === "female") {
      return "/img/girl.png"; // 여자아이
    } else {
      return "/img/boyandgirl.jpg"; // 성별 미지정 (남녀 아이 이미지)
    }
  };

  // 쌤 이미지 매핑 함수
  const getTeacherImage = useCallback((teacherId) => {
    const imageMap = {
      teacher_001: "/img/teacher-kimyouhghee-womam.png", // 김영희
      teacher_002: "/img/teacher-man-ball.jpg", // 박민수
      teacher_003: "/img/teacher-kimjiyoung.jpg", // 김지영
      teacher_004: "/img/teacher-math-english.jpg", // 최지영
      teacher_005: "/img/teacher-woman-31-glasses.png", // 한미영
      teacher_006: "/img/teacher-man-readingbook.png", // 정성훈
      teacher_007: "/img/kimtashyeon-man.png", // 김태현
      teacher_008: "/img/teacher-30-man.png", // 박성훈
      teacher_009: "/img/teacher-20-woman.png", // 이미영
      teacher_010: "/img/teacher-40-woman.png", // 박지영 (45세)
      teacher_011: "/img/teacher-60-woman.png", // 최영희 (55세)
    };
    return imageMap[teacherId] || "/img/teacher-30-woman.png";
  }, []);

  const matchings = user ? getMatchingRequestsForTeacher(user.id) : [];

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

  const handleAcceptMatching = () => {
    if (selectedMatching) {
      acceptMatchingRequest(selectedMatching.id);
      handleCloseDetail();
      alert("매칭을 수락했습니다.");
    }
  };

  const handleRejectMatching = () => {
    if (selectedMatching) {
      rejectMatchingRequest(selectedMatching.id);
      handleCloseDetail();
      alert("매칭을 거절했습니다.");
    }
  };

  const handleAcceptContract = () => {
    if (selectedMatching) {
      console.log("계약이 완료되었습니다.");
      setContractStatus((prev) => ({
        ...prev,
        [selectedMatching.id]: "completed",
      }));
      handleCloseDetail();
      // 부모에게 계약 완료 알림 생성
      createContractCompletedNotification(
        selectedMatching.parentId,
        selectedMatching.teacherName
      );
      // 쌤에게도 계약 완료 알림 생성
      createNotification({
        userId: selectedMatching.teacherId,
        type: "contract_completed_teacher",
        title: "계약 수락 완료",
        message: `${selectedMatching.parentName}님과의 계약을 수락했습니다!`,
        isRead: false,
      });
      showNotification("계약이 완료되었습니다!", "success");
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

  if (!user || user.member_type !== "tutor") {
    return (
      <div className="matchings-page">
        <div className="login-required">
          <h2>쌤 회원만 접근 가능합니다</h2>
          <p>쌤 회원으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matchings-page">
      <div className="matchings-container">
        <div className="matchings-header">
          <h1>받은 매칭 요청</h1>
          <p>부모님으로부터 받은 매칭 요청을 확인하고 응답하세요</p>
        </div>

        {matchings.length === 0 ? (
          <div className="no-matchings">
            <div className="no-matchings-content">
              <h2>받은 매칭 요청이 없습니다</h2>
              <p>아직 부모님으로부터 매칭 요청을 받지 않았습니다.</p>
              <button
                className="find-applications-button"
                onClick={() => navigate("/teacher-profile")}
              >
                프로필 관리하기
              </button>
            </div>
          </div>
        ) : (
          <div className="matchings-content">
            <div className="matchings-list">
              {matchings.map((matching) => (
                <div key={matching.id} className="matching-item">
                  <div className="matching-header">
                    <div className="matching-date">
                      {new Date(matching.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                  </div>

                  <div className="matching-info">
                    <div className="matching-title">
                      {matching.parentName}님의 매칭 요청
                    </div>
                    <div className="matching-details">
                      <div className="matching-message">{matching.message}</div>
                      {matching.status === "pending" && (
                        <div className="matching-status-info">
                          응답 대기중입니다
                        </div>
                      )}
                      {matching.status === "accepted" && (
                        <div className="matching-status-info">
                          매칭을 수락했습니다
                        </div>
                      )}
                      {matching.status === "rejected" && (
                        <div className="matching-status-info">
                          매칭을 거절했습니다
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="matching-participants">
                    <div className="participant-info">
                      {/* 아이 이미지 섹션 */}
                      <div className="child-profile-section">
                        <img
                          src={getChildAvatar(matching.childGender)}
                          alt="아이 아바타"
                          className="child-profile-image"
                        />
                        <div className="child-info-text">
                          <span className="participant-label">돌봄 대상:</span>
                          <span className="child-gender-text">
                            {matching.childGender === "male"
                              ? "남자아이"
                              : matching.childGender === "female"
                              ? "여자아이"
                              : "성별 미지정"}
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
                    <span className="detail-label">돌봄 대상:</span>
                    <div className="child-detail-section">
                      <img
                        src={getChildAvatar(selectedMatching.childGender)}
                        alt="아이 아바타"
                        className="child-detail-image"
                      />
                      <span className="detail-value">
                        {selectedMatching.childGender === "male"
                          ? "남자아이"
                          : selectedMatching.childGender === "female"
                          ? "여자아이"
                          : "성별 미지정"}
                      </span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">공고 정보:</span>
                    <span className="detail-value">
                      {selectedMatching.applicationTitle ||
                        "공고 정보를 불러오는 중..."}
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

                {/* 쌤인 경우에만 액션 버튼 표시 */}
                {selectedMatching.status === "pending" && (
                  <div className="detail-section">
                    <h3>매칭 응답</h3>
                    <div className="action-buttons">
                      <button
                        className="accept-button"
                        onClick={handleAcceptMatching}
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

                {/* 계약 수락 버튼 */}
                {selectedMatching.status === "accepted" && (
                  <div className="detail-section">
                    <div className="action-buttons">
                      {contractStatus[selectedMatching.id] === "progress" && (
                        <button
                          className="accept-contract-button"
                          onClick={handleAcceptContract}
                        >
                          계약 수락
                        </button>
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
    </div>
  );
}

export default TeacherMatchings;
