import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import Notifications from "../Notifications/Notifications";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user } = useUser();

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="logo-section">
          <img
            src="/img/Image_fx.png"
            alt="어린이 아바타"
            className="logo-img"
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
            <Notifications />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
