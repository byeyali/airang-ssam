import React, { useState, useMemo } from "react";
import { useReview } from "../../contexts/ReviewContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "./Reviews.css";

function Reviews() {
  const { reviews } = useReview();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    teacherName: "",
    rating: 5,
    content: "",
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6; // 한 페이지당 보여줄 후기 개수

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서는 후기 추가만 처리
    setFormData({ teacherName: "", rating: 5, content: "" });
    setShowAddForm(false);
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const handleMyReviews = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    navigate("/my-reviews");
  };

  const handleStarClick = (starRating) => {
    setFormData((prev) => ({ ...prev, rating: starRating }));
  };

  // 최신 후기부터 정렬하고 페이지네이션 적용
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      // date 필드를 기준으로 정렬 (최신순)
      const dateA = new Date(a.date.replace(/\./g, "-"));
      const dateB = new Date(b.date.replace(/\./g, "-"));
      return dateB - dateA;
    });
  }, [reviews]);

  // 현재 페이지의 후기들
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // 총 페이지 수
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  // 디버깅용 콘솔 로그
  console.log("총 후기 수:", sortedReviews.length);
  console.log("페이지당 후기 수:", reviewsPerPage);
  console.log("총 페이지 수:", totalPages);
  console.log("현재 페이지:", currentPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>부모님들의 후기</h1>
        <p>다른 부모님들의 생생한 후기를 확인해보세요</p>
      </div>

      {/* 부모 회원만 후기 작성/관리 버튼 표시 */}
      {user && user.type === "parent" && (
        <div className="reviews-actions">
          <button
            className="action-button write-review-btn"
            onClick={() => {
              setShowAddForm(!showAddForm);
            }}
          >
            후기 작성하기
          </button>
          <button
            className="action-button my-reviews-btn"
            onClick={handleMyReviews}
          >
            내 후기 관리
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="add-review-form">
          <h2>새 후기 작성하기</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>쌤 이름:</label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teacherName: e.target.value,
                  }))
                }
                placeholder="쌤 이름을 입력해주세요"
                required
              />
            </div>

            <div className="form-group">
              <label>평점:</label>
              <div className="rating-group">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="star"
                      onClick={() => handleStarClick(star)}
                      style={{ opacity: star <= formData.rating ? 1 : 0.3 }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="rating-text">({formData.rating}점)</span>
              </div>
            </div>

            <div className="form-group">
              <label>후기 내용:</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="쌤에 대한 후기를 자유롭게 작성해주세요"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                등록하기
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-grid">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="mom-icon">👩‍👧‍👦</div>
                <div className="review-info">
                  <div className="review-location">{review.region}</div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <div className="review-text">{review.content}</div>
              <div className="review-author">{review.maskedName}님의 후기</div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <h3>아직 후기가 없습니다</h3>
            <p>첫 번째 후기를 작성해보세요!</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`page-number ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;
