import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatching } from "../../contexts/MatchingContext";
import { useUser } from "../../contexts/UserContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./Matchings.css";

function TeacherMatchings() {
  const { user } = useUser();
  const { getJobApplyMatch, updateApplyStatus, updateApplyConfirm } =
    useMatching();
  const navigate = useNavigate();

  const [acceptedMatchings, setAcceptedMatchings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 화면 로드 시 수락된 매칭 요청 조회
  useEffect(() => {
    const fetchAcceptedMatchings = async () => {
      if (!user || !user.id) {
        console.log("사용자 정보 없음:", user);
        return;
      }

      console.log("현재 사용자 정보:", user);
      console.log("사용자 타입:", user.member_type);

      try {
        setLoading(true);
        setError(null);
        console.log("getJobApplyMatch 호출 시작");
        const result = await getJobApplyMatch();
        console.log("getJobApplyMatch 결과:", result);

        if (result.success) {
          console.log("수락된 매칭 요청 데이터:", result.data);
          setAcceptedMatchings(result.data);
        } else {
          console.log("API 호출 실패:", result.message);
          setError(
            result.message || "수락된 매칭 요청을 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("getJobApplyMatch 오류:", err);
        setError(err.message || "수락된 매칭 요청을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedMatchings();
  }, [user, getJobApplyMatch]);

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
    <div className="matching-detail-page">
      <div className="matching-detail-container">
        {loading ? (
          <div className="loading-container">
            <p>수락된 매칭 요청을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>오류: {error}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        ) : acceptedMatchings.length === 0 ? (
          <div className="no-matchings">
            <div className="no-matchings-content">
              <h2>수락된 매칭 요청이 없습니다</h2>
              <p>아직 수락된 매칭 요청이 없습니다.</p>
              <button
                className="find-applications-button"
                onClick={() => navigate("/applications")}
              >
                공고 보러가기
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="matching-detail-header">
              <h1>수락된 매칭 요청</h1>
            </div>

            <div className="matching-detail-content">
              {acceptedMatchings.map((matching) => (
                <div key={matching.id} className="matching-detail-info-box">
                  <h2>매칭 정보</h2>

                  <div className="matching-detail-item">
                    <div className="matching-detail-label">공고 제목</div>
                    <div className="matching-detail-value">
                      {matching.jobTitle}
                    </div>
                  </div>

                  <div className="matching-detail-columns">
                    {/* 1열: 대상, 목적 */}
                    <div className="matching-detail-column">
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">대상</div>
                        <div className="matching-detail-value">
                          {matching.jobTarget}
                        </div>
                      </div>
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">목적</div>
                        <div className="matching-detail-value">
                          {matching.jobObjective}
                        </div>
                      </div>
                    </div>

                    {/* 2열: 지역, 급여 */}
                    <div className="matching-detail-column">
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">지역</div>
                        <div className="matching-detail-value">
                          {matching.jobWorkPlace}
                        </div>
                      </div>
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">시급</div>
                        <div className="matching-detail-value">
                          {Math.floor(matching.jobPayment)?.toLocaleString()}원
                        </div>
                      </div>
                    </div>

                    {/* 3열: 신청일시, 상태 */}
                    <div className="matching-detail-column">
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">신청일시</div>
                        <div className="matching-detail-value">
                          {new Date(matching.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">상태</div>
                        <div className="matching-detail-value">
                          <span className="matching-status-badge matching-status-accept">
                            수락됨
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 부모님 정보 */}
                  <div className="matching-detail-columns">
                    <div className="matching-detail-column">
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">부모님</div>
                        <div className="matching-detail-value">
                          {matching.parentName}
                        </div>
                      </div>
                    </div>

                    <div className="matching-detail-column">
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">이메일</div>
                        <div className="matching-detail-value">
                          {matching.parentEmail}
                        </div>
                      </div>
                    </div>

                    <div className="matching-detail-column">
                      <div className="matching-detail-item">
                        <div className="matching-detail-label">연락처</div>
                        <div className="matching-detail-value">
                          {matching.parentPhone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="matching-detail-item">
                    <div className="matching-detail-label">공고 설명</div>
                    <div className="matching-detail-value">
                      {matching.jobDescription}
                    </div>
                  </div>

                  <div className="matching-detail-item">
                    <div className="matching-detail-label">신청 메시지</div>
                    <div className="matching-detail-value">
                      {matching.message}
                    </div>
                  </div>

                  <div
                    className="matching-detail-item"
                    style={{ textAlign: "center" }}
                  >
                    <div className="matching-detail-label">매칭 쌤</div>
                    <div className="matching-detail-value">
                      {matching.tutorName}
                    </div>
                  </div>

                  <div className="matching-detail-buttons">
                    <button
                      className="matching-detail-accept-button"
                      onClick={async () => {
                        try {
                          await updateApplyConfirm(
                            matching.jobId,
                            matching.id,
                            "confirm"
                          );
                          alert("계약이 진행되었습니다!");
                          window.location.reload();
                        } catch (error) {
                          console.error("계약 진행 실패:", error);
                          alert("계약 진행 중 오류가 발생했습니다.");
                        }
                      }}
                    >
                      계약 진행
                    </button>
                    <button
                      className="matching-detail-reject-button"
                      onClick={async () => {
                        try {
                          await updateApplyConfirm(
                            matching.jobId,
                            matching.id,
                            "reject"
                          );
                          alert("매칭이 취소되었습니다!");
                          window.location.reload();
                        } catch (error) {
                          console.error("매칭 취소 실패:", error);
                          alert("매칭 취소 중 오류가 발생했습니다.");
                        }
                      }}
                    >
                      매칭 취소
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherMatchings;
