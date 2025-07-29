import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 실제 로그인 로직 (현재는 시뮬레이션)
    const userData = {
      name: "김가정",
      email: formData.email,
      userType: "parents",
    };

    login(userData);
    navigate("/");
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-title">로그인</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-form-group signup-form-group-inline">
          <label className="signup-label-button">이메일</label>
          <input
            type="email"
            className="signup-input-field"
            placeholder="이메일을 입력하세요"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="signup-form-group signup-form-group-inline">
          <label className="signup-label-button">패스워드</label>
          <input
            type="password"
            className="signup-input-field"
            placeholder="패스워드를 입력하세요"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="signup-action-button signup-submit-button"
        >
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
