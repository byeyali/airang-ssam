import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeacher } from "../../contexts/TeacherContext";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./TeacherDetail.css";

function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTeacherById } = useTeacher();
  const { user } = useUser();
  const { createMatchingRequest } = useMatching();
  const { createMatchingRequestNotification } = useNotification();

  const [teacher, setTeacher] = useState(null);
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [matchingMessage, setMatchingMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  useEffect(() => {
    console.log("TeacherDetail useEffect - id:", id);
    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);

    const teacherData = getTeacherById(id);
    console.log("TeacherDetail - teacherData:", teacherData);
    if (teacherData) {
      setTeacher(teacherData);
    } else {
      console.log("TeacherDetail - 쌤 정보 없음, 홈으로 리다이렉트");
      // 쌤 정보가 없으면 홈으로 리다이렉트
      navigate("/", { replace: true });
    }
  }, [id, getTeacherById, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenMatchingModal = () => {
    if (!user) {
      showNotification("로그인이 필요합니다.", "error");
      return;
    }
    setShowMatchingModal(true);
    setMatchingMessage("");
  };

  const handleCloseMatchingModal = () => {
    setShowMatchingModal(false);
    setMatchingMessage("");
  };

  const handleProceedMatching = async () => {
    if (!user) {
      showNotification("로그인이 필요합니다.", "error");
      return;
    }

    if (!matchingMessage.trim()) {
      showNotification("매칭 메시지를 입력해주세요.", "warning");
      return;
    }

    // 지역 매칭 검증
    const parentRegion = user.region;
    const teacherRegions = teacher.regions;

    if (!teacherRegions.includes(parentRegion)) {
      showNotification(
        `죄송합니다. ${teacher.name} 쌤은 ${parentRegion}에서 활동하지 않습니다.`,
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 매칭 요청 생성
      const matchingRequest = createMatchingRequest({
        parentId: user.id,
        teacherId: teacher.id,
        parentName: user.name || "부모님",
        teacherName: teacher.maskedName, // maskedName 사용
        message: matchingMessage,
        applicationId: null, // 나중에 공고 ID 추가 가능
      });

      // 쌤에게 매칭 요청 알림 생성
      createMatchingRequestNotification(teacher.id, user.name || "부모님");

      setSubmitSuccess(true);
      showNotification("매칭 요청을 성공적으로 보냈습니다! 💌", "success");

      setTimeout(() => {
        handleCloseMatchingModal();
        setSubmitSuccess(false);
        // 매칭 현황 페이지로 이동
        navigate("/matchings");
      }, 2000);
    } catch (error) {
      showNotification("매칭 요청 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
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
    showNotification(`${fileName} 파일이 다운로드되었습니다.`, "success");
  };

  const handleDownloadAllFiles = async () => {
    if (!teacher?.uploadedFiles) return;

    setIsDownloading(true);

    try {
      // 실제로는 서버에서 ZIP 파일을 생성하여 다운로드
      // 여기서는 시뮬레이션
      const fileCount = Object.keys(teacher.uploadedFiles).length;

      // 가상의 ZIP 다운로드 시뮬레이션
      const link = document.createElement("a");
      link.href = `data:application/zip;charset=utf-8,${encodeURIComponent(
        "압축된 파일들"
      )}`;
      link.download = `${teacher.maskedName}_파일모음.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification(
        `${fileCount}개 파일이 압축되어 다운로드되었습니다.`,
        "success"
      );
    } catch (error) {
      showNotification("파일 다운로드 중 오류가 발생했습니다.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const showNotification = (message, type = "info") => {
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

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
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

  if (!teacher) {
    return (
      <div className="teacher-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>쌤 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-detail-page">
      {/* 헤더 */}
      <div className="teacher-detail-header">
        <button className="back-button" onClick={handleBack}>
          ← 뒤로가기
        </button>
        <h1>{teacher.maskedName} 쌤 상세정보</h1>
      </div>

      <div className="teacher-detail-container">
        {/* 프로필 섹션 */}
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-image">
              <img src={getTeacherImage(teacher.id)} alt="쌤 프로필" />
            </div>
            <div className="profile-info">
              <h2>
                {user && user.id === teacher.id
                  ? teacher.name + " 쌤"
                  : teacher.maskedName + " 쌤"}
              </h2>
              <div className="profile-rating">
                {renderStars(teacher.rating)} {teacher.rating}
              </div>
              <div className="profile-details">
                <p>
                  <strong>경력:</strong> {teacher.experience}
                </p>
                <p>
                  <strong>희망 시급:</strong> {teacher.hourlyWage}
                </p>
                <p>
                  <strong>활동 지역:</strong> {teacher.regions.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 상세 정보 섹션 */}
        <section className="details-section">
          <div className="details-grid">
            <div className="detail-card">
              <h3>📋 자격증</h3>
              <p>{teacher.certification}</p>
            </div>
            <div className="detail-card">
              <h3>🎯 기술</h3>
              <div className="skills-list">
                {teacher.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="detail-card">
              <h3>💝 선호사항</h3>
              <div className="preferences-list">
                {teacher.preferences.map((preference, index) => (
                  <span key={index} className="preference-tag">
                    {preference}
                  </span>
                ))}
              </div>
            </div>
            <div className="detail-card full-width">
              <h3>📝 소개</h3>
              <p>{teacher.introduction}</p>
            </div>
          </div>
        </section>

        {/* 파일 다운로드 섹션 */}
        {teacher.uploadedFiles &&
          Object.keys(teacher.uploadedFiles).length > 0 && (
            <section className="files-section">
              <div className="files-header">
                <h3>📁 업로드된 파일</h3>
                <button
                  className="download-all-button"
                  onClick={handleDownloadAllFiles}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span className="loading-spinner"></span>
                      압축 중...
                    </>
                  ) : (
                    <>📦 전체 다운로드</>
                  )}
                </button>
              </div>
              <div className="files-grid">
                {Object.entries(teacher.uploadedFiles).map(
                  ([fileType, file]) => (
                    <div key={fileType} className="file-card">
                      <div className="file-info">
                        <div className="file-icon">📄</div>
                        <div className="file-details">
                          <div className="file-name">{file.name}</div>
                          <div className="file-size">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        className="download-file-button"
                        onClick={() => handleDownloadFile(file.name, file.type)}
                      >
                        다운로드
                      </button>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

        {/* 액션 섹션 - 로그인한 사용자만 표시 */}
        {user && (
          <section className="action-section">
            {user.type === "teacher" && user.id === teacher.id ? (
              // 쌤 본인이 보는 경우 - 수정하기 버튼
              <div className="edit-card">
                <h3>프로필 관리</h3>
                <p>내 프로필 정보를 수정하시겠습니까?</p>
                <button
                  className="edit-profile-button"
                  onClick={() => navigate("/teacher-profile")}
                >
                  프로필 수정하기
                </button>
              </div>
            ) : user.type === "parent" ? (
              // 부모가 보는 경우 - 매칭 요청 버튼
              <div className="matching-card">
                <h3>매칭 요청</h3>
                <p>이 쌤과 매칭을 원하시나요? 메시지를 보내보세요!</p>
                <button
                  className="matching-request-button"
                  onClick={handleOpenMatchingModal}
                >
                  매칭 요청하기
                </button>
              </div>
            ) : null}
          </section>
        )}
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
              <div className="teacher-matching-info">
                <div className="teacher-matching-profile">
                  <img src={getTeacherImage(teacher.id)} alt="쌤 프로필" />
                  <div className="teacher-matching-details">
                    <h3>
                      {user && user.id === teacher.id
                        ? teacher.name + " 쌤"
                        : teacher.maskedName + " 쌤"}
                    </h3>
                    <p>
                      ⭐ {teacher.rating} ({teacher.experience} 경력)
                    </p>
                    <p>희망 시급: {teacher.hourlyWage}</p>
                  </div>
                </div>
              </div>

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
  );
}

export default TeacherDetail;
