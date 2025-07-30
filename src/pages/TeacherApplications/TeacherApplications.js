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
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [matchingMessage, setMatchingMessage] = useState("");

  // 홈페이지에서 온 경우 전체 쌤 목록, 그렇지 않으면 홈용 쌤 2명
  const teachers = location.state?.fromHome
    ? getAllTeachers()
    : getHomeTeachers();

  const handleViewDetail = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedTeacher(null);
    setMatchingMessage("");
  };

  const handleProceedMatching = (teacher) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!matchingMessage.trim()) {
      alert("매칭 메시지를 입력해주세요.");
      return;
    }

    // 매칭 생성 (실제로는 선택된 쌤의 ID가 필요)
    const teacherId = teacher.id;
    createMatching(user.id, teacherId, null, matchingMessage);

    alert("매칭 요청을 보냈습니다.");
    handleCloseDetail();
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

  return (
    <div className="teacher-applications-page">
      <div className="teacher-applications-container">
        <div className="teacher-applications-header">
          <h1>
            {location.state?.fromHome ? "우리 아이 쌤 찾기" : "지역 공고"}
          </h1>
          {!user?.profileCompleted && (
            <button
              className="setup-profile-button"
              onClick={handleProfileSetup}
            >
              프로필 등록하기
            </button>
          )}
        </div>

        {!user?.profileCompleted ? (
          <div className="profile-required">
            <div className="profile-required-content">
              <h2>프로필 등록이 필요합니다</h2>
              <p>
                활동 가능한 지역과 분야를 등록하시면 해당 지역의 쌤들을 확인할
                수 있습니다.
              </p>
              <button
                className="setup-profile-button-large"
                onClick={handleProfileSetup}
              >
                프로필 등록하기
              </button>
            </div>
          </div>
        ) : teachers.length === 0 ? (
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
                        <img src={teacher.profileImage} alt="쌤 프로필" />
                      </div>
                      <div className="heart-icon">♡</div>
                    </div>
                    <div className="teacher-info">
                      <div className="teacher-name">
                        {teacher.maskedName} ({teacher.age}세)
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
                        <span className="status-pending">진행중</span>
                      ) : teacher.matchingStatus === "matched" ? (
                        <span className="status-matched">완료</span>
                      ) : (
                        <span className="status-available">가능</span>
                      )}
                    </div>
                    <button
                      className="matching-request-button-small"
                      onClick={() => handleProceedMatching(teacher)}
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

            {/* 상세 보기 모달 */}
            {showDetail && selectedTeacher && (
              <div className="detail-modal">
                <div className="detail-content">
                  <div className="detail-header">
                    <h2>쌤 상세 정보</h2>
                    <button
                      className="close-button"
                      onClick={handleCloseDetail}
                    >
                      ×
                    </button>
                  </div>
                  <div className="detail-body">
                    <div className="teacher-detail-profile">
                      <img src={selectedTeacher.profileImage} alt="쌤 프로필" />
                      <div className="teacher-detail-info">
                        <h3>
                          {selectedTeacher.maskedName} ({selectedTeacher.age}세)
                        </h3>
                        <p>
                          ⭐ {selectedTeacher.rating} (
                          {selectedTeacher.experience} 경력)
                        </p>
                        <p>희망 시급: {selectedTeacher.hourlyWage}</p>
                        <p>활동 지역: {selectedTeacher.regions.join(", ")}</p>
                      </div>
                    </div>

                    <div className="detail-info-grid">
                      <div className="detail-row">
                        <span className="detail-label">자격증</span>
                        <span className="detail-value">
                          {selectedTeacher.certification}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">자격</span>
                        <span className="detail-value">
                          {selectedTeacher.qualifications.join(", ")}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">기술</span>
                        <span className="detail-value">
                          {selectedTeacher.skills.join(", ")}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">선호사항</span>
                        <span className="detail-value">
                          {selectedTeacher.preferences.join(", ")}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">소개</span>
                        <span className="detail-value">
                          {selectedTeacher.introduction}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 업로드된 파일 다운로드 섹션 */}
                  {selectedTeacher.uploadedFiles &&
                    Object.keys(selectedTeacher.uploadedFiles).length > 0 && (
                      <div className="uploaded-files-section">
                        <h3>업로드된 파일</h3>
                        <div className="files-grid">
                          {Object.entries(selectedTeacher.uploadedFiles).map(
                            ([key, file]) => (
                              <div key={key} className="file-item">
                                <div className="file-info">
                                  <span className="file-name">{file.name}</span>
                                  <span className="file-size">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                                <button
                                  className="download-button"
                                  onClick={() =>
                                    handleDownloadFile(file.name, file.type)
                                  }
                                >
                                  다운로드
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="detail-actions">
                    <div className="matching-section">
                      <h3>매칭 요청</h3>
                      <textarea
                        className="matching-message"
                        placeholder="쌤께 전달할 메시지를 입력해주세요..."
                        value={matchingMessage}
                        onChange={(e) => setMatchingMessage(e.target.value)}
                      />
                      <button
                        className="matching-request-button"
                        onClick={() => handleProceedMatching(selectedTeacher)}
                      >
                        매칭 요청 보내기
                      </button>
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
