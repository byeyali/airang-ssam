//
// Helpme.js
// 모든 카테고리 항목에서 중복 선택이 가능한 최종 파일
//

import React, { useState, useEffect } from "react";
import "./Helpme.css";

const Helpme = () => {
  // 🧠 'selectedItems'라는 상태(state)를 만들고, 초깃값으로 빈 배열([])을 넣어줘.
  // 이 배열에 선택된 항목들의 이름이 저장될 거야.
  const [selectedItems, setSelectedItems] = useState([]);
  const [address, setAddress] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [startDate, setStartDate] = useState("2025-07-30");
  const [endDate, setEndDate] = useState("2026-07-30");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("19:00");
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(45);
  const [selectedGender, setSelectedGender] = useState("");
  const [teacherName, setTeacherName] = useState("");

  // 아동 분류 폼 상태
  const [selectedChild, setSelectedChild] = useState("boy");
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [minWage, setMinWage] = useState("11000");
  const [maxWage, setMaxWage] = useState("15000");
  const [requests, setRequests] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // 📘 항목을 클릭했을 때 호출될 함수야.
  const handleItemClick = (item) => {
    // 클릭된 항목이 이미 선택된 항목인지 확인해.
    if (selectedItems.includes(item)) {
      // 이미 있으면 배열에서 제거해서 선택을 해제해.
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      // 없으면 배열에 추가해서 선택해.
      setSelectedItems([...selectedItems, item]);
    }
  };

  // 📘 특정 항목이 현재 선택된 상태인지 확인하는 함수.
  const isItemSelected = (item) => {
    return selectedItems.includes(item);
  };

  // 요일 버튼 클릭 핸들러
  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // 성별 버튼 클릭 핸들러
  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
  };

  // 아동 선택 핸들러
  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  // 학년 선택 핸들러
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
  };

  // 최저 시급 입력 핸들러
  const handleMinWageChange = (value) => {
    const numValue = parseInt(value);
    if (numValue >= 11000) {
      setMinWage(value);
      // 최저 시급이 최고 시급보다 높으면 최고 시급을 최저 시급으로 설정
      if (numValue > parseInt(maxWage)) {
        setMaxWage(value);
      }
    }
  };

  // 최고 시급 입력 핸들러
  const handleMaxWageChange = (value) => {
    const numValue = parseInt(value);
    if (numValue >= 11000) {
      setMaxWage(value);
      // 최고 시급이 최저 시급보다 낮으면 최저 시급을 최고 시급으로 설정
      if (numValue < parseInt(minWage)) {
        setMinWage(value);
      }
    }
  };

  // 연령 범위 핸들러
  const handleAgeChange = (type, value) => {
    const numValue = parseInt(value);
    if (type === "min") {
      if (numValue >= 20 && numValue <= 80 && numValue <= maxAge) {
        setMinAge(numValue);
        updateSliderRange(numValue, maxAge);
      }
    } else {
      if (numValue >= 20 && numValue <= 80 && numValue >= minAge) {
        setMaxAge(numValue);
        updateSliderRange(minAge, numValue);
      }
    }
  };

  // 슬라이더 범위 업데이트 함수
  const updateSliderRange = (min, max) => {
    const minPercent = ((min - 20) / (80 - 20)) * 100;
    const maxPercent = ((max - 20) / (80 - 20)) * 100;

    const sliderContainer = document.querySelector(".age-slider-container");
    if (sliderContainer) {
      sliderContainer.style.setProperty("--min-percent", minPercent);
      sliderContainer.style.setProperty("--max-percent", maxPercent);
    }
  };

  // 컴포넌트 마운트 시 초기 범위 설정
  useEffect(() => {
    updateSliderRange(minAge, maxAge);
  }, [minAge, maxAge]);

  // 숫자에 쉼표 추가하는 함수
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 저장 핸들러
  const handleSave = () => {
    console.log("아동 분류 정보 저장:", {
      selectedChild,
      selectedGrade,
      minWage,
      maxWage,
      requests,
      additionalInfo,
    });
    alert("아동 분류 정보가 저장되었습니다!");
  };

  // 학년별 나이 계산
  const getAgeByGrade = (grade) => {
    const gradeAges = {
      1: "7세",
      2: "8세",
      3: "9세",
      4: "10세",
      5: "11세",
      6: "12세",
    };
    return gradeAges[grade] || "7세";
  };

  return (
    <div className="helpme-container">
      <div className="helpme-header">
        <h1>도와줘요 쌤</h1>
        <p>어느 분야를 돌봐드리면 될까요?</p>
      </div>

      <div className="category-wrapper">
        {/* 돌봄 카테고리 */}
        <div className="category">
          <div className="category-title">돌봄</div>
          <div className="item-list">
            <div
              className="item-card"
              onClick={() => handleItemClick("방과 후 마중")}
            >
              {/* ✨ 이미지 그라데이션 클래스('돌봄-1')와 이미지 경로를 같이 넣어줬어. */}
              <div
                className="item-image 돌봄-1"
                style={{ backgroundImage: `url('/img/afterschool.png')` }}
              ></div>
              <div className="item-text">방과 후 마중</div>
              {/* 선택 여부에 따라 체크 표시가 보이도록 동적으로 클래스를 적용해. */}
              <div
                className={`item-icon-circle ${
                  isItemSelected("방과 후 마중") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("음식 챙김")}
            >
              <div
                className="item-image 돌봄-2"
                style={{ backgroundImage: `url('/img/food.png')` }}
              ></div>
              <div className="item-text">음식 챙김</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("음식 챙김") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("정리 정돈")}
            >
              <div
                className="item-image 돌봄-3"
                style={{ backgroundImage: `url('/img/clean.png')` }}
              ></div>
              <div className="item-text">정리 정돈</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("정리 정돈") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("특수 돌봄")}
            >
              <div
                className="item-image 돌봄-4"
                style={{ backgroundImage: `url('/img/specialcare.png')` }}
              ></div>
              <div className="item-text">특수 돌봄</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("특수 돌봄") ? "selected" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* 놀이 카테고리 */}
        <div className="category">
          <div className="category-title">놀이</div>
          <div className="item-list">
            <div
              className="item-card"
              onClick={() => handleItemClick("스포츠")}
            >
              <div
                className="item-image 놀이-1"
                style={{ backgroundImage: `url('/img/sports.png')` }}
              ></div>
              <div className="item-text">스포츠</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("스포츠") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div className="item-card" onClick={() => handleItemClick("음악")}>
              <div
                className="item-image 놀이-2"
                style={{ backgroundImage: `url('/img/music.png')` }}
              ></div>
              <div className="item-text">음악</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("음악") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div className="item-card" onClick={() => handleItemClick("미술")}>
              <div
                className="item-image 놀이-3"
                style={{ backgroundImage: `url('/img/art.png')` }}
              ></div>
              <div className="item-text">미술</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("미술") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("보드게임")}
            >
              <div
                className="item-image 놀이-4"
                style={{ backgroundImage: `url('/img/boardgame.png')` }}
              ></div>
              <div className="item-text">보드게임</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("보드게임") ? "selected" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* 스터디 카테고리 */}
        <div className="category">
          <div className="category-title">스터디</div>
          <div className="item-list">
            <div className="item-card" onClick={() => handleItemClick("산수")}>
              <div
                className="item-image 스터디-1"
                style={{ backgroundImage: `url('/img/math.png')` }}
              ></div>
              <div className="item-text">산수</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("산수") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("교과 보충")}
            >
              <div
                className="item-image 스터디-2"
                style={{ backgroundImage: `url('/img/textbook.png')` }}
              ></div>
              <div className="item-text">교과 보충</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("교과 보충") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("독서 대화")}
            >
              <div
                className="item-image 스터디-3"
                style={{ backgroundImage: `url('/img/reading.png')` }}
              ></div>
              <div className="item-text">독서 대화</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("독서 대화") ? "selected" : ""
                }`}
              ></div>
            </div>
            <div
              className="item-card"
              onClick={() => handleItemClick("제2외국어")}
            >
              <div
                className="item-image 스터디-4"
                style={{ backgroundImage: `url('/img/secondlanguage.png')` }}
              ></div>
              <div className="item-text">제2외국어</div>
              <div
                className={`item-icon-circle ${
                  isItemSelected("제2외국어") ? "selected" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨✨✨ 여기부터 새로운 검색 필터 UI를 추가합니다. */}
      <div className="search-filter-section">
        <div className="search-row">
          <p className="search-title">어느 지역에 살고 계시나요?</p>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="살고 계신 지역"
              className="search-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="search-button">검색</button>
          </div>
          <div className="search-result">
            <p>{searchResult || "선택 지역"}</p>
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">원하시는 돌봄기간</p>
          <div className="date-picker-row">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">원하시는 돌봄요일</p>
          <div className="day-selector">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <button
                key={day}
                className={`day-button ${
                  selectedDays.includes(day) ? "active" : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">원하시는 돌봄시간</p>
          <div className="time-selector">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span>~</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group-inline">
          <p className="filter-title">연령 범위</p>
          <div className="age-range-container">
            <div className="age-display">
              <span>{minAge}세</span>
              <span>~</span>
              <span>{maxAge}세</span>
            </div>
            <div className="age-slider-container">
              <input
                type="range"
                min="20"
                max="80"
                value={minAge}
                onChange={(e) => handleAgeChange("min", e.target.value)}
                className="age-slider min-slider"
              />
              <input
                type="range"
                min="20"
                max="80"
                value={maxAge}
                onChange={(e) => handleAgeChange("max", e.target.value)}
                className="age-slider max-slider"
              />
            </div>
            <div className="age-range-label">
              20세 ~ 80세 범위에서 선택해주세요
            </div>
          </div>
        </div>

        <div className="filter-group-inline">
          <p className="filter-title">원하시는 쌤 성별</p>
          <div className="gender-selector">
            <button
              className={`gender-button ${
                selectedGender === "여성" ? "active" : ""
              }`}
              onClick={() => handleGenderClick("여성")}
            >
              여성
            </button>
            <button
              className={`gender-button ${
                selectedGender === "남성" ? "active" : ""
              }`}
              onClick={() => handleGenderClick("남성")}
            >
              남성
            </button>
          </div>
        </div>

        <div className="search-row-bottom">
          <p className="filter-title">지정 쌤 검색</p>
          <input
            type="text"
            placeholder="쌤 이름을 입력하세요"
            className="search-input-bottom"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
          />
          <button className="magnifying-glass-button">
            <img src="/img/magnifying_glass.png" alt="검색" />
          </button>
        </div>
      </div>
      {/* 새로 추가한 검색 필터 UI 끝! */}

      {/* 아동 분류 폼 섹션 */}
      <div className="child-classification-section">
        <h2 className="classification-title">아동 분류</h2>

        {/* 아동 선택 */}
        <div className="child-selection">
          <div className="child-avatars">
            <div
              className={`child-avatar ${
                selectedChild === "boy" ? "selected" : ""
              }`}
              onClick={() => handleChildSelect("boy")}
            >
              <div className="avatar-image boy-avatar">
                <img src="/img/boy.png" alt="남자아이" />
              </div>
              <div
                className={`selection-icon ${
                  selectedChild === "boy" ? "selected" : ""
                }`}
              >
                <span>✓</span>
              </div>
            </div>
            <div
              className={`child-avatar ${
                selectedChild === "girl" ? "selected" : ""
              }`}
              onClick={() => handleChildSelect("girl")}
            >
              <div className="avatar-image girl-avatar">
                <img src="/img/girl.png" alt="여자아이" />
              </div>
              <div
                className={`selection-icon ${
                  selectedChild === "girl" ? "selected" : ""
                }`}
              >
                <span>✓</span>
              </div>
            </div>
          </div>

          {/* 학년 선택 */}
          <div className="grade-selection">
            <p className="grade-label">학년을 선택해주세요</p>
            <div className="grade-buttons">
              {["1", "2", "3", "4", "5", "6"].map((grade) => (
                <button
                  key={grade}
                  className={`grade-button ${
                    selectedGrade === grade ? "active" : ""
                  }`}
                  onClick={() => handleGradeSelect(grade)}
                >
                  {grade}학년
                </button>
              ))}
            </div>
            <div className="age-display">
              <span>{getAgeByGrade(selectedGrade)}</span>
            </div>
          </div>
        </div>

        {/* 시급 정보 */}
        <div className="wage-section">
          <p className="wage-label">희망 시급을 적어주세요</p>
          <div className="wage-input-group">
            <div className="wage-input-field">
              <label>최저 시급</label>
              <div className="wage-fixed">
                <span>{formatNumber(11000)}원</span>
              </div>
            </div>
            <div className="wage-separator">~</div>
            <div className="wage-input-field">
              <label>최고 시급(입력)</label>
              <div className="wage-input-container">
                <input
                  type="number"
                  value={maxWage}
                  onChange={(e) => handleMaxWageChange(e.target.value)}
                  min="11000"
                  step="1000"
                  className="wage-input"
                  placeholder="최고 시급 입력"
                />
                <span className="wage-unit">원</span>
              </div>
            </div>
          </div>
          <div className="negotiation-info">
            <div className="negotiation-icon">
              <span>✓</span>
            </div>
            <span>시급 협의 가능</span>
          </div>
          <p className="deposit-note">
            쌤 급여 지급 출금은 다음날 안으로 이루어집니다.
          </p>
        </div>

        {/* 요청사항 */}
        <div className="requests-section">
          <div className="section-icon">
            <div className="checklist-icon">
              <img src="/img/ask.png" alt="요청사항" />
            </div>
          </div>
          <div className="content-area">
            <h3>요청사항</h3>
            <textarea
              placeholder="예) 낯을 좀 가리는 편이지만 금방 친해져요.&#10;알러지, 먹으면 안되는 음식이 있어요."
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              rows="4"
            />
          </div>
        </div>

        {/* 알려주고 싶은 것 */}
        <div className="additional-info-section">
          <div className="section-icon">
            <div className="letknow-icon">
              <img src="/img/letknow.png" alt="알려주기" />
            </div>
          </div>
          <div className="content-area">
            <h3>알려주고 싶은 것</h3>
            <textarea
              placeholder="직접 책을 읽어주세요&#10;아이가 잘 읽는지 옆에서 봐주세요&#10;가끔 다른 놀이를 해도 괜찮아요"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows="4"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="save-section">
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Helpme;
