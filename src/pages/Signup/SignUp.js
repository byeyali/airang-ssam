import React, { useState } from "react";
import "./SignUp.css";

const SignUp = () => {
  const [userType, setUserType] = useState("parents"); //회원유형 설정

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-title">회원가입</h1>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">이메일</div>
        <input type="email" className="signup-input-field" />
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">패스워드</div>
        <input type="password" className="signup-input-field" />
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">회원유형</div>
        <div className="signup-radio-button-group">
          <div
            className={`signup-radio-button ${
              userType === "parents" ? "selected" : ""
            }`}
            onClick={() => handleUserTypeChange("parents")}
          >
            부모
          </div>
          <div
            className={`signup-radio-button ${
              userType === "teacher" ? "selected" : ""
            }`}
            onClick={() => handleUserTypeChange("teacher")}
          >
            쌤
          </div>
        </div>
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">성 명</div>
        <input
          type="text"
          className="signup-input-field"
          placeholder="홍길동"
        />
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">휴대폰 번호</div>
        <input
          type="tel"
          className="signup-input-field"
          placeholder="010-0000-0000"
        />
        <button className="signup-action-button signup-confirm-button">
          인증
        </button>
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">주민등록번호</div>
        <input type="text" className="signup-input-field" />
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">생년월일</div>
        <input type="date" className="signup-input-field" />
      </div>

      <div className="signup-form-group signup-form-group-inline">
        <div className="signup-label-button">주 소</div>
        <input
          type="text"
          className="signup-input-field signup-input-field-half"
          placeholder="서울 특별시 영등포구 000동 00 APT"
        />{" "}
        {/* 변경된 클래스 이름 */}
        <button className="signup-action-button signup-search-button">
          검색
        </button>
      </div>

      <div className="signup-form-group">
        <input type="text" className="signup-input-field full-width" 
            placeholder="상세주소 (예: 302호 3층)"
        />
      </div>

      <button className="signup-action-button signup-submit-button">
        저장
      </button>
    </div>
  );
};

export default SignUp;
