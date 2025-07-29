import React, { useState } from "react";
import { useReview } from "../../contexts/ReviewContext";
import { useUser } from "../../contexts/UserContext";
import "./Reviews.css";

function Reviews() {
  const { getAllReviews, addReview, updateReview, deleteReview } = useReview();
  const { user } = useUser();
  const [reviews, setReviews] = useState(getAllReviews());
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    rating: 5,
    text: "",
    momName: "",
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ⭐
      </span>
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingReview) {
      // 수정 모드
      updateReview(editingReview.id, formData);
      setEditingReview(null);
    } else {
      // 새 후기 작성
      const newReview = {
        location: formData.location,
        rating: formData.rating,
        text: formData.text,
        momName: formData.momName,
      };
      addReview(newReview, user);

      // 로컬 상태도 업데이트
      const reviewWithId = {
        id: Date.now(),
        ...newReview,
        userId: user?.id || "anonymous",
        date: new Date()
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\. /g, ".")
          .replace(".", ""),
      };
      setReviews([reviewWithId, ...reviews]);
    }

    setFormData({
      location: "",
      rating: 5,
      text: "",
      momName: "",
    });
    setShowForm(false);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      location: review.location,
      rating: review.rating,
      text: review.text,
      momName: review.momName,
    });
    setShowForm(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    setFormData({
      location: "",
      rating: 5,
      text: "",
      momName: "",
    });
  };

  // 사용자가 로그인했는지 확인
  const isLoggedIn = !!user;

  // 현재 사용자가 작성한 후기인지 확인하는 함수
  const isMyReview = (review) => {
    return user && review.userId === user.id;
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-header">
          <h1>아이랑 쌤이랑 후기 게시판</h1>
          {isLoggedIn ? (
            <button className="write-button" onClick={() => setShowForm(true)}>
              후기 작성하기
            </button>
          ) : (
            <div className="login-notice">후기를 작성하려면 로그인해주세요</div>
          )}
        </div>

        {/* 후기 작성/수정 폼 */}
        {showForm && (
          <div className="review-form-container">
            <h2>{editingReview ? "후기 수정하기" : "새 후기 작성하기"}</h2>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label>지역</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="예: 서울특별시 강남구"
                  required
                />
              </div>

              <div className="form-group">
                <label>평점</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${
                        star <= formData.rating ? "filled" : ""
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: star }))
                      }
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>후기 내용</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  placeholder="후기를 작성해주세요..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>엄마 이름</label>
                <input
                  type="text"
                  name="momName"
                  value={formData.momName}
                  onChange={handleInputChange}
                  placeholder="엄마 이름을 입력해주세요"
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {editingReview ? "수정하기" : "작성하기"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 후기 목록 */}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-info">
                  <div className="mom-avatar">
                    <img src="/img/mom-avatar.png" alt="엄마 모습" />
                  </div>
                  <div className="review-details">
                    <div className="review-location">{review.location}</div>
                    <div className="review-date">{review.date}</div>
                    <div className="review-author">{review.momName}님</div>
                  </div>
                </div>
                {/* 로그인한 사용자만 자신의 후기를 수정/삭제할 수 있음 */}
                {isLoggedIn && isMyReview(review) && (
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
                )}
              </div>

              <div className="review-rating">{renderStars(review.rating)}</div>

              <div className="review-text">{review.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
