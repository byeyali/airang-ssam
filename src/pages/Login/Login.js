//

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginData = { email: formData.email, password: formData.password };
      const result = await login(loginData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleMainPageClick = () => {
    navigate("/");
  };

  return (
    <div className="login-form-container">
      {/* 아이랑 쌤 이미지와 텍스트 */}
      <div className="login-header-section" onClick={handleMainPageClick}>
        <div className="login-header-content">
          <div className="login-header-images">
            <img
              src="/img/boy.png"
              alt="아이"
              className="login-header-image child-image"
            />
            <span className="login-header-text">랑</span>
            <img
              src="/img/teacher-20-woman.png"
              alt="쌤"
              className="login-header-image teacher-image"
            />
          </div>
          <div className="login-header-title">아이랑 쌤</div>
        </div>
      </div>

      <h1 className="login-title">로그인</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group login-form-group-inline">
          <div className="login-label-button">이메일</div>
          <input
            type="email"
            className="login-input-field"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div className="login-form-group login-form-group-inline">
          <div className="login-label-button">비밀번호</div>
          <input
            type="password"
            className="login-input-field"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="login-action-button login-submit-button"
        >
          로그인
        </button>
      </form>

      <div className="login-footer">
        <p>계정이 없으신가요?</p>
        <button
          type="button"
          onClick={handleSignUpClick}
          className="signup-link-button"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
