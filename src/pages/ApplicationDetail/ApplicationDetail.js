import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../../contexts/ApplicationContext";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import "./ApplicationDetail.css";

function ApplicationDetail() {
  const { id } = useParams();
  const applicationId = id; // 호환성을 위해 변수명 유지
  const navigate = useNavigate();
  const {
    getApplicationById,
    deleteApplicationCategories,
    deleteApplication,
    updateApplicationStatus,
  } = useApplication();
  const { user } = useUser();
  const { createJobApply } = useMatching();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchingMessage, setMatchingMessage] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      if (applicationId) {
        try {
          setLoading(true);
          setError(null);
          const app = await getApplicationById(applicationId);
          setApplication(app);
        } catch (err) {
          setError(err.message || "공고 정보를 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, getApplicationById]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = async () => {
    if (
      user?.member_type === "parents" &&
      application?.requester_id === user.id
    ) {
      try {
        console.log("applicationId", applicationId);
        // 최신 공고 데이터를 가져옴
        const updatedApplication = await getApplicationById(applicationId);
        navigate("/Helpme", {
          state: {
            editMode: true,
            applicationData: updatedApplication,
          },
        });
      } catch (error) {
        alert("공고 정보를 불러오는데 실패했습니다.");
      }
    }
  };

  const handleDelete = async () => {
    if (
      user?.member_type === "parents" &&
      application?.requester_id === user.id
    ) {
      if (!window.confirm("정말로 이 공고를 삭제하시겠습니까?")) {
        return;
      }

      try {
        // 1. 카테고리 삭제
        await deleteApplicationCategories(applicationId);

        // 2. 공고 삭제
        await deleteApplication(applicationId);

        alert("공고가 성공적으로 삭제되었습니다!");
        navigate("/applications");
      } catch (error) {
        console.error("공고 삭제 실패:", error);
        alert("공고 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePublish = async () => {
    if (
      user?.member_type === "parents" &&
      application?.requester_id === user.id
    ) {
      if (
        !window.confirm(
          "공고 게시후에는 공고 정보가 오픈되고 수정/삭제가 불가능합니다. 이 공고를 게시하시겠습니까?"
        )
      ) {
        return;
      }

      try {
        // 공고 상태를 "open"으로 변경
        await updateApplicationStatus(applicationId, "open");

        alert("공고가 성공적으로 게시되었습니다!");

        // 페이지 새로고침하여 최신 상태 반영
        window.location.reload();
      } catch (error) {
        console.error("공고 게시 실패:", error);
        alert("공고 게시 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleMatchingRequest = async () => {
    if (user?.member_type === "tutor" && application?.status === "open") {
      // 메시지 입력 여부 검증
      if (!matchingMessage.trim()) {
        alert("매칭 요청 메시지를 입력해주세요.");
        return;
      }

      // 메시지 500자 초과 여부 검증
      if (matchingMessage.length > 500) {
        alert("매칭 요청 메시지는 500자 이내로 입력해주세요.");
        return;
      }

      if (!window.confirm("이 공고에 매칭을 요청하시겠습니까?")) {
        return;
      }

      try {
        // createJobApply API 호출
        await createJobApply(applicationId, matchingMessage.trim());

        alert("매칭 요청이 성공적으로 전송되었습니다!");

        // 매칭 페이지로 이동
        navigate("/matchings");
      } catch (error) {
        console.error("매칭 요청 실패:", error);

        // 쌤 프로필 미등록 오류인 경우 특별 처리
        if (error.message && error.message.includes("등록된 쌤이 아닙니다")) {
          if (
            window.confirm(
              "쌤 프로필이 등록되지 않았습니다. 쌤 프로필 등록 페이지로 이동하시겠습니까?"
            )
          ) {
            navigate("/teacher-profile");
          }
        } else {
          alert(
            error.message ||
              "매칭 요청 중 오류가 발생했습니다. 다시 시도해주세요."
          );
        }
      }
    }
  };

  return (
    <div className="applications-page">
      <div className="applications-container">
        {loading ? (
          <div className="loading-container">
            <p>공고 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>오류: {error}</p>
            <button onClick={() => navigate(-1)}>뒤로가기</button>
          </div>
        ) : !application ? (
          <div className="no-applications">
            <p>공고를 찾을 수 없습니다.</p>
            <button onClick={() => navigate(-1)}>뒤로가기</button>
          </div>
        ) : (
          <>
            <div className="applications-header">
              <button
                className="application-detail-back-button"
                onClick={handleBack}
              >
                뒤로가기
              </button>
              <h1>공고 상세 정보</h1>
              <div className="header-right-section">
                <div className="application-detail-status-section">
                  <span className="application-detail-status-value">
                    {application.status === "registered" && "공고등록"}
                    {application.status === "open" && "공고게시"}
                    {application.status === "matched" && "매칭완료"}
                    {application.status === "closed" && "만료"}
                  </span>
                </div>
              </div>
            </div>

            <div className="application-detail-content">
              <div className="detail-info-box">
                <h2>상세 정보</h2>

                <div className="detail-columns">
                  <div className="detail-column">
                    <div className="application-detail-item">
                      <div className="application-detail-label">대상</div>
                      <div className="application-detail-value">
                        {application.target}
                      </div>
                    </div>
                    <div className="application-detail-item">
                      <div className="application-detail-label">근무장소</div>
                      <div className="application-detail-value">
                        {application.work_place}
                      </div>
                    </div>
                    <div className="application-detail-item">
                      <div className="application-detail-label">기간</div>
                      <div className="application-detail-value">
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
                      </div>
                    </div>
                    <div className="application-detail-item">
                      <div className="application-detail-label">근무시간</div>
                      <div className="application-detail-value">
                        {application.start_time} - {application.end_time}
                      </div>
                    </div>
                    {application.tutor_sex && (
                      <div className="application-detail-item">
                        <div className="application-detail-label">
                          선생님 성별
                        </div>
                        <div className="application-detail-value">
                          {application.tutor_sex === "male" ? "남성" : "여성"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="detail-column">
                    <div className="application-detail-item">
                      <div className="application-detail-label">분야</div>
                      <div className="application-detail-value">
                        {application.objective}
                      </div>
                    </div>
                    {application.work_place_address && (
                      <div className="application-detail-item">
                        <div className="application-detail-label">상세주소</div>
                        <div className="application-detail-value">
                          {application.work_place_address}
                        </div>
                      </div>
                    )}
                    <div className="application-detail-item">
                      <div className="application-detail-label">근무요일</div>
                      <div className="application-detail-value">
                        {application.work_day}
                      </div>
                    </div>
                    <div className="application-detail-item">
                      <div className="application-detail-label">시급</div>
                      <div className="application-detail-value">
                        {Math.floor(application.payment)?.toLocaleString()}원
                        {application.negotiable && " (협의가능)"}
                      </div>
                    </div>
                    {application.tutor_age_fr && application.tutor_age_to && (
                      <div className="application-detail-item">
                        <div className="application-detail-label">
                          선생님 나이
                        </div>
                        <div className="application-detail-value">
                          {application.tutor_age_fr}세 ~{" "}
                          {application.tutor_age_to}세
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {application.description && (
                  <div className="application-detail-item">
                    <div className="application-detail-label">요청사항</div>
                    <div className="application-detail-value">
                      {application.description}
                    </div>
                  </div>
                )}
                {user?.member_type === "tutor" &&
                  application?.status === "open" && (
                    <div className="application-matching-request-section">
                      <div className="application-matching-request-label">
                        매칭 요청 메시지
                      </div>
                      <div className="application-matching-request-value">
                        <textarea
                          className="matching-message-textarea application-matching-request-textarea"
                          placeholder="부모님께 전달할 매칭 요청 메시지를 입력해주세요..."
                          value={matchingMessage}
                          onChange={(e) => setMatchingMessage(e.target.value)}
                          rows={4}
                          maxLength={500}
                        />
                        <div className="matching-message-counter application-matching-request-counter">
                          {matchingMessage.length}/500
                        </div>
                      </div>
                    </div>
                  )}
                {user?.member_type === "parents" &&
                  application.requester_id === user.id && (
                    <>
                      <div className="application-detail-buttons">
                        <button
                          className={`application-detail-edit-button ${
                            application.status !== "registered"
                              ? "disabled"
                              : ""
                          }`}
                          onClick={handleEdit}
                          disabled={application.status !== "registered"}
                        >
                          공고수정
                        </button>
                        <button
                          className={`application-detail-publish-button ${
                            application.status !== "registered"
                              ? "disabled"
                              : ""
                          }`}
                          onClick={handlePublish}
                          disabled={application.status !== "registered"}
                        >
                          공고게시
                        </button>
                        <button
                          className={`application-detail-delete-button ${
                            application.status !== "registered"
                              ? "disabled"
                              : ""
                          }`}
                          onClick={handleDelete}
                          disabled={application.status !== "registered"}
                        >
                          공고삭제
                        </button>
                      </div>
                    </>
                  )}
                {user?.member_type === "tutor" && (
                  <div className="application-detail-buttons">
                    <button
                      className={`application-detail-matching-button ${
                        application.status !== "open" ? "disabled" : ""
                      }`}
                      onClick={handleMatchingRequest}
                      disabled={application.status !== "open"}
                    >
                      매칭 요청
                    </button>
                    <div className="tutor-profile-notice">
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginTop: "10px",
                          textAlign: "center",
                        }}
                      >
                        💡 매칭 요청 전에 쌤 프로필을 먼저 등록해주세요!
                      </p>
                      <button
                        className="profile-register-button"
                        onClick={() => navigate("/teacher-profile")}
                        style={{
                          marginTop: "8px",
                          padding: "8px 16px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          color: "#495057",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        쌤 프로필 등록하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ApplicationDetail;
