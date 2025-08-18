import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { searchAddress } from "../../config/api";
import "./SignUp.css";

const SignUp = () => {
  const [userType, setUserType] = useState("parents");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [addressResults, setAddressResults] = useState([]);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const countPerPage = 10;

  const navigate = useNavigate();
  const { signup } = useUser();

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // 휴대폰 번호 포맷팅
  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 11자리 이하로 제한
    const limitedNumbers = numbers.slice(0, 11);

    // 포맷팅 적용
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(
        3,
        7
      )}-${limitedNumbers.slice(7)}`;
    }
  };

  // 주민등록번호 포맷팅
  const formatResidenceNo = (value) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 휴대폰 번호 필드인 경우 포맷팅 적용
    if (name === "cell_phone") {
      const formattedValue = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else if (name === "residence_no") {
      const formattedValue = formatResidenceNo(value);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else if (name === "birth_date") {
      const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 8);

      let formattedValue = onlyNumbers;
      if (onlyNumbers.length >= 5) {
        formattedValue =
          onlyNumbers.slice(0, 4) +
          "-" +
          onlyNumbers.slice(4, 6) +
          (onlyNumbers.length > 6 ? "-" + onlyNumbers.slice(6, 8) : "");
      } else if (onlyNumbers.length >= 4) {
        formattedValue =
          onlyNumbers.slice(0, 4) + "-" + onlyNumbers.slice(4, 6);
      }

      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // 생일 포맷팅 함수 추가
  const formatBirthDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const handleBirthDateSelect = (date) => {
    const formattedDate = formatBirthDate(date);
    setFormData((prev) => ({
      ...prev,
      birth_date: formattedDate,
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

  // 주소 검색
  const handleAddressSearch = async (page = 1) => {
    const keyword = formData.address || searchQuery;
    if (!keyword || keyword.trim() === "") return;

    try {
      const response = await searchAddress(keyword, page, countPerPage);

      if (response?.data?.addresses) {
        setAddressResults(response.data.addresses);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.currentPage || 1);
        setShowAddressSearch(true);
      } else {
        alert("주소는 없거나 자세히 입력해 주세요.");
        setAddressResults([]);
        setShowAddressSearch(false);
      }
    } catch (error) {
      alert("주소검색 중 오류가 발생했습니다.");
      console.error(error);
      setAddressResults([]);
      setShowAddressSearch(false);
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    // 백엔드에서 받은 필드명 사용
    const addressText = selectedAddress.address || "";

    setFormData((prev) => ({
      ...prev,
      address: addressText,
      city: selectedAddress.city || "", // 백엔드에서 받은 city
      area: selectedAddress.area || "", // 백엔드에서 받은 area
    }));
    setShowAddressSearch(false);
    setSearchQuery("");
    setAddressResults([]);
  };

  const handleMainPageClick = () => {
    navigate("/");
  };

  const [formData, setFormData] = useState({
    password: "",
    email: "",
    name: "",
    cell_phone: "",
    residence_no: "",
    birth_date: "",
    city: "",
    area: "",
    address: "",
    detailAddress: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}-\d{7}$/.test(formData.residence_no)) {
      alert("주민등록번호 형식이 올바르지 않습니다.");
      return;
    }

    console.log("회원가입 데이터:", { city, area, formData });

    const userData = {
      password: formData.password,
      member_type: userType,
      email: formData.email,
      name: formData.name,
      cell_phone: formData.cell_phone.replace(/-/g, ""),
      residence_no: formData.residence_no.replace(/-/g, ""),
      birth_date: formData.birth_date.replace(/\./g, "-"),
      city: formData.city, // formData의 city 사용
      area: formData.area, // formData의 area 사용
      address: `${formData.address} ${formData.detailAddress}`.trim(),
    };

    console.log("전송할 userData:", userData);

    try {
      await signup(userData);
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // 주민등록번호 검증 실패
        const errorMessage =
          error.response.data.message || "잘못된 주민등록번호 입니다.";
        alert(errorMessage);
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
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
      <div className="signup-header">
        <div className="signup-header-icon" onClick={handleMainPageClick}>
          <img
            src="/img/new-logo-airang.png"
            alt="아이랑 쌤"
            className="signup-header-logo"
          />
        </div>
        <h1 className="signup-title">회원가입</h1>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">이메일</div>
          <input
            type="email"
            maxLength="100"
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
            maxLength="20"
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
                userType === "tutor" ? "selected" : ""
              }`}
              onClick={() => handleUserTypeChange("tutor")}
            >
              쌤
            </div>
          </div>
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">성 명</div>
          <input
            type="text"
            maxLength="50"
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
            maxLength="13"
            className="signup-input-field"
            placeholder="010-0000-0000"
            name="cell_phone"
            value={formData.cell_phone}
            onChange={handleChange}
            required
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
            name="residence_no"
            className="signup-input-field"
            maxLength="14"
            value={formData.residence_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">생년월일</div>
          <div className="birthdate-input-container">
            <input
              type="text"
              className="signup-input-field"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              placeholder="예: 19900101"
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
                      onClick={() => handleBirthDateSelect(day)}
                    >
                      {day.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="signup-form-group signup-form-group-inline"
          style={{ position: "relative" }}
        >
          <div className="signup-label-button">주 소</div>
          <div className="address-input-container">
            <input
              type="text"
              className="signup-input-field address-field"
              placeholder="도로명 주소 입력후 엔터/검색"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddressSearch();
                }
              }}
            />

            <button
              type="button"
              className="signup-action-button signup-search-button"
              onClick={handleAddressSearch}
            >
              검색
            </button>
          </div>
          {/* 주소 검색 결과 */}
          {showAddressSearch && addressResults.length > 0 && (
            <div className="address-search-results">
              <div className="results-header">
                <span>검색 결과 ({addressResults.length}개)</span>
                <button
                  type="button"
                  className="close-results-button"
                  onClick={() => {
                    setShowAddressSearch(false);
                    setAddressResults([]);
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="results-list">
                {addressResults.slice(0, 10).map((result, index) => (
                  <div
                    key={index}
                    className="address-result-item"
                    onClick={() => handleAddressSelect(result)}
                  >
                    {result.address}
                  </div>
                ))}
              </div>
              <div className="pagination">
                {currentPage > 1 && (
                  <button
                    type="button"
                    onClick={() => handleAddressSearch(currentPage - 1)}
                    className="pagination-btn"
                  >
                    ◀ 이전
                  </button>
                )}

                <span className="pagination-info">
                  {currentPage} /{" "}
                  {Math.max(1, Math.ceil(totalCount / countPerPage))} 페이지
                  {totalCount > 0 && ` (총 ${totalCount}개)`}
                </span>

                {currentPage < Math.ceil(totalCount / countPerPage) && (
                  <button
                    type="button"
                    onClick={() => handleAddressSearch(currentPage + 1)}
                    className="pagination-btn"
                  >
                    다음 ▶
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="signup-form-group signup-form-group-inline">
          <div className="signup-label-button">상세주소</div>
          <input
            type="text"
            maxLength="100"
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
