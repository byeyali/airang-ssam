import React, { useState } from "react";
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

  // 동영상 로딩 상태 관리
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    console.log("동영상 로딩 완료");
  };

  const handleVideoError = (e) => {
    setVideoError(true);
    console.log("동영상 로딩 실패:", e);
    console.log("동영상 요소:", e.target);
    console.log("동영상 에러 코드:", e.target.error);
  };

  // 이미지 로딩 상태 관리
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const handleImageError = (imageName) => {
    console.log(`홈 이미지 로딩 실패: ${imageName}`);
    setImageLoadErrors((prev) => ({
      ...prev,
      [imageName]: true,
    }));
  };

  // 쌤 이미지 매핑 함수
  const getTeacherImage = (teacherId) => {
    const imageMap = {
      teacher_001: "/img/teacher-kimyouhghee-womam.png", // 김영희
      teacher_002: "/img/teacher-man-ball.jpg", // 박민수
      teacher_003: "/img/teacher-kimjiyoung.jpg", // 김지영
      teacher_004: "/img/teacher-math-english.jpg", // 최지영
      teacher_005: "/img/teacher-woman-31-glasses.png", // 한미영
      teacher_006: "/img/teacher-man-readingbook.png", // 정성훈
      teacher_007: "/img/kimtashyeon-man.png", // 김태현
      teacher_008: "/img/teacher-30-man.png", // 박성훈
      teacher_009: "/img/teacher-20-woman.png", // 이미영
      teacher_010: "/img/teacher-40-woman.png", // 박지영 (45세)
      teacher_011: "/img/teacher-60-woman.png", // 최영희 (55세)
    };
    return imageMap[teacherId] || "/img/teacher-30-woman.png";
  };

  // 홍보용 간략 정보 (지역 매칭 없이 모든 사용자가 볼 수 있음)
  const sampleApplications = getAllApplications().slice(0, 8); // 최근 8개 공고
  const sampleTeachers = getHomeTeachers().slice(0, 6); // 홈용 쌤 6명

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const handleViewMoreApplications = () => {
    navigate("/applications");
  };

  const handleViewMoreTeachers = () => {
    // 단계별 체크: 로그인 > 도와줘요 쌤 작성 > 쌤 찾기
    if (!user) {
      // 1단계: 로그인 안됨 - 로그인 페이지로
      alert("로그인을 하시면 쌤을 찾을 수 있습니다.");
      navigate("/login");
      return;
    }

    if (user.type === "parent") {
      // 부모 회원인 경우
      const myApplications = getAllApplications().filter(
        (app) => app.parentId === user.id
      );

      if (myApplications.length === 0) {
        // 2단계: 공고 작성 안됨 - 도와줘요 쌤 페이지로
        alert("먼저 '도와줘요 쌤' 페이지에서 공고를 작성해주세요.");
        navigate("/Helpme");
        return;
      }

      // 3단계: 모든 조건 만족 - 쌤 찾기 페이지로
      navigate("/teacher-applications", { state: { fromHome: true } });
    } else if (user.type === "teacher") {
      // 쌤 회원인 경우 - 간략한 쌤 프로필은 볼 수 있지만 상세보기/매칭은 제한
      alert(
        "쌤 회원은 간략한 쌤 프로필만 확인할 수 있습니다. 상세보기와 매칭 요청은 부모 회원만 이용 가능합니다."
      );
      navigate("/teacher-applications", {
        state: { fromHome: true, teacherView: true },
      });
    } else if (user.type === "admin") {
      // 관리자인 경우 - 바로 쌤 찾기 페이지로
      navigate("/teacher-applications", { state: { fromHome: true } });
    }
  };

  const handleParentService = () => {
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
    navigate("/parent-service");
  };

  const handleTeacherService = () => {
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
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

    // 해당 공고 정보 가져오기
    const application = getAllApplications().find(
      (app) => app.id === applicationId
    );

    if (!application) {
      alert("공고를 찾을 수 없습니다.");
      return;
    }

    // 관리자는 모든 공고를 볼 수 있음
    if (user.type === "admin") {
      navigate(`/application-detail/${applicationId}`);
      return;
    }

    // 쌤 회원인 경우 해당 지역의 공고만 볼 수 있음
    if (user.type === "teacher") {
      const teacherRegions = user.regions || [];
      const applicationRegion = application.region.title;

      if (teacherRegions.includes(applicationRegion)) {
        navigate(`/application-detail/${applicationId}`);
      } else {
        alert("해당 지역의 공고만 상세보기할 수 있습니다.");
      }
      return;
    }

    // 부모 회원은 공고 상세보기 제한
    alert("부모 회원은 공고 상세보기를 이용할 수 없습니다.");
  };

  const handleViewMoreApplicationsForTeachers = () => {
    if (!user) {
      alert("로그인을 하시면 공고를 확인할 수 있습니다.");
      navigate("/login");
      return;
    }

    // 모든 로그인한 회원이 공고 목록을 볼 수 있음
    navigate("/applications");
  };

  return (
    <div className="home-page">
      {/* 이미지 로딩 에러 디버깅 정보 */}
      {Object.keys(imageLoadErrors).length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 9999,
            fontSize: "12px",
          }}
        >
          <strong>이미지 로딩 실패:</strong>
          <br />
          {Object.keys(imageLoadErrors).join(", ")}
        </div>
      )}
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>아이랑 쌤이랑</h1>
            <p>우리 아이에게 맞는 쌤을 찾아보세요</p>
          </div>
          <div className="hero-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="hero-video-element"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              onCanPlay={handleVideoLoad}
              controls={false}
            >
              <source src="/img/video-main.mp4" type="video/mp4" />
              {/* 폴백 이미지 */}
              <img src="/img/home-main01.png" alt="메인 이미지" />
            </video>
            {!videoLoaded && !videoError && (
              <div className="video-loading">동영상 로딩 중...</div>
            )}
          </div>
        </div>

        {/* 돌봄 분야 섹션 */}
        <div className="care-fields-section">
          <h2>다양한 돌봄 분야</h2>
          <div className="care-fields-grid">
            <div className="care-field-item">
              <img
                src="/img/afterschool.png"
                alt="방과후 마중"
                onError={() => handleImageError("afterschool")}
              />
              <span>방과후 마중</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/food.png"
                alt="음식 챙김"
                onError={() => handleImageError("food")}
              />
              <span>음식 챙김</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/clean.png"
                alt="정리 정돈"
                onError={() => handleImageError("clean")}
              />
              <span>정리 정돈</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/specialcare.png"
                alt="특수 돌봄"
                onError={() => handleImageError("specialcare")}
              />
              <span>특수 돌봄</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/sports.png"
                alt="스포츠"
                onError={() => handleImageError("sports")}
              />
              <span>스포츠</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/music.png"
                alt="음악"
                onError={() => handleImageError("music")}
              />
              <span>음악</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/art.png"
                alt="미술"
                onError={() => handleImageError("art")}
              />
              <span>미술</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/boardgame.png"
                alt="보드게임"
                onError={() => handleImageError("boardgame")}
              />
              <span>보드게임</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/math.png"
                alt="산수"
                onError={() => handleImageError("math")}
              />
              <span>산수</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/textbook.png"
                alt="교과 보충"
                onError={() => handleImageError("textbook")}
              />
              <span>교과 보충</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/reading.png"
                alt="독서 대화"
                onError={() => handleImageError("reading")}
              />
              <span>독서 대화</span>
            </div>
            <div className="care-field-item">
              <img
                src="/img/secondlanguage.png"
                alt="제2외국어"
                onError={() => handleImageError("secondlanguage")}
              />
              <span>제2외국어</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Links Section */}
      <section className="service-links-section">
        <div className="service-links-title-section">
          <h2>서비스 안내</h2>
        </div>
        <div className="service-links-container">
          <div className="service-link-card" onClick={handleParentService}>
            <div className="service-link-icon">
              <img
                src="/img/boyandgirl.jpg"
                alt="부모님 서비스"
                onError={() => handleImageError("boyandgirl")}
              />
            </div>
            <h3>부모님 서비스</h3>
            <p>우리 아이에게 맞는 쌤을 찾아보세요</p>
            <div className="service-link-arrow">→</div>
          </div>
          <div className="service-link-card" onClick={handleTeacherService}>
            <div className="service-link-icon">
              <img
                src="/img/greywoman.png"
                alt="쌤 서비스"
                onError={() => handleImageError("greywoman")}
              />
            </div>
            <h3>쌤 서비스</h3>
            <p>아이들과 함께하는 시간을 만들어보세요</p>
            <div className="service-link-arrow">→</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
