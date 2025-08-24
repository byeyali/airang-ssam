import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../../contexts/ApplicationContext";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import "./MatchingsDetail.css";

function MatchingsDetail() {
  const { id } = useParams();
  const jobId = id; // 공고 ID
  const navigate = useNavigate();
  const { user } = useUser();
  const { getJobApply, updateApplyStatus } = useMatching();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (jobId) {
        try {
          setLoading(true);
          setError(null);
          const result = await getJobApply(jobId);
          if (result.success) {
            setApplications(result.data);
          } else {
            setError(
              result.message || "매칭요청내역을 불러오는데 실패했습니다."
            );
          }
        } catch (err) {
          setError(err.message || "매칭요청내역을 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAccept = async (applyId) => {
    if (!window.confirm("이 선생님의 매칭 요청을 수락하시겠습니까?")) {
      return;
    }

    try {
      await updateApplyStatus(jobId, applyId, "accept");
      alert("매칭 요청이 수락되었습니다!");
      window.location.reload();
    } catch (error) {
      console.error("매칭 요청 수락 실패:", error);
      alert("매칭 요청 수락 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (applyId) => {
    if (!window.confirm("이 선생님의 매칭 요청을 거절하시겠습니까?")) {
      return;
    }

    try {
      await updateApplyStatus(jobId, applyId, "reject");
      alert("매칭 요청이 거절되었습니다!");
      window.location.reload();
    } catch (error) {
      console.error("매칭 요청 거절 실패:", error);
      alert("매칭 요청 거절 중 오류가 발생했습니다.");
    }
  };

  // 신청 상태에 따른 텍스트 반환
  const getStatusText = (status) => {
    switch (status) {
      case "ready":
        return "대기중";
      case "accept":
        return "수락됨";
      case "reject":
        return "거절됨";
      case "confirm":
        return "확정됨";
      case "contract":
        return "계약완료";
      default:
        return status;
    }
  };

  return (
    <div className="matching-detail-page">
      <div className="matching-detail-container">
        {loading ? (
          <div className="loading-container">
            <p>매칭요청내역을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>오류: {error}</p>
            <button onClick={() => navigate(-1)}>뒤로가기</button>
          </div>
        ) : applications.length === 0 ? (
          <div className="no-applications">
            <p>매칭요청내역이 없습니다.</p>
            <button onClick={() => navigate(-1)}>뒤로가기</button>
          </div>
        ) : (
          <>
            <div className="matching-detail-header">
              <button
                className="matching-detail-back-button"
                onClick={handleBack}
              >
                뒤로가기
              </button>
              <h1>매칭요청내역</h1>
            </div>

            <div className="matching-detail-content">
              {applications.map((application) => {
                console.log("application 데이터:", application);
                return (
                  <div
                    key={application.id}
                    className="matching-detail-info-box"
                  >
                    <h2>매칭요청 선생님정보</h2>

                    <div className="matching-detail-columns">
                      {/* 1열: 이름, 학교, 경력 */}
                      <div className="matching-detail-column">
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">이름</div>
                          <div className="matching-detail-value">
                            {application.tutorName}
                          </div>
                        </div>
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">학교</div>
                          <div className="matching-detail-value">
                            {application.school}
                          </div>
                        </div>
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">경력</div>
                          <div className="matching-detail-value">
                            {application.careerYears}년
                          </div>
                        </div>
                      </div>

                      {/* 2열: 출생년도, 전공, 신청일시 */}
                      <div className="matching-detail-column">
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">출생년도</div>
                          <div className="matching-detail-value">
                            {application.birthYear}년
                          </div>
                        </div>
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">전공</div>
                          <div className="matching-detail-value">
                            {application.major}
                          </div>
                        </div>
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">신청일시</div>
                          <div className="matching-detail-value">
                            {new Date(application.appliedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* 3열: 성별, 졸업유무, 상태 */}
                      <div className="matching-detail-column">
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">성별</div>
                          <div className="matching-detail-value">
                            {application.gender === "female" ? "여성" : "남성"}
                          </div>
                        </div>
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">졸업유무</div>
                          <div className="matching-detail-value">
                            {application.isGraduate === "attending"
                              ? "재학중"
                              : application.isGraduate === "graduate"
                              ? "졸업"
                              : application.isGraduate}
                          </div>
                        </div>
                        <div className="matching-detail-item">
                          <div className="matching-detail-label">상태</div>
                          <div className="matching-detail-value">
                            <span
                              className={`matching-status-badge matching-status-${application.applyStatus}`}
                            >
                              {getStatusText(application.applyStatus)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="matching-detail-item">
                      <div className="matching-detail-label">소개글</div>
                      <div className="matching-detail-value">
                        {application.introduction}
                      </div>
                    </div>

                    <div className="matching-detail-item">
                      <div className="matching-detail-label">메시지</div>
                      <div className="matching-detail-value">
                        {application.message}
                      </div>
                    </div>

                    {application.applyStatus === "ready" && (
                      <div className="matching-detail-buttons">
                        <button
                          className="matching-detail-accept-button"
                          onClick={() => handleAccept(application.id)}
                        >
                          수락
                        </button>
                        <button
                          className="matching-detail-reject-button"
                          onClick={() => handleReject(application.id)}
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MatchingsDetail;
