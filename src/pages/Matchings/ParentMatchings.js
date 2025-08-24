import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatching } from "../../contexts/MatchingContext";
import { useUser } from "../../contexts/UserContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useApplication } from "../../contexts/ApplicationContext";
import "./Matchings.css";

function ParentMatchings() {
  const { user } = useUser();
  const {
    getMatchingRequestsForParent,
    acceptMatchingRequest,
    rejectMatchingRequest,
    getJobApply,
  } = useMatching();
  const {
    createContractProgressNotification,
    createContractCompletedNotification,
    createNotification,
  } = useNotification();
  const { getMyApplications, getApplicationById } = useApplication();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMatching, setSelectedMatching] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractStatus, setContractStatus] = useState({});
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

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

  // 부모 아바타 이미지 매핑 함수
  const getParentAvatar = (parentName) => {
    // 남자 부모 회원들 (이름으로 구분)
    const maleParents = ["이민수", "김태현", "박성훈", "김지훈"];

    if (maleParents.includes(parentName)) {
      return "/img/boy.png"; // 남자 부모
    } else {
      return "/img/girl.png"; // 여자 부모
    }
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

  const matchings = user ? getMatchingRequestsForParent(user.id) : [];

  // 백엔드 API에서 공고 목록 조회
  const fetchApplications = async (params = {}) => {
    if (!user || !user.id || !user.member_type) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getMyApplications(params);

      if (result.success) {
        setApplications(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.error);
        setApplications([]);
      }
    } catch (err) {
      setError("공고 목록을 불러오는 중 오류가 발생했습니다.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

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

  // 컴포넌트 마운트 시 공고 목록 조회
  useEffect(() => {
    if (user && user.id && user.member_type) {
      fetchApplications();
    }
  }, [user]);

  // 페이지 변경 시 공고 목록 조회
  const handlePageChange = (page) => {
    fetchApplications({ page });
  };

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

  const handleEdit = (application) => {
    // 공고 수정을 위해 Helpme 페이지로 이동
    navigate("/Helpme", {
      state: {
        editMode: true,
        applicationData: application,
      },
    });
  };

  const handleApplicationDetail = async (applicationId) => {
    try {
      // 먼저 getApplicationById를 호출하여 데이터를 가져옴
      await getApplicationById(applicationId);
      // 성공하면 상세 페이지로 이동
      navigate(`/application-detail/${applicationId}`);
    } catch (error) {
      alert(error.message || "공고 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleMatchingRequests = async (jobId) => {
    try {
      // MatchingsDetail 페이지로 이동
      navigate(`/matchings-detail/${jobId}`);
    } catch (error) {
      console.error("매칭요청내역 페이지 이동 오류:", error);
      alert("매칭요청내역 페이지로 이동하는데 실패했습니다.");
    }
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

  if (!user || user.member_type !== "parents") {
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
          <button
            className="write-application-button"
            onClick={() => navigate("/Helpme")}
          >
            공고 등록
          </button>
        </div>

        {matchings.length > 0 && (
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
                      {/* 아이 이미지 섹션 */}
                      <div className="child-profile-section">
                        <img
                          src={getChildAvatar(matching.childGender)}
                          alt="아이 아바타"
                          className="child-profile-image"
                        />
                        <div className="child-info-text">
                          <span className="participant-label">우리 아이:</span>
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

        {/* 공고 목록 섹션 */}
        {loading ? (
          <div className="loading-container">
            <p>공고 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>오류: {error}</p>
            <button onClick={() => fetchApplications()}>다시 시도</button>
          </div>
        ) : applications.length === 0 ? (
          <div className="no-applications">
            <p>등록된 공고가 없습니다.</p>
            <button
              className="write-application-button-large"
              onClick={() => navigate("/Helpme")}
            >
              첫 공고 작성하기
            </button>
          </div>
        ) : (
          <div className="applications-content">
            {applications.map((application) => (
              <div key={application.id} className="application-item">
                <div
                  className="application-left"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100px",
                    minWidth: "100px",
                  }}
                >
                  <div
                    className="child-avatar"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "0 auto 5px",
                      border: "3px solid white",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                      background: "white",
                    }}
                  >
                    <img
                      src={
                        application.target.includes("남아")
                          ? "/img/boy.png"
                          : "/img/girl.png"
                      }
                      alt="아이 아바타"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    className="application-status"
                    style={{
                      marginTop: "5px",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {application.status === "registered" && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textAlign: "center",
                          minWidth: "45px",
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                          background:
                            "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                          color: "#8b6914",
                        }}
                      >
                        공고등록
                      </span>
                    )}
                    {application.status === "open" && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textAlign: "center",
                          minWidth: "45px",
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                          background:
                            "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                          color: "white",
                        }}
                      >
                        공고게시
                      </span>
                    )}
                    {application.status === "matched" && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textAlign: "center",
                          minWidth: "45px",
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                          background:
                            "linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)",
                          color: "white",
                        }}
                      >
                        매칭
                      </span>
                    )}
                    {application.status === "closed" && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textAlign: "center",
                          minWidth: "45px",
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                          background:
                            "linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)",
                          color: "white",
                        }}
                      >
                        종료
                      </span>
                    )}
                  </div>
                </div>
                <div className="application-right">
                  <div className="application-info">
                    <div className="applications-details">
                      <p>
                        <strong>대상:</strong> {application.target}
                      </p>
                      <p>
                        <strong>지역:</strong> {application.work_place}
                      </p>
                      <p>
                        <strong>분야:</strong> {application.objective}
                      </p>
                      <p>
                        <strong>기간:</strong>{" "}
                        {application.work_type === "regular"
                          ? "오랫동안"
                          : "한번만"}
                        {application.start_date && (
                          <>
                            {" "}
                            (
                            {new Date(
                              application.start_date
                            ).toLocaleDateString()}
                            {application.end_date &&
                              ` ~ ${new Date(
                                application.end_date
                              ).toLocaleDateString()}`}
                            )
                          </>
                        )}
                      </p>
                      <p>
                        <strong>시급:</strong>{" "}
                        {Math.floor(application.payment)?.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <div className="application-actions">
                    {application.status === "open" && (
                      <button
                        className="view-detail-button"
                        onClick={() => handleMatchingRequests(application.id)}
                      >
                        매칭요청내역
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 페이지네이션 */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  총 {pagination.totalCount}개의 공고 중{" "}
                  {pagination.currentPage}페이지
                </div>
                <div className="pagination-buttons">
                  {pagination.hasPrevPage && (
                    <button
                      className="pagination-button"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                    >
                      이전
                    </button>
                  )}
                  <span className="pagination-current">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  {pagination.hasNextPage && (
                    <button
                      className="pagination-button"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                    >
                      다음
                    </button>
                  )}
                </div>
              </div>
            )}
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
                    <span className="detail-label">우리 아이:</span>
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
