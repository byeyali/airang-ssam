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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(formData.email, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  const handleSignUpClick = () => {
    console.log("회원가입 버튼 클릭됨");
    navigate("/signup");
  };

  return (
    <div className="login-form-container">
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
