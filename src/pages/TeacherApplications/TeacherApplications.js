import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeacher } from "../../contexts/TeacherContext";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import "./TeacherApplications.css";

function TeacherApplications() {
  const { getAllTeachers, getHomeTeachers } = useTeacher();
  const { user } = useUser();
  const { createMatching } = useMatching();

  // 쌤 이미지 매핑 함수
  const getTeacherImage = (teacherId) => {
    const imageMap = {
      teacher_001: "/img/teacher-kimyouhghee-womam.png", // 김영희 (28세 여성)
      teacher_002: "/img/teacher-30-man.png", // 박민수 (32세 남성)
      teacher_003: "/img/teacher-kimjiyoung.jpg", // 김지영 (26세 여성)
      teacher_004: "/img/teacher-math-english.jpg", // 최지영 (29세 여성)
      teacher_005: "/img/teacher-studing-with-2children.jpeg", // 한미영 (31세 여성)
      teacher_006: "/img/teacher-30-man.png", // 정성훈 (35세 남성)
      teacher_007: "/img/teacher-30-man.png", // 김태현 (33세 남성)
      teacher_008: "/img/teacher-30-man.png", // 박성훈 (37세 남성)
      teacher_010: "/img/teacher-40-woman.png", // 박O영 (45세 여성)
    };
    return imageMap[teacherId] || "/img/teacher-30-woman.png";
  };

  // 사용자 타입에 따른 쌤 데이터 필터링
  const getFilteredTeachers = () => {
    if (!user) return [];

    if (user.type === "parent") {
      // 부모는 쌤 정보만 볼 수 있고, 지역이 매칭되는 것만
      const allTeachers = getAllTeachers();
      return allTeachers.filter((teacher) =>
        teacher.regions.some((region) => user.region.includes(region))
      );
    } else if (user.type === "tutor") {
      // 쌤은 간략한 쌤 프로필만 볼 수 있음 (상세보기/매칭 제한)
      const allTeachers = getAllTeachers();
      // 쌤이 본인을 볼 때는 원래 이름을 표시하도록 데이터 가공
      return allTeachers.map((teacher) => {
        if (user.id === teacher.id) {
          return {
            ...teacher,
            displayName: teacher.name + " 쌤",
          };
        } else {
          return {
            ...teacher,
            displayName: teacher.maskedName + " 쌤",
          };
        }
      });
    } else if (user.type === "admin") {
      // 관리자는 모든 쌤 정보를 볼 수 있음
      return getAllTeachers();
    }

    return [];
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [matchingMessage, setMatchingMessage] = useState("");

  // 홈페이지에서 온 경우와 일반 접근을 구분
  const teachers = location.state?.fromHome
    ? user
      ? getFilteredTeachers()
      : getHomeTeachers()
    : getFilteredTeachers();

  const handleViewDetail = (teacher) => {
    // 쌤 회원은 상세보기 제한
    if (user && user.type === "tutor") {
      showNotification("쌤 회원은 상세보기를 이용할 수 없습니다.", "warning");
      return;
    }
    navigate(`/teacher-detail/${teacher.id}`);
  };

  const handleOpenMatchingModal = (teacher) => {
    if (!user) {
      showNotification("로그인이 필요합니다.", "error");
      return;
    }

    // 쌤 회원은 매칭 요청 제한
    if (user.type === "tutor") {
      showNotification("쌤 회원은 매칭 요청을 이용할 수 없습니다.", "warning");
      return;
    }

    setShowMatchingModal(true);
    setMatchingMessage("");
  };

  const handleCloseMatchingModal = () => {
    setShowMatchingModal(false);
    setMatchingMessage("");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleProceedMatching = async () => {
    if (!user) {
      showNotification("로그인이 필요합니다.", "error");
      return;
    }

    if (!matchingMessage.trim()) {
      showNotification("매칭 메시지를 입력해주세요.", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      // 매칭 생성 (실제로는 선택된 쌤의 ID가 필요)
      createMatching(user.id, "teacher_001", null, matchingMessage);

      setSubmitSuccess(true);
      showNotification("매칭 요청을 성공적으로 보냈습니다! 💌", "success");

      // 2초 후 모달 닫기
      setTimeout(() => {
        handleCloseMatchingModal();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      showNotification("매칭 요청 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 사용자 친화적인 알림 함수
  const showNotification = (message, type = "info") => {
    // 기존 알림 제거
    const existingNotification = document.querySelector(".custom-notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // 3초 후 자동 제거
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const handleDownloadFile = (fileName, fileType) => {
    // 실제 파일 다운로드 시뮬레이션
    const link = document.createElement("a");
    link.href = `data:${fileType};charset=utf-8,${encodeURIComponent(
      "파일 내용"
    )}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`${fileName} 파일이 다운로드되었습니다.`);
  };

  const handleProfileSetup = () => {
    navigate("/teacher-profile");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return "";
      case "rejected":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="teacher-applications-page">
      <div className="teacher-applications-container">
        <div className="teacher-applications-header">
          <h1>
            {user?.type === "tutor"
              ? "부모님들의 공고 확인"
              : location.state?.fromHome
              ? "우리 아이 쌤 찾기"
              : "지역 공고"}
          </h1>
          {user?.type === "tutor" && (
            <button
              className="setup-profile-button"
              onClick={() => navigate("/teacher-profile")}
            >
              내 프로필 수정
            </button>
          )}
          {user?.type === "parent" && (
            <button
              className="setup-profile-button"
              onClick={() => navigate("/Helpme")}
            >
              공고 작성하기
            </button>
          )}
        </div>

        {user?.type === "parent" && teachers.length === 0 ? (
          <div className="profile-required">
            <div className="profile-required-content">
              <h2>공고를 먼저 작성해주세요</h2>
              <p>
                쌤을 찾기 전에 "도와줘요 쌤" 공고를 먼저 작성해주세요. 공고를
                작성하시면 해당 지역의 쌤들이 확인할 수 있습니다.
              </p>
              <button
                className="setup-profile-button-large"
                onClick={() => navigate("/Helpme")}
              >
                공고 작성하기
              </button>
            </div>
          </div>
        ) : teachers.length === 0 && user?.type !== "parent" ? (
          <div className="no-teachers">
            <p>
              {location.state?.fromHome
                ? "현재 등록된 쌤이 없습니다."
                : "현재 선택한 지역에 등록된 공고가 없습니다."}
            </p>
            <p>나중에 다시 확인해주세요.</p>
          </div>
        ) : (
          <div className="teacher-applications-content">
            <div className="matching-info">
              <h3>
                {location.state?.fromHome
                  ? "활동 중인 쌤들"
                  : "매칭 가능한 공고"}
              </h3>
              <p>
                {location.state?.fromHome
                  ? `총 ${teachers.length}명의 쌤이 활동하고 있습니다.`
                  : `${user?.regions?.join(", ")} 지역에서 등록된 공고 ${
                      teachers.length
                    }개를 확인할 수 있습니다.`}
              </p>
            </div>
            <div className="teachers-list">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="teacher-item">
                  <div className="teacher-summary">
                    <div className="teacher-header-info">
                      <div className="teacher-profile">
                        <img
                          src={getTeacherImage(teacher.id)}
                          alt="쌤 프로필"
                        />
                      </div>
                    </div>
                    <div className="teacher-info">
                      <div className="teacher-name">
                        {teacher.displayName ||
                          (user && user.id === teacher.id
                            ? teacher.name + " 쌤"
                            : teacher.maskedName + " 쌤")}{" "}
                        ({teacher.age}세)
                      </div>
                      <div className="teacher-rating">
                        ⭐ {teacher.rating} ({teacher.experience} 경력)
                      </div>
                      <div className="teacher-details">
                        <div className="teacher-wage">
                          희망 시급 {teacher.hourlyWage}
                        </div>
                        <div className="teacher-location">
                          📍 {teacher.regions.join(", ")}
                        </div>
                        <div className="teacher-certification">
                          {teacher.certification}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-actions">
                    <div className="matching-status">
                      {teacher.matchingStatus === "pending" ? (
                        <span className="status-pending">매칭 진행중</span>
                      ) : teacher.matchingStatus === "matched" ? (
                        <span className="status-matched">매칭 완료</span>
                      ) : (
                        <span className="status-available">매칭 가능</span>
                      )}
                    </div>
                    <button
                      className="matching-request-button-small"
                      onClick={() => handleOpenMatchingModal(teacher)}
                    >
                      매칭요청
                    </button>
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetail(teacher)}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* 매칭 요청 모달 */}
            {showMatchingModal && (
              <div className="matching-modal">
                <div className="matching-content">
                  <div className="matching-header">
                    <h2>매칭 요청</h2>
                    <button
                      className="close-button"
                      onClick={handleCloseMatchingModal}
                    >
                      ×
                    </button>
                  </div>
                  <div className="matching-body">
                    <div className="matching-form">
                      <div className="matching-message-section">
                        <h3>메시지 작성</h3>
                        <p className="matching-description">
                          쌤께 전달할 메시지를 작성해주세요. 아이의 나이, 필요한
                          서비스, 희망하는 시간 등을 포함하면 더 좋은 매칭이
                          가능합니다.
                        </p>
                        <textarea
                          className="matching-message-input"
                          placeholder="예시: 안녕하세요! 7살 아이를 키우고 있는 부모입니다. 방과후 돌봄이 필요해서 연락드립니다. 아이는 활발하고 장난감 놀이를 좋아합니다. 월~금 오후 3시부터 6시까지 가능하시면 연락 부탁드립니다."
                          value={matchingMessage}
                          onChange={(e) => setMatchingMessage(e.target.value)}
                          rows="6"
                        />
                        <div className="message-counter">
                          {matchingMessage.length}/500자
                        </div>
                      </div>

                      <div className="matching-actions">
                        <button
                          className="cancel-button"
                          onClick={handleCloseMatchingModal}
                        >
                          취소
                        </button>
                        <button
                          className={`matching-submit-button ${
                            submitSuccess ? "success" : ""
                          }`}
                          onClick={handleProceedMatching}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="loading-spinner"></span>
                              매칭 요청 중...
                            </>
                          ) : submitSuccess ? (
                            <>매칭 요청 완료!</>
                          ) : (
                            <>매칭 요청 보내기</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherApplications;
