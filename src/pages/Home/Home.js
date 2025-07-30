import React from "react";
import { useNavigate } from "react-router-dom";
import { useReview } from "../../contexts/ReviewContext";
import { useApplication } from "../../contexts/ApplicationContext";
import { useUser } from "../../contexts/UserContext";
import { useTeacher } from "../../contexts/TeacherContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { reviews } = useReview();
  const { getAllApplications } = useApplication();
  const { user } = useUser();
  const { getHomeTeachers } = useTeacher();

  const applications = getAllApplications();
  const teachers = getHomeTeachers();

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const handleViewMoreApplications = () => {
    navigate("/applications");
  };

  const handleViewMoreTeachers = () => {
    navigate("/teacher-applications", { state: { fromHome: true } });
  };

  const handleParentService = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    navigate("/parent-service");
  };

  const handleTeacherService = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    navigate("/teacher-service");
  };

  const handleHelpme = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    navigate("/Helpme");
  };

  const handleTeacherProfile = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    navigate("/teacher-profile");
  };

  const handleApplicationDetail = (applicationId) => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    navigate(`/application-detail/${applicationId}`);
  };

  const handleViewMoreApplicationsForTeachers = () => {
    if (!user) {
      alert("회원가입을 하시면 해당 지역의 공고를 확인할 수 있습니다.");
      navigate("/signup");
      return;
    }

    if (user.type === "teacher") {
      navigate("/teacher-applications");
    } else {
      alert("쌤 회원만 이용할 수 있는 서비스입니다.");
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>아이랑 쌤이랑</h1>
            <p>우리 아이에게 맞는 쌤을 찾아보세요</p>
          </div>
          <div className="hero-image">
            <img src="/img/home-main01.png" alt="메인 이미지" />
          </div>
        </div>
      </section>

      {/* Service Links Section */}
      <section className="service-links-section">
        <div className="service-links-container">
          <div
            className={`service-link-card ${!user ? "disabled" : ""}`}
            onClick={handleParentService}
          >
            <div className="service-link-icon">👨‍👩‍👧‍👦</div>
            <h3>부모님 서비스</h3>
            <p>우리 아이에게 맞는 쌤을 찾아보세요</p>
            <div className="service-link-arrow">→</div>
          </div>
          <div
            className={`service-link-card ${!user ? "disabled" : ""}`}
            onClick={handleTeacherService}
          >
            <div className="service-link-icon">👩‍🏫</div>
            <h3>쌤 서비스</h3>
            <p>아이들과 함께하는 시간을 만들어보세요</p>
            <div className="service-link-arrow">→</div>
          </div>
          <div
            className={`service-link-card ${!user ? "disabled" : ""}`}
            onClick={handleHelpme}
          >
            <div className="service-link-icon">📝</div>
            <h3>공고 작성</h3>
            <p>우리 아이 쌤을 찾기 위한 공고를 작성해보세요</p>
            <div className="service-link-arrow">→</div>
          </div>
          <div
            className={`service-link-card ${!user ? "disabled" : ""}`}
            onClick={handleTeacherProfile}
          >
            <div className="service-link-icon">👨‍🏫</div>
            <h3>쌤 등록</h3>
            <p>아이들과 함께할 쌤이 되어보세요</p>
            <div className="service-link-arrow">→</div>
          </div>
        </div>
      </section>

      {/* NEW 도와줘요 쌤! Section */}
      <section className="applications-section">
        <div className="applications-title-section">
          <h2>
            <span className="new-text">NEW</span> 도와줘요 쌤!
          </h2>
        </div>
        <div className="applications-grid">
          {applications.slice(0, 3).map((application, index) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <div className="child-avatar">
                  <img
                    src={index % 2 === 0 ? "/img/boy.png" : "/img/girl.png"}
                    alt="아이 아바타"
                  />
                </div>
              </div>
              <div className="application-content">
                <div className="application-target">
                  {application.target} ({application.region.title})
                </div>
                <div className="application-title">{application.title}</div>
                <div className="application-details">
                  <div className="application-date">
                    {application.startDate} 시작
                  </div>
                  <div className="application-schedule">{application.type}</div>
                  <div className="application-payment">
                    {application.payment}
                  </div>
                </div>
                <button
                  className={`view-details-button ${!user ? "disabled" : ""}`}
                  onClick={() => handleApplicationDetail(application.id)}
                  disabled={!user}
                >
                  공고 자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="applications-cta">
          <button
            className="view-more-applications-button"
            onClick={handleViewMoreApplicationsForTeachers}
          >
            공고 더보기
          </button>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-title-section">
          <h2>부모님들의 후기</h2>
        </div>
        <div className="reviews-grid">
          {reviews.slice(0, 6).map((review) => (
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
          ))}
        </div>
        <div className="reviews-cta">
          <button
            className="view-more-button"
            onClick={() => navigate("/reviews")}
          >
            후기 더보기
          </button>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="teachers-section">
        <div className="teachers-title-section">
          <h2>NEW 우리 아이 쌤 찾기</h2>
        </div>
        <div className="teachers-grid">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-header">
                <div className="teacher-profile">
                  <img src={teacher.profileImage} alt="쌤 프로필" />
                </div>
                <div className="teacher-info">
                  <div className="teacher-name">{teacher.maskedName}</div>
                  <div className="teacher-rating-info">
                    <span className="star-icon">⭐</span>
                    <span className="rating-score">{teacher.rating}</span>
                    <span className="teacher-age">{teacher.age}세</span>
                  </div>
                </div>
              </div>
              <div className="teacher-content">
                <div className="teacher-name">{teacher.maskedName}</div>
                <div className="teacher-rating-info">
                  <span className="star-icon">⭐</span>
                  <span className="rating-score">{teacher.rating}</span>
                  <span className="teacher-age">{teacher.age}세</span>
                </div>
                <div className="teacher-wage">
                  희망 시급 {teacher.hourlyWage}
                </div>
                <div className="teacher-location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">
                    {teacher.regions.join(", ")}
                  </span>
                </div>
                <div className="teacher-certification">
                  {teacher.certification}
                </div>
                <div className="teacher-skills">
                  {teacher.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="teacher-preferences">
                  <span className="preferences-label">선호사항:</span>
                  <span className="preferences-text">
                    {teacher.preferences.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="teachers-cta">
          <button
            className="view-more-teachers-button"
            onClick={handleViewMoreTeachers}
          >
            아이 쌤 더보기
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
