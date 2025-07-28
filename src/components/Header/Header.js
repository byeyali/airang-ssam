import React from 'react';
import { useNavigate } from "react-router-dom";
import './Header.css';

function Header() {

const navigate = useNavigate(); 

    const goToSignUp = () => {
    navigate("/signup");  
    }; 

    const goToLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

    return (
        <header className="app-header">
            <div className="header-inner">
                <div className="logo-section">
                <img src="/img/Image_fx.png" alt="어린이 아바타" className="logo-img" />
                <span className="app-name">아이랑 쌤이랑</span>
                </div>

                <div className="header-buttons">
                    <button className="signup-header-button" onClick={goToSignUp} >회원가입</button>
                    <button className="signup-header-button" onClick={goToLogin}>로그인</button>
                </div>
      
            </div>
        </header>
    );
}

export default Header;