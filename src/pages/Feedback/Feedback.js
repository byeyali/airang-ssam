import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReview } from "../../contexts/ReviewContext";
import { useUser } from "../../contexts/UserContext";
import "./Feedback.css";

function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState("");
  const [momName, setMomName] = useState("");
  const navigate = useNavigate();
  const { addReview } = useReview();
  const { user } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      location: location,
      rating: rating,
      text: feedback,
      momName: momName,
    };

    addReview(newReview, user);

    // 후기 게시판으로 이동
    navigate("/reviews");
  };

  const handleViewReviews = () => {
    navigate("/reviews");
  };

  // 로그인하지 않은 경우 로그인 페이지로 이동
  if (!user) {
    return (
      <div className="feedback-container">
        <div className="feedback-content">
          <h1>후기 남기기</h1>
          <div className="login-required">
            <p>후기를 작성하려면 로그인이 필요합니다.</p>
            <button className="login-button" onClick={() => navigate("/Login")}>
              로그인하기
            </button>
            <button className="view-reviews-button" onClick={handleViewReviews}>
              후기 게시판 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <h1>후기 남기기</h1>
        <p>서비스 이용 후기를 남겨주세요. 다른 부모님들에게 도움이 됩니다.</p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="location">지역</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울특별시 강남구"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">평점</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= rating ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feedback">후기 내용</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="서비스 이용 후기를 자유롭게 작성해주세요..."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="momName">엄마 이름</label>
            <input
              id="momName"
              type="text"
              value={momName}
              onChange={(e) => setMomName(e.target.value)}
              placeholder="엄마 이름을 입력해주세요"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              후기 등록하기
            </button>
            <button
              type="button"
              className="view-reviews-button"
              onClick={handleViewReviews}
            >
              후기 게시판 보기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
