import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplication } from "../../contexts/ApplicationContext";
import { useUser } from "../../contexts/UserContext";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();
  const { getAllApplications, getMyApplications, getApplicationById } =
    useApplication();
  const { user } = useUser();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

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

  const handleEdit = (application) => {
    // 공고 수정을 위해 Helpme 페이지로 이동
    navigate("/Helpme", {
      state: {
        editMode: true,
        applicationData: application,
      },
    });
  };

  const handleViewDetail = (application) => {
    setSelectedApplication(application);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedApplication(null);
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

  return (
    <div className="applications-page">
      <div className="applications-container">
        <div className="applications-header">
          <h1>
            {user?.member_type === "parents"
              ? "내 공고 확인"
              : "공고 신청 목록"}
          </h1>
          {user?.member_type === "parents" && (
            <button
              className="write-application-button"
              onClick={() => navigate("/Helpme")}
            >
              공고 작성하기
            </button>
          )}
        </div>

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
            {user?.member_type === "parents" && (
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
                <div className="application-right">
                  <div className="application-info">
                    <div className="applications-details">
                      <p>
                        <strong>대상:</strong> {application.target}
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
                    <button
                      className="view-detail-button"
                      onClick={() => handleApplicationDetail(application.id)}
                    >
                      상세보기
                    </button>
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
