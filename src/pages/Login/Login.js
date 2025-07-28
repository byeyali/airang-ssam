import React from "react";
import "./Login.css";

function Login() {
  return (
    <div class="signup-form-container">
      <h1 class="signup-title">로그인</h1>

      <form id="loginForm" action="/api/login" method="POST">
        <div class="signup-form-group signup-form-group-inline">
          <label class="signup-label-button">이메일</label>
          <input
            type="email"
            class="signup-input-field"
            placeholder="이메일을 입력하세요"
            required
            name="email"
          />
        </div>
        <div class="signup-form-group signup-form-group-inline">
          <label class="signup-label-button">패스워드</label>
          <input
            type="password"
            class="signup-input-field"
            placeholder="패스워드를 입력하세요"
            required
            name="패스워드"
          />
        </div>

        <button type="submit" class="signup-action-button signup-submit-button">
          저장
        </button>
      </form>
    </div>
  );
}

export default Login;
