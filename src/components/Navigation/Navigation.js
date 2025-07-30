import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Navigation.css";

function Navigation() {
  const { user } = useUser();

  return (
    <nav className="main-navigation">
      {/* 핵심 메뉴 항목들 */}
      <Link to="/Helpme" className="nav-item">
        <img src="/img/icon_help.png" alt="도와줘요 쌤" className="nav-icon" />
        <span className="nav-text">도와줘요 쌤</span>
      </Link>
      <Link to="/teacher-profile" className="nav-item">
        <img
          src="/img/icon_teacher.png"
          alt="쌤이 되어 볼래요?"
          className="nav-icon"
        />
        <span className="nav-text">쌤이 되어 볼래요?</span>
      </Link>
      <Link to="/teacher-applications" className="nav-item">
        <img
          src="/img/icon_find.png"
          alt="우리 아이 쌤 찾기"
          className="nav-icon"
        />
        <span className="nav-text">우리 아이 쌤 찾기</span>
      </Link>

      {/* 쌤 전용 추가 메뉴 */}
      {(!user || user.type === "teacher") && (
        <Link to="/teacher-applications" className="nav-item">
          <img
            src="/img/icon_search.png"
            alt="공고 찾기"
            className="nav-icon"
          />
          <span className="nav-text">공고 찾기</span>
        </Link>
      )}

      {/* 후기 보기 (맨 오른쪽) */}
      <Link to="/reviews" className="nav-item">
        <img src="/img/icon_review.png" alt="후기 보기" className="nav-icon" />
        <span className="nav-text">후기 보기</span>
      </Link>
    </nav>
  );
}

export default Navigation;
