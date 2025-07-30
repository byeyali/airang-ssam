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
    navigate("/SignUp");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>로그인</h1>
          <p>아이랑 쌤이랑에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="login-footer">
          <p>계정이 없으신가요?</p>
          <button onClick={handleSignUpClick} className="signup-link">
            회원가입
          </button>
        </div>

        <div className="demo-accounts">
          <h3>데모 계정</h3>
          <div className="demo-account">
            <strong>부모 계정:</strong>
            <p>이메일: a@abc.com</p>
            <p>비밀번호: password</p>
          </div>
          <div className="demo-account">
            <strong>쌤 계정:</strong>
            <p>이메일: b@abc.com</p>
            <p>비밀번호: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
