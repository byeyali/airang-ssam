import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplication } from "../../contexts/ApplicationContext";
import { useUser } from "../../contexts/UserContext";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();
  const { getAllApplications, getMyApplications, deleteApplication } =
    useApplication();
  const { user } = useUser();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const applications =
    user?.type === "parent" ? getMyApplications(user.id) : getAllApplications();

  const handleEdit = (application) => {
    // 공고 수정 로직
    console.log("공고 수정:", application);
  };

  const handleDelete = (applicationId) => {
    if (window.confirm("정말로 이 공고를 삭제하시겠습니까?")) {
      deleteApplication(applicationId);
    }
  };

  const handleViewDetail = (application) => {
    setSelectedApplication(application);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedApplication(null);
  };

  const handleApplicationDetail = (applicationId) => {
    navigate(`/application-detail/${applicationId}`);
  };

  return (
    <div className="applications-page">
      <div className="applications-container">
        <div className="applications-header">
          <h1>{user?.type === "parent" ? "내 공고 확인" : "공고 신청 목록"}</h1>
          {user?.type === "parent" && (
            <button
              className="write-application-button"
              onClick={() => navigate("/Helpme")}
            >
              공고 작성하기
            </button>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <p>등록된 공고가 없습니다.</p>
            {user?.type === "parent" && (
              <button
                className="write-application-button-large"
                onClick={() => navigate("/Helpme")}
              >
                첫 공고 작성하기
              </button>
            )}
          </div>
        ) : (
          <div className="applications-content">
            {applications.map((application) => (
              <div key={application.id} className="application-item">
                <div className="application-left">
                  <div className="application-summary-card">
                    <div className="child-avatar-section">
                      <div className="child-avatar">
                        <img src="/img/child-avatar.png" alt="아이 아바타" />
                      </div>
                      <div className="child-avatar-text">아이 아바타</div>
                    </div>

                    <div className="application-basic-info">
                      <div className="application-target">
                        {application.target} ({application.region.title})
                      </div>
                      <div className="application-title">
                        {application.title}
                      </div>
                      <div className="application-details">
                        <div className="application-date">
                          {application.startDate} 시작
                        </div>
                        <div className="application-schedule">
                          {application.type}
                        </div>
                        <div className="application-payment">
                          {application.payment}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="application-right">
                  <div className="detail-info-box">
                    <h2>상세 정보</h2>

                    <div className="detail-row">
                      <span className="detail-label">대상:</span>
                      <span className="detail-value">{application.target}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">목적:</span>
                      <span className="detail-value">
                        {application.purpose}
                      </span>
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
                      <span className="detail-value">
                        {application.workingHours}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">가족 구성:</span>
                      <span className="detail-value">
                        {application.familyDetails}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">부모님 메시지:</span>
                      <span className="detail-value">
                        {application.parentMessage}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">지급액:</span>
                      <span className="detail-value">
                        {application.payment}
                      </span>
                    </div>
                  </div>

                  <div className="application-actions">
                    {user?.type === "parent" &&
                    application.parentId === user.id ? (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(application)}
                        >
                          수정
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(application.id)}
                        >
                          삭제
                        </button>
                      </>
                    ) : user?.type === "teacher" ? (
                      <button
                        className="proceed-matching-button"
                        onClick={() => handleViewDetail(application)}
                      >
                        매칭 진행...
                      </button>
                    ) : null}
                    <button
                      className="view-details-button"
                      onClick={() => handleApplicationDetail(application.id)}
                    >
                      상세 내역 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 상세 보기 모달 */}
        {showDetail && selectedApplication && (
          <div className="detail-modal">
            <div className="detail-content">
              <div className="detail-header">
                <h2>매칭 요청</h2>
                <button className="close-button" onClick={handleCloseDetail}>
                  ×
                </button>
              </div>
              <div className="detail-body">
                <p>매칭 요청 기능은 준비 중입니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
