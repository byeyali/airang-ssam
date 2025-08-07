import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Navigation.css";

function Navigation() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const handleImageError = (imageName) => {
    console.log(`이미지 로딩 실패: ${imageName}`);
    setImageLoadErrors((prev) => ({
      ...prev,
      [imageName]: true,
    }));
  };

  const handleReviewClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("로그인이 필요합니다. 로그인 후 후기를 확인해주세요.");
      navigate("/login");
      return;
    }
  };

  return (
    <nav className="main-navigation">
      {/* 공통 메뉴 항목들 */}
      <Link to="/Helpme" className="nav-item">
        <img
          src="/img/icon_help.png"
          alt="도와줘요 쌤"
          className="nav-icon"
          onError={() => handleImageError("icon_help")}
        />
        <span className="nav-text">도와줘요 쌤</span>
      </Link>

      {/* 쌤이 되어 볼래요? - 부모가 아닐 때만 표시 */}
      {(!user || user.type !== "parent") && (
        <Link to="/teacher-profile" className="nav-item">
          <img
            src="/img/icon_teacher.png"
            alt="쌤이 되어 볼래요?"
            className="nav-icon"
            onError={() => handleImageError("icon_teacher")}
          />
          <span className="nav-text">쌤이 되어 볼래요?</span>
        </Link>
      )}

      {/* 부모 회원 전용 메뉴 */}
      {user && user.type === "parent" && (
        <>
          <Link to="/teacher-applications" className="nav-item">
            <img
              src="/img/icon_find.png"
              alt="우리 아이 쌤 찾기"
              className="nav-icon"
            />
            <span className="nav-text">우리 아이 쌤 찾기</span>
          </Link>
          <Link to="/matchings" className="nav-item">
            <img
              src="/img/matching-teacher.png"
              alt="매칭 관리"
              className="nav-icon"
            />
            <span className="nav-text">매칭 관리</span>
          </Link>
        </>
      )}

      {/* 쌤 회원 전용 메뉴 */}
      {user &&
        user.type === "tutor" &&
        !location.pathname.includes("/teacher-detail/") && (
          <>
            <Link to="/applications" className="nav-item">
              <img
                src="/img/findteacher.png"
                alt="공고 찾기"
                className="nav-icon"
              />
              <span className="nav-text">공고 찾기</span>
            </Link>
            <Link to="/matchings" className="nav-item">
              <img
                src="/img/matching-teacher.png"
                alt="매칭 관리"
                className="nav-icon"
              />
              <span className="nav-text">매칭 관리</span>
            </Link>
          </>
        )}

      {/* 관리자 전용 메뉴 - 모든 메뉴 표시 */}
      {user && user.type === "admin" && (
        <>
          <Link to="/teacher-applications" className="nav-item">
            <img
              src="/img/icon_find.png"
              alt="우리 아이 쌤 찾기"
              className="nav-icon"
            />
            <span className="nav-text">우리 아이 쌤 찾기</span>
          </Link>
          <Link to="/applications" className="nav-item">
            <img
              src="/img/findteacher.png"
              alt="공고 찾기"
              className="nav-icon"
            />
            <span className="nav-text">공고 찾기</span>
          </Link>
          <Link to="/matchings" className="nav-item">
            <img
              src="/img/matching-teacher.png"
              alt="매칭 관리"
              className="nav-icon"
            />
            <span className="nav-text">매칭 관리</span>
          </Link>
        </>
      )}

      {/* 후기 보기 (맨 오른쪽) */}
      <Link to="/reviews" className="nav-item" onClick={handleReviewClick}>
        <img
          src="/img/icon_review.png"
          alt="후기 보기"
          className="nav-icon"
          onError={() => handleImageError("icon_review")}
        />
        <span className="nav-text">후기 보기</span>
      </Link>
    </nav>
  );
}

export default Navigation;
