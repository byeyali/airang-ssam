import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./TeacherNotifications.css";

function TeacherNotifications() {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    getMatchingRequestsForTeacher,
    acceptMatchingRequest,
    rejectMatchingRequest,
  } = useMatching();
  const { createMatchingResponseNotification } = useNotification();

  const [matchingRequests, setMatchingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (user && user.type === "teacher") {
      const requests = getMatchingRequestsForTeacher(user.id);
      setMatchingRequests(requests);
    }
  }, [user, getMatchingRequestsForTeacher]);

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  const handleAcceptRequest = (requestId) => {
    acceptMatchingRequest(requestId);

    // 부모에게 수락 알림 보내기
    const request = matchingRequests.find((r) => r.id === requestId);
    if (request) {
      createMatchingResponseNotification(
        request.parentId,
        user.name,
        "accepted"
      );
    }

    // 목록 업데이트
    setMatchingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "accepted", respondedAt: new Date().toISOString() }
          : r
      )
    );

    handleCloseModal();
    alert("매칭 요청을 수락했습니다.");
  };

  const handleRejectRequest = (requestId) => {
    rejectMatchingRequest(requestId);

    // 부모에게 거절 알림 보내기
    const request = matchingRequests.find((r) => r.id === requestId);
    if (request) {
      createMatchingResponseNotification(
        request.parentId,
        user.name,
        "rejected"
      );
    }

    // 목록 업데이트
    setMatchingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "rejected", respondedAt: new Date().toISOString() }
          : r
      )
    );

    handleCloseModal();
    alert("매칭 요청을 거절했습니다.");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      default:
        return "알 수 없음";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "accepted":
        return "status-accepted";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  if (!user || user.type !== "teacher") {
    return (
      <div className="teacher-notifications-page">
        <div className="teacher-notifications-container">
          <h1>접근 권한이 없습니다.</h1>
          <p>쌤 회원만 이용할 수 있는 서비스입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-notifications-page">
      <div className="teacher-notifications-container">
        <div className="teacher-notifications-header">
          <h1>매칭 요청 관리</h1>
          <p>부모님들의 매칭 요청을 확인하고 응답하세요</p>
        </div>

        {matchingRequests.length === 0 ? (
          <div className="no-requests">
            <p>아직 매칭 요청이 없습니다.</p>
            <p>부모님이 매칭을 요청하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="matching-requests-list">
            {matchingRequests.map((request) => (
              <div key={request.id} className="matching-request-card">
                <div className="request-header">
                  <div className="request-info">
                    <h3>{request.parentName}님의 매칭 요청</h3>
                    <span
                      className={`status-badge ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  <span className="request-date">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="request-message">
                  <p>{request.message}</p>
                </div>

                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      className="accept-button"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      수락
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      거절
                    </button>
                    <button
                      className="detail-button"
                      onClick={() => handleViewDetail(request)}
                    >
                      상세보기
                    </button>
                  </div>
                )}

                {request.status !== "pending" && (
                  <div className="request-actions">
                    <button
                      className="detail-button"
                      onClick={() => handleViewDetail(request)}
                    >
                      상세보기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 상세보기 모달 */}
        {showDetailModal && selectedRequest && (
          <div className="detail-modal">
            <div className="detail-content">
              <div className="detail-header">
                <h2>매칭 요청 상세</h2>
                <button className="close-button" onClick={handleCloseModal}>
                  ×
                </button>
              </div>
              <div className="detail-body">
                <div className="detail-section">
                  <h3>요청 정보</h3>
                  <p>
                    <strong>부모님:</strong> {selectedRequest.parentName}
                  </p>
                  <p>
                    <strong>요청일:</strong>{" "}
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>상태:</strong>{" "}
                    {getStatusText(selectedRequest.status)}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>메시지</h3>
                  <p>{selectedRequest.message}</p>
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="detail-actions">
                    <button
                      className="accept-button-large"
                      onClick={() => handleAcceptRequest(selectedRequest.id)}
                    >
                      매칭 수락
                    </button>
                    <button
                      className="reject-button-large"
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                    >
                      매칭 거절
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherNotifications;
