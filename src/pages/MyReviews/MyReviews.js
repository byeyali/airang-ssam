import React, { useState } from "react";
import { useReview } from "../../contexts/ReviewContext";
import { useUser } from "../../contexts/UserContext";
import "./MyReviews.css";

function MyReviews() {
  const { reviews, updateReview, deleteReview } = useReview();
  const { user } = useUser();
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    teacherName: "",
    rating: 5,
    content: "",
  });

  // 현재 사용자가 작성한 후기만 필터링
  const myReviews = reviews.filter((review) => review.userId === user?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReview) {
      updateReview(editingReview.id, formData);
      setEditingReview(null);
    }
    setFormData({ teacherName: "", rating: 5, content: "" });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      teacherName: review.teacherName,
      rating: review.rating,
      content: review.content,
    });
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      deleteReview(reviewId);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  if (!user) {
    return (
      <div className="my-reviews-page">
        <div className="login-required">
          <h2>로그인이 필요합니다</h2>
          <p>내 후기를 관리하려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews-page">
      <div className="my-reviews-header">
        <h1>내 후기 관리</h1>
        <p>
          {user.name}님의 후기 {myReviews.length}개
        </p>
      </div>

      {editingReview && (
        <div className="edit-review-form">
          <h2>후기 수정하기</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>쌤 이름:</label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) =>
                  setFormData({ ...formData, teacherName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>평점:</label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5점)</option>
                <option value={4}>⭐⭐⭐⭐ (4점)</option>
                <option value={3}>⭐⭐⭐ (3점)</option>
                <option value={2}>⭐⭐ (2점)</option>
                <option value={1}>⭐ (1점)</option>
              </select>
            </div>
            <div className="form-group">
              <label>후기 내용:</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={5}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                수정하기
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditingReview(null);
                  setFormData({ teacherName: "", rating: 5, content: "" });
                }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {myReviews.length === 0 ? (
        <div className="no-reviews">
          <h3>작성한 후기가 없습니다</h3>
          <p>아직 작성한 후기가 없습니다. 후기를 작성해보세요!</p>
        </div>
      ) : (
        <div className="my-reviews-grid">
          {myReviews.map((review) => (
            <div key={review.id} className="my-review-card">
              <div className="review-header">
                <div className="review-location">{review.region}</div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="review-content">{review.content}</div>
              <div className="review-footer">
                <div className="review-date">{review.date}</div>
              </div>
              <div className="review-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(review)}
                >
                  수정
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(review.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviews;
