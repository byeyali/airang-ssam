import React from "react";
import { useNavigate } from "react-router-dom";
import { useReview } from "../../contexts/ReviewContext";
import "./Home.css";

function Home() {
  const { getHomeReviews } = useReview();
  const reviews = getHomeReviews();
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ⭐
      </span>
    ));
  };

  const handleViewMore = () => {
    navigate("/reviews");
  };

  return (
    <div className="home-page">
      {/* 메인 콘텐츠 섹션 */}
      <div className="main-content">
        {/* 이미지와 텍스트 나란히 배치 */}
        <div className="hero-section">
          <div className="hero-image">
            <img
              src="/img/home-main01.png"
              alt="선생님과 아이가 함께 학습하는 모습"
              className="main-image"
            />
          </div>
          <div className="hero-text">
            <h1>좋은 쌤</h1>
            <h2>잘 찾는 곳, 아이랑 쌤이랑</h2>
            <p className="hero-subtitle">아이가 행복해하는 쌤 찾기</p>
          </div>
        </div>

        {/* 후기 섹션 */}
        <div className="reviews-section">
          <div className="reviews-title-section">
            <h2 className="reviews-title">아이랑 쌤이랑 후기!</h2>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="mom-icon">
                    <img
                      src="/img/mom-avatar.png"
                      alt="엄마 모습"
                      className="mom-avatar"
                    />
                  </div>
                  <div className="review-info">
                    <div className="review-location">{review.location}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                <p className="review-text">{review.text}</p>
                <div className="review-author">- {review.momName}님</div>
              </div>
            ))}
          </div>

          <div className="reviews-cta">
            <button className="view-more-button" onClick={handleViewMore}>
              후기 더보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
