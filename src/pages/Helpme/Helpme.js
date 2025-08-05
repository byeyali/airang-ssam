//
// Helpme.js
// 모든 카테고리 항목에서 중복 선택이 가능한 최종 파일
//

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTeacherSearch } from "../../contexts/TeacherSearchContext";
import { searchRegionLocal, searchTeacher } from "../../config/api";
import "./Helpme.css";

const Helpme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { setSearchData } = useTeacherSearch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editApplicationId, setEditApplicationId] = useState(null);
  // 🧠 'selectedItems'라는 상태(state)를 만들고, 초깃값으로 빈 배열([])을 넣어줘.
  // 이 배열에 선택된 항목들의 이름이 저장될 거야.
  const [selectedItems, setSelectedItems] = useState([]);
  const [address, setAddress] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [addressResults, setAddressResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2025-07-30");
  const [endDate, setEndDate] = useState("2026-07-30");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("19:00");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [selectedGender, setSelectedGender] = useState("");
  const [teacherName, setTeacherName] = useState("");

  // 아동 분류 폼 상태
  const [selectedChild, setSelectedChild] = useState("boy");
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [minWage, setMinWage] = useState("11000");
  const [maxWage, setMaxWage] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [showWageDropdown, setShowWageDropdown] = useState(false);
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

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (location.state?.editMode && location.state?.applicationData) {
      const applicationData = location.state.applicationData;
      setIsEditMode(true);
      setEditApplicationId(applicationData.id);

      // 기존 데이터로 폼 초기화
      setSelectedItems(applicationData.selectedItems || []);
      setAddress(applicationData.address || "");
      setStartDate(applicationData.startDate || "2025-07-30");
      setEndDate(applicationData.endDate || "2026-07-30");
      setSelectedDays(applicationData.selectedDays || []);
      setStartTime(applicationData.startTime || "11:00");
      setEndTime(applicationData.endTime || "19:00");
      setMinAge(applicationData.minAge || 18);
      setMaxAge(applicationData.maxAge || 45);
      setSelectedGender(applicationData.selectedGender || "");
      setTeacherName(applicationData.teacherName || "");
      setSelectedChild(applicationData.selectedChild || "boy");
      setSelectedGrade(applicationData.selectedGrade || "1");
      setMinWage(applicationData.minWage || "11000");
      setMaxWage(applicationData.maxWage || "");
      setIsNegotiable(applicationData.isNegotiable || false);
      setRequests(applicationData.requests || "");
      setAdditionalInfo(applicationData.additionalInfo || "");
    }
  }, [location.state]);

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
    // 쉼표 제거 후 숫자만 추출
    const cleanValue = value.replace(/,/g, "");
    const numValue = parseInt(cleanValue);
    if (numValue >= 11000) {
      setMinWage(cleanValue);
      // 최저 시급이 최고 시급보다 높으면 최고 시급을 최저 시급으로 설정
      if (numValue > parseInt(maxWage.replace(/,/g, ""))) {
        setMaxWage(cleanValue);
      }
    }
  };

  // 최고 시급 입력 핸들러
  const handleMaxWageChange = (value) => {
    // 쉼표 제거 후 숫자만 추출
    const cleanValue = value.replace(/,/g, "");

    // 빈 값이거나 숫자가 아닌 경우
    if (!cleanValue || isNaN(parseInt(cleanValue))) {
      setMaxWage("");
      return;
    }

    const numValue = parseInt(cleanValue);
    if (numValue >= 11000) {
      setMaxWage(cleanValue);
      // 최고 시급이 최저 시급보다 낮으면 최저 시급을 최고 시급으로 설정
      if (numValue < parseInt(minWage.replace(/,/g, ""))) {
        setMinWage(cleanValue);
      }
    }
  };

  // 시급 협의 가능 토글 핸들러
  const handleNegotiableToggle = () => {
    setIsNegotiable(!isNegotiable);
  };

  // 시급 드롭다운 토글 핸들러
  const handleWageDropdownToggle = () => {
    setShowWageDropdown(!showWageDropdown);
  };

  // 시급 선택 핸들러
  const handleWageSelect = (wage) => {
    setMaxWage(wage.toString());
    setShowWageDropdown(false);
  };

  // 연령 범위 핸들러
  const handleAgeChange = (type, value) => {
    const numValue = parseInt(value);

    if (type === "min") {
      // 최소값 슬라이더: 최대값보다 클 수 없도록 제한
      if (numValue >= 18 && numValue <= 80) {
        if (numValue <= maxAge) {
          setMinAge(numValue);
        } else {
          // 최소값이 최대값보다 커지면 최대값을 최소값으로 설정
          setMinAge(numValue);
          setMaxAge(numValue);
        }
      }
    } else {
      // 최대값 슬라이더: 최소값보다 작을 수 없도록 제한
      if (numValue >= 18 && numValue <= 80) {
        if (numValue >= minAge) {
          setMaxAge(numValue);
        } else {
          // 최대값이 최소값보다 작아지면 최소값을 최대값으로 설정
          setMaxAge(numValue);
          setMinAge(numValue);
        }
      }
    }
  };

  // 슬라이더 범위 업데이트 함수 (사용하지 않음)
  const updateSliderRange = (min, max) => {
    const minPercent = ((min - 20) / (80 - 20)) * 100;
    const maxPercent = ((max - 20) / (80 - 20)) * 100;

    const sliderContainer = document.querySelector(".age-slider-container");
    if (sliderContainer) {
      sliderContainer.style.setProperty("--min-percent", minPercent);
      sliderContainer.style.setProperty("--max-percent", maxPercent);
    }
  };

  // 컴포넌트 마운트 시 초기 범위 설정 (사용하지 않음)
  // useEffect(() => {
  //   updateSliderRange(minAge, maxAge);
  // }, [minAge, maxAge]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showWageDropdown &&
        !event.target.closest(".wage-dropdown-container")
      ) {
        setShowWageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWageDropdown]);

  // 숫자에 쉼표 추가하는 함수
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAddressSearch = async () => {
    console.log("Helpme 주소 검색 버튼 클릭됨");
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

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setSearchResult(selectedAddress);
    setShowAddressSearch(false);
    setSearchQuery("");
    setAddressResults([]);
  };

  const handleTeacherSearch = async () => {
    console.log("지정 쌤 검색 버튼 클릭됨");
    console.log("검색할 쌤 이름:", teacherName);

    if (!teacherName.trim()) {
      alert("쌤 이름을 입력해주세요.");
      return;
    }

    try {
      console.log("API 호출 시작...");
      const results = await searchTeacher(teacherName);
      console.log("API 응답:", results);

      if (results && results.length > 0) {
        // Context에 검색 결과 저장
        setSearchData(results, teacherName);

        // 모달 열기
        navigate("/teacher-search");
      } else {
        alert(`${teacherName} 쌤을 찾을 수 없습니다.`);
      }
    } catch (error) {
      console.error("쌤 검색 오류:", error);
      alert("쌤 검색에 실패했습니다.");
    }
  };

  // 시급 옵션 배열
  const wageOptions = [
    11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 25000,
    30000, 35000, 40000,
  ];

  const handleSave = () => {
    if (!user) {
      alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("돌봄 분야를 선택해주세요.");
      return;
    }

    if (!address.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    if (selectedDays.length === 0) {
      alert("활동 요일을 선택해주세요.");
      return;
    }

    const applicationData = {
      id: isEditMode ? editApplicationId : Date.now().toString(),
      parentId: user.id,
      selectedItems,
      address,
      searchResult,
      startDate,
      endDate,
      selectedDays,
      startTime,
      endTime,
      minAge,
      maxAge,
      selectedGender,
      teacherName,
      selectedChild,
      selectedGrade,
      minWage,
      maxWage,
      isNegotiable,
      requests,
      additionalInfo,
      createdAt: isEditMode
        ? new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: isEditMode ? new Date().toISOString() : null,
    };

    console.log(isEditMode ? "공고 수정:" : "공고 등록:", applicationData);

    if (isEditMode) {
      alert("공고가 수정되었습니다!");
      navigate("/applications");
    } else {
      alert("공고가 등록되었습니다!");
      navigate("/applications");
    }
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
        <h1>{isEditMode ? "공고 수정" : "도와줘요 쌤"}</h1>
        <p>
          {isEditMode
            ? "공고 정보를 수정해주세요"
            : "어느 분야를 돌봐드리면 될까요?"}
        </p>
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
              readOnly
            />
            <input
              type="text"
              placeholder="지역명을 입력하세요 (예: 관악구)"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddressSearch();
                }
              }}
            />
            <button className="search-button" onClick={handleAddressSearch}>
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
                min="18"
                max="80"
                value={minAge}
                onChange={(e) => handleAgeChange("min", e.target.value)}
                className="age-slider min-slider"
              />
              <input
                type="range"
                min="18"
                max="80"
                value={maxAge}
                onChange={(e) => handleAgeChange("max", e.target.value)}
                className="age-slider max-slider"
              />
            </div>
            <div className="age-range-label">
              18세 ~ 80세 범위에서 선택해주세요
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

        {/* 지정 쌤 검색 섹션 */}
        <div className="teacher-search-section">
          <div className="teacher-search-header">
            <h3 className="teacher-search-title">지정 쌤 검색</h3>
          </div>

          <div className="teacher-search-input-group">
            <input
              type="text"
              placeholder="쌤 이름을 입력하세요"
              className="teacher-search-input"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleTeacherSearch();
                }
              }}
            />
            <button
              className="teacher-search-button"
              onClick={handleTeacherSearch}
            >
              검색
            </button>
          </div>
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
              <div className="wage-input-container">
                <input
                  type="text"
                  value={formatNumber(minWage)}
                  onChange={(e) => handleMinWageChange(e.target.value)}
                  className="wage-input"
                  placeholder="최저 시급 입력"
                />
                <span className="wage-unit">원</span>
              </div>
            </div>
            <div className="wage-separator">~</div>
            <div className="wage-input-field">
              <label>최고 시급</label>
              <div className="wage-dropdown-container">
                <div
                  className="wage-dropdown-button"
                  onClick={handleWageDropdownToggle}
                >
                  <span className="wage-display">
                    {maxWage ? formatNumber(maxWage) : "최고 시급 선택"}
                  </span>
                  <span className="wage-unit">원</span>
                  <span
                    className={`dropdown-arrow ${
                      showWageDropdown ? "up" : "down"
                    }`}
                  >
                    ▼
                  </span>
                </div>
                {showWageDropdown && (
                  <div className="wage-dropdown-options">
                    {wageOptions.map((wage) => (
                      <div
                        key={wage}
                        className={`wage-option ${
                          maxWage === wage.toString() ? "selected" : ""
                        }`}
                        onClick={() => handleWageSelect(wage)}
                      >
                        {formatNumber(wage)}원
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`negotiation-info ${isNegotiable ? "selected" : ""}`}
            onClick={handleNegotiableToggle}
          >
            <div className="negotiation-icon">
              <span>{isNegotiable ? "✓" : ""}</span>
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
          <button
            className={`save-button ${!user ? "disabled" : ""}`}
            onClick={handleSave}
            disabled={!user}
          >
            {user ? (isEditMode ? "수정 완료" : "저장") : "로그인 후 저장"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Helpme;
