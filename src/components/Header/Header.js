import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import Notifications from "../Notifications/Notifications";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    console.log("로고 이미지 로딩 실패");
    setLogoError(true);
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  // 사용자 역할 텍스트 반환
  const getUserRoleText = () => {
    if (!user) return "";

    switch (user.type) {
      case "parent":
        return "부모님";
      case "tutor":
        return "쌤";
      case "admin":
        return "관리자";
      default:
        return "";
    }
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="logo-section">
          <img
            src="/img/Image_fx.png"
            alt="어린이 아바타"
            className="logo-img"
            onError={handleLogoError}
          />
          <span className="font-black-han-sans logo-text">아이랑 쌤이랑</span>
        </Link>

        <div className="header-right">
          {!user ? (
            <div className="header-buttons">
              <button className="signup-header-button" onClick={goToSignUp}>
                회원가입
              </button>
              <button className="signup-header-button" onClick={goToLogin}>
                로그인
              </button>
            </div>
          ) : (
            <div className="user-info-section">
              <div className="user-role-display">
                <span className="user-role">{getUserRoleText()}</span>
                {user.type === "admin" && (
                  <Link to="/admin-dashboard" className="admin-dashboard-link">
                    대시보드
                  </Link>
                )}
              </div>
              <Notifications />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
