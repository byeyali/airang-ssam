import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../../contexts/ApplicationContext";
import { useUser } from "../../contexts/UserContext";
import { extractChildGender } from "../../config/api";
import "./ApplicationDetail.css";

function ApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { getApplicationById } = useApplication();
  const { user } = useUser();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (applicationId) {
      const app = getApplicationById(applicationId);
      setApplication(app);
    }
  }, [applicationId, getApplicationById]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (user?.type === "parent" && application?.parentId === user.id) {
      navigate(`/edit-application/${applicationId}`);
    }
  };

  if (!application) {
    return (
      <div className="application-detail-page">
        <div className="application-detail-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 아이 성별 추출
  const childGender = extractChildGender(application);
  const genderText =
    childGender === "male"
      ? "남자아이"
      : childGender === "female"
      ? "여자아이"
      : "성별 미지정";

  return (
    <div className="application-detail-page">
      <div className="application-detail-container">
        <div className="detail-header">
          <button className="back-button" onClick={handleBack}>
            ← 뒤로가기
          </button>
          <h1>공고 상세 정보</h1>
          {user?.type === "parent" && application.parentId === user.id && (
            <button className="edit-button" onClick={handleEdit}>
              공고 수정
            </button>
          )}
        </div>

        <div className="detail-content">
          <div className="application-summary-card">
            <div className="child-avatar-section">
              <div className="child-avatar">
                <img
                  src={
                    application.target.includes("여아")
                      ? "/img/girl.png"
                      : "/img/boy.png"
                  }
                  alt="아이 아바타"
                />
              </div>
              <div className="child-avatar-text">아이 아바타</div>
              {/* 성별 정보 표시 */}
              {childGender && (
                <div className="child-gender-info">
                  <span className="gender-badge">{genderText}</span>
                </div>
              )}
            </div>

            <div className="application-basic-info">
              <div className="application-target">
                {application.target} ({application.region.title})
              </div>
              <div className="application-title">{application.title}</div>
              <div className="application-details">
                <div className="application-date">
                  {application.startDate} 시작
                </div>
                <div className="application-schedule">{application.type}</div>
                <div className="application-payment">{application.payment}</div>
              </div>
            </div>
          </div>

          <div className="detail-info-box">
            <h2>상세 정보</h2>

            <div className="detail-row">
              <span className="detail-label">대상:</span>
              <span className="detail-value">{application.target}</span>
            </div>

            {childGender && (
              <div className="detail-row">
                <span className="detail-label">아이 성별:</span>
                <span className="detail-value">
                  {genderText}
                  <span className="gender-match-note">
                    (같은 성별 선생님 우선 매칭)
                  </span>
                </span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">목적:</span>
              <span className="detail-value">{application.purpose}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">유형:</span>
              <span className="detail-value">{application.type}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">기간:</span>
              <span className="detail-value">{application.period}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">근무시간:</span>
              <span className="detail-value">{application.workingHours}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">가족 구성:</span>
              <span className="detail-value">{application.familyDetails}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">부모님 메시지:</span>
              <span className="detail-value">{application.parentMessage}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">지급액:</span>
              <span className="detail-value">{application.payment}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
