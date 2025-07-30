import React, { useState } from "react";
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

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>부모님들의 후기</h1>
        <p>다른 부모님들의 생생한 후기를 확인해보세요</p>
      </div>

      <div className="reviews-actions">
        <button
          className="action-button write-review-btn"
          onClick={() => setShowAddForm(!showAddForm)}
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
        {reviews.length > 0 ? (
          reviews.map((review) => (
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
    </div>
  );
}

export default Reviews;
