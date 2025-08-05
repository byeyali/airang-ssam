import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { searchRegionLocal } from "../../config/api";
import "./SignUp.css";

const SignUp = () => {
  const [userType, setUserType] = useState("parents");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [addressResults, setAddressResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("관악구");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    birthDate: "",
    residentNumber: "",
  });

  const navigate = useNavigate();
  const { signup } = useUser();

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatResidentNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, "");

    // 7자리 이하일 때는 그대로 반환
    if (numbers.length <= 6) {
      return numbers;
    }

    // 7자리 이상일 때 하이픈 추가
    if (numbers.length <= 13) {
      return numbers.slice(0, 6) + "-" + numbers.slice(6);
    }

    // 13자리 초과 시 잘라내기
    return numbers.slice(0, 6) + "-" + numbers.slice(6, 13);
  };

  const handleResidentNumberChange = (e) => {
    const formattedValue = formatResidentNumber(e.target.value);
    setFormData({
      ...formData,
      residentNumber: formattedValue,
    });
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toLocaleDateString("ko-KR");
    setFormData((prev) => ({
      ...prev,
      birthDate: formattedDate,
    }));
    setShowCalendar(false);
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newYear);
      return newDate;
    });
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newMonth);
      return newDate;
    });
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 100; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const handleAddressSearch = async () => {
    console.log("주소 검색 버튼 클릭됨");
    console.log("검색어:", searchQuery);

    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      console.log("API 호출 시작...");
      const results = await searchRegionLocal(searchQuery);
      console.log("API 응답:", results);

      if (results && results.length > 0) {
        setAddressResults(results);
        setShowAddressSearch(true);
        console.log("검색 결과 설정 완료");
      } else {
        alert("검색 결과가 없습니다.");
        setAddressResults([]);
        setShowAddressSearch(false);
      }
    } catch (error) {
      console.error("주소 검색 오류:", error);
      alert("주소 검색에 실패했습니다.");
    }
  };

  const handleAddressSelect = (address) => {
    setFormData((prev) => ({
      ...prev,
      address: address,
    }));
    setShowAddressSearch(false);
    setSearchQuery("");
    setAddressResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 실제 회원가입 로직 (현재는 시뮬레이션)
    const userData = {
      name: formData.name || "김가정",
      email: formData.email,
      userType: userType,
      phone: formData.phone,
    };

    signup(userData);
    navigate("/");
  };

  const generateCalendarDays = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(new Date(d));
    }

    return days;
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-title">회원가입</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">이메일</div>
          <input
            type="email"
            className="signup-input-field"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">패스워드</div>
          <input
            type="password"
            className="signup-input-field"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">휴대폰 번호</div>
          <input
            type="tel"
            className="signup-input-field"
            placeholder="010-0000-0000"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <button
            type="button"
            className="signup-action-button signup-confirm-button"
          >
            인증
          </button>
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">주민등록번호</div>
          <input
            type="text"
            className="signup-input-field"
            placeholder="900000-2000000"
            name="residentNumber"
            value={formData.residentNumber}
            onChange={handleResidentNumberChange}
            maxLength="14"
          />
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">생년월일</div>
          <div className="birthdate-input-container">
            <input
              type="text"
              className="signup-input-field"
              placeholder="0000년 00월 00일"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              maxLength="13"
            />
            <button
              type="button"
              className="calendar-button"
              onClick={handleCalendarClick}
            >
              📅
            </button>
            {showCalendar && (
              <div className="calendar-dropdown">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={handlePrevMonth}
                  >
                    ‹
                  </button>
                  <div className="calendar-date-selector">
                    <select
                      className="calendar-year-select"
                      value={currentDate.getFullYear()}
                      onChange={handleYearChange}
                    >
                      {generateYearOptions().map((year) => (
                        <option key={year} value={year}>
                          {year}년
                        </option>
                      ))}
                    </select>
                    <select
                      className="calendar-month-select"
                      value={currentDate.getMonth() + 1}
                      onChange={handleMonthChange}
                    >
                      {generateMonthOptions().map((month) => (
                        <option key={month} value={month}>
                          {month}월
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={handleNextMonth}
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-weekdays">
                  <div>일</div>
                  <div>월</div>
                  <div>화</div>
                  <div>수</div>
                  <div>목</div>
                  <div>금</div>
                  <div>토</div>
                </div>
                <div className="calendar-days">
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`calendar-day ${
                        day.getMonth() !== currentDate.getMonth()
                          ? "other-month"
                          : ""
                      }`}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">주 소</div>
          <div className="address-input-container">
            <input
              type="text"
              className="signup-input-field address-field"
              placeholder="주소를 검색하여 선택하세요"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly
            />

            <button
              type="button"
              className="signup-action-button signup-search-button"
              onClick={handleAddressSearch}
            >
              검색
            </button>
            {showAddressSearch && addressResults.length > 0 && (
              <div className="address-search-results">
                {addressResults.map((result, index) => (
                  <div
                    key={index}
                    className="address-result-item"
                    onClick={() => handleAddressSelect(result.title)}
                  >
                    {result.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">상세주소</div>
          <input
            type="text"
            className="signup-input-field"
            placeholder="상세주소 (예: 302호 3층)"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="signup-action-button signup-submit-button"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
