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

  // 사용자 타입에 따른 데이터 필터링
  const getFilteredApplications = () => {
    if (!user) return [];

    if (user.type === "parent") {
      return getMyApplications(user.id);
    } else if (user.type === "teacher") {
      // 쌤은 부모 공고만 볼 수 있고, 지역이 매칭되는 것만
      const allApplications = getAllApplications();
      return allApplications.filter((app) =>
        user.regions.some((region) => app.region.title.includes(region))
      );
    } else if (user.type === "admin") {
      // 관리자는 모든 공고를 볼 수 있음
      return getAllApplications();
    }

    return [];
  };

  const applications = getFilteredApplications();

  const handleEdit = (application) => {
    // 공고 수정을 위해 Helpme 페이지로 이동
    navigate("/Helpme", {
      state: {
        editMode: true,
        applicationData: application,
      },
    });
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
                        <img
                          src={
                            application.target.includes("남아")
                              ? "/img/boy.png"
                              : "/img/girl.png"
                          }
                          alt="아이 아바타"
                        />
                      </div>
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
                    ) : null}
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
