import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTeacherSearch } from "../../contexts/TeacherSearchContext";
import { useApplication } from "../../contexts/ApplicationContext";
import { searchRegionLocal } from "../../config/api";
import { searchAddress } from "../../config/api";
import axiosInstance from "../../config/axiosInstance";
import "./Helpme.css";

const Helpme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { setSearchData, searchTeachers, createTutorJob, addTutorJobCategory } =
    useTeacherSearch();
  const { formData: contextFormData, updateFormData } = useApplication();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editApplicationId, setEditApplicationId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const selectedItemsSectionRef = useRef(null);
  const [address, setAddress] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [addressResults, setAddressResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [countPerPage] = useState(10);

  // formData 상태 추가
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    area: "",
  });

  // 선택된 지역과 주소 상태 추가
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const oneMonthLater = new Date(tomorrow);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    return oneMonthLater.toISOString().split("T")[0];
  });
  const [durationType, setDurationType] = useState("regular"); // 기본값: "regular" (오랫동안)
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("13:00"); // 시작시간 + 2시간으로 초기값 설정
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [teacherName, setTeacherName] = useState("");

  // 아동 분류 폼 상태
  const [selectedChild, setSelectedChild] = useState("boy");
  const [selectedGrade, setSelectedGrade] = useState("유아");
  const [showAgeInput, setShowAgeInput] = useState(true); // 유아 선택 시 나이 입력 활성화
  const [customAge, setCustomAge] = useState("5"); // 유아 기본 나이
  const [minWage, setMinWage] = useState("11000");
  const [maxWage, setMaxWage] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [showWageDropdown, setShowWageDropdown] = useState(false);
  const [requests, setRequests] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [hopeTutorId, setHopeTutorId] = useState(null);
  const [detailAddress, setDetailAddress] = useState(""); // 세부 주소 입력을 위한 상태
  const requestsRef = useRef(null);
  const additionalInfoRef = useRef(null);

  // 입력 필드 refs 추가
  const memberIdRef = useRef(null);
  const childGenderRef = useRef(null);
  const gradeRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const selectedDaysRef = useRef(null);
  const selectedGenderRef = useRef(null);
  const minAgeRef = useRef(null);
  const maxAgeRef = useRef(null);
  const minWageRef = useRef(null);
  const maxWageRef = useRef(null);
  const addressRef = useRef(null);
  const selectedItemsRef = useRef(null);

  // 분야 카테고리 상태
  const [fieldCategories, setFieldCategories] = useState({
    care: [],
    play: [],
    study: [],
  });

  // 분야 선택 처리
  const handleFieldSelect = (fieldId) => {
    setSelectedItems((prev) => {
      if (prev.includes(fieldId)) {
        // 이미 선택된 항목이면 제거
        return prev.filter((id) => id !== fieldId);
      } else {
        // 새로운 항목 선택 시 최대 4개까지만 허용
        if (prev.length >= 4) {
          alert("최대 4개까지만 선택 가능합니다.");
          return prev;
        }
        return [...prev, fieldId];
      }
    });
  };

  // 분야 카드 렌더링
  const renderFieldCard = (field) => {
    const isSelected = selectedItems.includes(field.id);
    return (
      <div
        key={field.id}
        className={`item-card ${isSelected ? "selected" : ""}`}
        onClick={() => handleFieldSelect(field.id)}
      >
        <div
          className="item-image"
          style={{ backgroundImage: `url('${field.image}')` }}
        ></div>
        <div className="item-text">{field.name}</div>
        <div
          className={`item-icon-circle ${isSelected ? "selected" : ""}`}
        ></div>
      </div>
    );
  };

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        const data = await response.data;

        const grouped = {
          care: [],
          play: [],
          study: [],
        };

        data.forEach((item) => {
          if (grouped[item.grp_cd]) {
            grouped[item.grp_cd].push({
              id: item.id,
              category_cd: item.category_cd,
              name: item.category_nm,
              image: item.image_url,
            });
          }
        });

        setFieldCategories(grouped);
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!user) {
      alert(
        "로그인이 필요합니다. 도와줘요 쌤 기능을 이용하려면 로그인해주세요."
      );
      navigate("/login");
      return;
    }

    // 부모 회원이 아닌 경우 접근 제한
    if (user.member_type !== "parents" && user.member_type !== "admin") {
      alert("도와줘요 쌤 기능은 부모님 회원만 이용할 수 있습니다.");
      navigate("/");
      return;
    }
  }, [user, navigate]);

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
      setMinAge(applicationData.minAge || "");
      setMaxAge(applicationData.maxAge || "");
      setSelectedGender(applicationData.selectedGender || "");
      setTeacherName(applicationData.teacherName || "");
      setSelectedChild(applicationData.selectedChild || "boy");
      setSelectedGrade(applicationData.selectedGrade || "1");
      setMinWage(applicationData.minWage || "11000");
      setMaxWage(applicationData.maxWage || "");
      setIsNegotiable(applicationData.isNegotiable || false);
      setRequests(applicationData.requests || "");
      setAdditionalInfo(applicationData.additionalInfo || "");
      setHopeTutorId(applicationData.hopeTutorId || null);
    }
  }, [location.state]);

  // 쌤 검색에서 선택된 쌤 정보 처리
  useEffect(() => {
    // 커스텀 이벤트 리스너 추가
    const handleTeacherSelected = (event) => {
      const { teacher } = event.detail;
      console.log("선택된 쌤 정보:", teacher);

      // 선택된 쌤의 ID만 hope_tutor_id에 설정
      setHopeTutorId(teacher.id);

      // 선택된 쌤의 이름을 teacherName 필드에 설정
      setTeacherName(teacher.name);

      // 지정 쌤 검색 섹션으로 스크롤
      setTimeout(() => {
        const teacherSearchSection = document.querySelector(
          ".teacher-search-section"
        );
        if (teacherSearchSection) {
          teacherSearchSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    };

    // 이벤트 리스너 등록
    window.addEventListener("teacherSelected", handleTeacherSelected);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("teacherSelected", handleTeacherSelected);
    };
  }, []);

  // 전역 변수에서 쌤 선택 정보 확인 (컴포넌트 마운트 시)
  useEffect(() => {
    // 전역 변수에서 쌤 선택 정보 확인
    if (window.fromTeacherSearch && window.selectedTeacher) {
      const teacher = window.selectedTeacher;
      console.log("전역 변수에서 선택된 쌤 정보:", teacher);

      // 선택된 쌤의 ID만 hope_tutor_id에 설정
      setHopeTutorId(teacher.id);

      // 선택된 쌤의 이름을 teacherName 필드에 설정
      setTeacherName(teacher.name);

      // 전역 변수 정리
      window.fromTeacherSearch = false;
      window.selectedTeacher = null;

      // 지정 쌤 검색 섹션으로 스크롤
      setTimeout(() => {
        const teacherSearchSection = document.querySelector(
          ".teacher-search-section"
        );
        if (teacherSearchSection) {
          teacherSearchSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, []);

  // 요일 버튼 클릭 핸들러
  const handleDayClick = (day) => {
    // 한번만 모드에서는 요일 선택을 제한
    if (durationType === "onetime") {
      alert(
        "한번만 모드에서는 요일을 변경할 수 없습니다. 날짜를 변경하면 해당 요일이 자동으로 설정됩니다."
      );
      return;
    }

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
    // 유아 선택 시 나이 입력 활성화, 다른 학년 선택 시 비활성화
    if (grade === "유아") {
      setShowAgeInput(true);
    } else {
      setShowAgeInput(false);
    }
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

  // 시작시간 변경 핸들러
  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);

    // 시작시간이 변경되면 끝시간을 자동으로 2시간 후로 설정
    const startDate = new Date(`2000-01-01T${newStartTime}:00`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2시간 추가

    const newEndTime = endDate.toTimeString().slice(0, 5); // HH:MM 형식
    setEndTime(newEndTime);
  };

  // 끝시간 변경 핸들러
  const handleEndTimeChange = (newEndTime) => {
    const startDate = new Date(`2000-01-01T${startTime}:00`);
    const endDate = new Date(`2000-01-01T${newEndTime}:00`);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      alert("끝시간은 시작시간보다 최소 2시간 이후여야 합니다.");
      return;
    }

    setEndTime(newEndTime);
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
      setMinAge(numValue);
    } else {
      setMaxAge(numValue);
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

  // 주소 검색
  const handleAddressSearch = async (page = 1) => {
    const keyword = searchQuery;

    if (!keyword || keyword.trim() === "") {
      return;
    }

    try {
      const response = await searchAddress(keyword, page, countPerPage);

      if (response?.data?.addresses) {
        setAddressResults(response.data.addresses);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.currentPage || 1);
        setShowAddressSearch(true);
      } else if (response?.data?.data) {
        // 다른 구조일 가능성
        setAddressResults(response.data.data);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.currentPage || 1);
        setShowAddressSearch(true);
      } else {
        alert("주소는 없거나 자세히 입력해 주세요.");
        setAddressResults([]);
        setShowAddressSearch(false);
      }
    } catch (error) {
      console.error("주소 검색 오류:", error);
      alert("주소검색 중 오류가 발생했습니다.");
      setAddressResults([]);
      setShowAddressSearch(false);
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    // 백엔드에서 받은 필드명 사용
    const addressText = selectedAddress.address || "";

    // formData 업데이트
    setFormData((prev) => ({
      ...prev,
      address: addressText,
      city: selectedAddress.city || "", // 백엔드에서 받은 city
      area: selectedAddress.area || "", // 백엔드에서 받은 area
    }));

    // 선택 지역에 city + 빈칸 + area 세팅
    const regionText =
      selectedAddress.city && selectedAddress.area
        ? `${selectedAddress.city} ${selectedAddress.area}`
        : "지역 정보 없음";

    // 선택한 주소를 주소 입력항목에 설정
    setAddress(addressText);

    // 선택 주소에 전체 주소 세팅
    setSelectedRegion(regionText);
    setSelectedAddress(addressText);
    setSearchResult(addressText);
    setShowAddressSearch(false);
    setSearchQuery(addressText); // 검색 쿼리도 선택된 주소로 업데이트
    setAddressResults([]);
  };

  const handleTeacherSearch = async () => {
    console.log("지정 쌤 검색 버튼 클릭됨");
    console.log("검색할 쌤 이름:", teacherName);

    if (!teacherName || !teacherName.trim()) {
      alert("쌤 이름을 입력해주세요.");
      return;
    }

    // 로그인 상태 확인
    if (!user || !localStorage.getItem("authToken")) {
      alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    try {
      const results = await searchTeachers(teacherName.trim());
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

  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("돌봄 분야를 선택해주세요.");
      if (selectedItemsSectionRef.current) {
        selectedItemsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    if (!address.trim()) {
      alert("주소를 입력해주세요.");
      if (addressRef.current) {
        addressRef.current.focus();
      }
      return;
    }

    if (selectedDays.length === 0) {
      alert("활동 요일을 선택해주세요.");
      return;
    }

    // 시간 간격 검증
    const startTimeDate = new Date(`2000-01-01T${startTime}:00`);
    const endTimeDate = new Date(`2000-01-01T${endTime}:00`);
    const timeDiff = endTimeDate.getTime() - startTimeDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      alert("시작시간과 끝시간은 최소 2시간 이상의 간격이 필요합니다.");
      return;
    }

    // 유아 나이 검증
    if (selectedGrade === "유아") {
      const age = parseInt(customAge);
      if (age < 1 || age > 6) {
        alert("유아는 1세 이상 6세 이하만 입력 가능합니다.");
        return;
      }
    }

    // 쌤 나이 검증
    if (!minAge || minAge === "") {
      alert("최소 나이를 입력해주세요.");
      if (minAgeRef.current) {
        minAgeRef.current.focus();
      }
      return;
    }

    if (!maxAge || maxAge === "") {
      alert("최대 나이를 입력해주세요.");
      if (maxAgeRef.current) {
        maxAgeRef.current.focus();
      }
      return;
    }

    if (minAge < 18) {
      alert("최소 나이는 18세 이상이어야 합니다.");
      if (minAgeRef.current) {
        minAgeRef.current.focus();
      }
      return;
    }

    if (minAge > 80) {
      alert("최소 나이는 80세 이하여야 합니다.");
      if (minAgeRef.current) {
        minAgeRef.current.focus();
      }
      return;
    }

    if (maxAge < 18) {
      alert("최대 나이는 18세 이상이어야 합니다.");
      if (maxAgeRef.current) {
        maxAgeRef.current.focus();
      }
      return;
    }

    if (maxAge > 80) {
      alert("최대 나이는 80세 이하여야 합니다.");
      if (maxAgeRef.current) {
        maxAgeRef.current.focus();
      }
      return;
    }

    if (minAge > maxAge) {
      alert("최소 나이는 최대 나이보다 클 수 없습니다.");
      if (minAgeRef.current) {
        minAgeRef.current.focus();
      }
      return;
    }

    // 요구사항 메시지 검증
    if (!additionalInfo.trim()) {
      alert("요구사항 메시지를 입력해주세요.");
      if (additionalInfoRef.current) {
        additionalInfoRef.current.focus();
      }
      return;
    }

    // 세부 주소를 포함한 전체 주소 구성
    const fullAddress = detailAddress.trim()
      ? `${address} ${detailAddress}`
      : address;

    // 선택된 분야 ID를 이름으로 변환
    const allFields = [
      ...fieldCategories.care,
      ...fieldCategories.play,
      ...fieldCategories.study,
    ];
    const selectedFieldNames = selectedItems
      .map((fieldId) => {
        const field = allFields.find((f) => f.id === fieldId);
        return field ? field.name : null;
      })
      .filter((name) => name !== null);

    // 백엔드 API 호출용 데이터 구조
    const jobData = {
      title: `${selectedChild === "boy" ? "남아" : "여아"} ${
        selectedGrade === "유아" ? `(${customAge}세)` : selectedGrade
      } ${selectedFieldNames.join(", ")} 돌봄`,
      requester_id: user.id,
      target: selectedChild === "boy" ? "남아" : "여아",
      objective: selectedFieldNames.join(", "),
      work_type: durationType,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      work_day: selectedDays.join(", "),
      work_place: selectedRegion || "",
      work_place_address: fullAddress,
      payment: parseInt(maxWage.replace(/,/g, "")),
      payment_cycle: "시급",
      negotiable: isNegotiable,
      preferred_tutor_id: hopeTutorId || null,
      tutor_age_fr: minAge,
      tutor_age_to: maxAge,
      tutor_sex: selectedGender,
      description: additionalInfo,
      etc: requests || "",
    };

    try {
      console.log("공고 등록 요청 데이터:", jobData);

      if (isEditMode) {
        // 수정 모드일 때는 기존 로직 유지 (로컬 스토리지)
        const applicationData = {
          id: editApplicationId,
          parentId: user.id,
          selectedItems,
          address: fullAddress, // 세부 주소를 포함한 전체 주소
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
          hopeTutorId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log("공고 수정:", applicationData);
        alert("공고가 수정되었습니다!");
        navigate("/applications");
      } else {
        // 새 공고 등록 시 백엔드 API 호출
        const response = await createTutorJob(jobData);
        console.log("공고 등록 성공:", response);
        console.log("응답 전체 구조:", response);

        // jobId 추출 (다양한 가능한 필드명 확인)
        const jobId =
          response.id ||
          response.jobId ||
          response.job_id ||
          response.data?.id ||
          response.data?.jobId;
        console.log("추출된 jobId:", jobId);

        // 공고 등록 성공 후 분야 정보 추가
        if (jobId && selectedItems.length > 0) {
          try {
            console.log(
              "분야 정보 추가 시작 - jobId:",
              jobId,
              "selectedItems (ID):",
              selectedItems
            );
            await addTutorJobCategory(jobId, selectedItems);
            console.log("분야 정보 추가 성공");
          } catch (categoryError) {
            console.error("분야 정보 추가 실패:", categoryError);
            // 분야 추가 실패해도 공고는 등록되었으므로 경고만 표시
            alert("공고는 등록되었지만 분야 정보 추가에 실패했습니다.");
            navigate("/applications");
            return;
          }
        } else {
          console.log(
            "jobId가 없거나 selectedItems가 비어있어 분야 추가를 건너뜀"
          );
          console.log("jobId:", jobId);
          console.log("selectedItems:", selectedItems);
        }

        alert("공고가 성공적으로 등록되었습니다!");
        navigate("/applications");
      }
    } catch (error) {
      console.error("공고 등록 실패:", error);
      alert(
        error.message || "공고 등록 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  // 학년별 나이 계산
  const getAgeByGrade = (grade) => {
    const gradeAges = {
      유아: "5세",
      1: "7세",
      2: "8세",
      3: "9세",
      4: "10세",
      5: "11세",
      6: "12세",
    };
    return gradeAges[grade] || "5세";
  };

  return (
    <div className="helpme-container">
      <div className="helpme-header">
        <h1>{isEditMode ? "공고 수정" : "도와줘요 쌤"}</h1>
        <p>{isEditMode ? "공고 정보를 수정해주세요" : "무엇을?"}</p>
      </div>

      {/* 선택된 항목 표시 섹션 */}
      <div className="selected-items-section">
        <div className="selected-items-container">
          <p className="selected-items-title">
            선택된 항목: {selectedItems.length}/4
          </p>
          {selectedItems.length > 0 && (
            <div className="selected-items-list">
              {selectedItems.map((fieldId) => {
                // 모든 카테고리에서 해당 ID의 분야 찾기
                const allFields = [
                  ...fieldCategories.care,
                  ...fieldCategories.play,
                  ...fieldCategories.study,
                ];
                const field = allFields.find((f) => f.id === fieldId);
                return field ? (
                  <div key={fieldId} className="selected-item-tag">
                    {field.name}
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      <div className="category-wrapper" ref={selectedItemsSectionRef}>
        {/* 돌봄 카테고리 */}
        <div className="category">
          <div className="category-title">돌봄</div>
          <div className="item-list">
            {fieldCategories.care.map(renderFieldCard)}
          </div>
        </div>

        {/* 놀이 카테고리 */}
        <div className="category">
          <div className="category-title">놀이</div>
          <div className="item-list">
            {fieldCategories.play.map(renderFieldCard)}
          </div>
        </div>

        {/* 스터디 카테고리 */}
        <div className="category">
          <div className="category-title">스터디</div>
          <div className="item-list">
            {fieldCategories.study.map(renderFieldCard)}
          </div>
        </div>
      </div>

      {/* ✨✨✨ 여기부터 새로운 검색 필터 UI를 추가합니다. */}
      <div className="search-filter-section">
        <div className="search-row">
          <p className="search-title">어디서?</p>
          <div className="search-input-group">
            <div className="user-location-display">
              <span className="location-label">거주:</span>
              <span className="location-value">
                {user?.city && user?.area
                  ? `${user.city} ${user.area}`
                  : "지역 정보 없음"}
              </span>
            </div>
            <input
              ref={addressRef}
              type="text"
              placeholder="도로명 주소 입력후 엔터/검색"
              className="search-input"
              value={selectedAddress || searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // 사용자가 직접 입력할 때는 선택된 주소 초기화
                if (e.target.value !== selectedAddress) {
                  setSelectedAddress("");
                }
              }}
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

          {/* 선택 지역과 세부 주소 입력 */}
          <div className="search-input-group">
            <div className="user-location-display">
              <span className="location-value">
                {selectedRegion || "선택지역"}
              </span>
            </div>
            <div className="detail-address-input">
              <input
                type="text"
                placeholder="세부 주소를 입력해주세요 (동, 호수 등)"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="detail-address-field"
              />
            </div>
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">얼마 동안?</p>
          <div className="duration-radio-group">
            <label className="duration-radio">
              <input
                type="radio"
                name="duration"
                value="regular"
                checked={durationType === "regular"}
                onChange={(e) => {
                  setDurationType(e.target.value);
                  // 오랫동안 선택 시 종료일을 시작일 + 1개월로 설정
                  if (e.target.value === "regular") {
                    const oneMonthLater = new Date(startDate);
                    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
                    setEndDate(oneMonthLater.toISOString().split("T")[0]);
                  }
                }}
              />
              <span className="radio-label">오랫동안</span>
            </label>
            <label className="duration-radio">
              <input
                type="radio"
                name="duration"
                value="onetime"
                checked={durationType === "onetime"}
                onChange={(e) => {
                  setDurationType(e.target.value);
                  // 한번만 선택 시 시작일과 종료일을 동일하게 설정
                  if (e.target.value === "onetime") {
                    setEndDate(startDate);
                    // 선택된 날짜의 요일을 자동으로 설정
                    const selectedDate = new Date(startDate);
                    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                    const dayOfWeek = dayNames[selectedDate.getDay()];
                    setSelectedDays([dayOfWeek]);
                  }
                }}
              />
              <span className="radio-label">한번만</span>
            </label>
          </div>
          <div className="date-picker-row">
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                const newStartDate = e.target.value;
                const today = new Date().toISOString().split("T")[0];

                // 시작일은 오늘 이후여야 함
                if (newStartDate <= today) {
                  alert("시작일은 오늘보다 이후여야 합니다.");
                  return;
                }

                setStartDate(newStartDate);
                // 한번만 모드일 때는 종료일도 함께 업데이트
                if (durationType === "onetime") {
                  setEndDate(newStartDate);
                  // 선택된 날짜의 요일을 자동으로 설정
                  const selectedDate = new Date(newStartDate);
                  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                  const dayOfWeek = dayNames[selectedDate.getDay()];
                  setSelectedDays([dayOfWeek]);
                }
                // 오랫동안 모드일 때는 종료일을 시작일 + 1개월로 설정
                else if (durationType === "regular") {
                  const oneMonthLater = new Date(newStartDate);
                  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
                  setEndDate(oneMonthLater.toISOString().split("T")[0]);
                }
              }}
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => {
                // 한번만 모드일 때는 종료일 변경을 차단
                if (durationType === "onetime") {
                  console.log("한번만 모드: 종료일 변경 차단됨");
                  return;
                }

                const newEndDate = e.target.value;
                const today = new Date().toISOString().split("T")[0];

                // 오랫동안 모드일 때는 종료일이 시작일보다 이후여야 함
                if (durationType === "regular" && newEndDate <= startDate) {
                  alert("종료일은 시작일보다 이후여야 합니다.");
                  return;
                }

                setEndDate(newEndDate);
              }}
              disabled={durationType === "onetime"}
              className={
                durationType === "onetime" ? "disabled-date-input" : ""
              }
            />
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">언제?</p>
          <div className="day-selector">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <button
                key={day}
                className={`day-button ${
                  selectedDays.includes(day) ? "active" : ""
                } ${durationType === "onetime" ? "disabled-day-button" : ""}`}
                onClick={() => handleDayClick(day)}
                disabled={durationType === "onetime"}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">몇 시에?</p>
          <div className="time-selector">
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
            />
            <span>~</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
            />
          </div>
          <p className="time-note">※ 최소 2시간 이상의 간격이 필요합니다.</p>
        </div>

        <div className="filter-group-inline">
          <p className="filter-title">누가?</p>
        </div>

        <div className="filter-group-inline">
          <p className="filter-title-small">원하시는 쌤 성별</p>
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

        <div className="filter-group-inline">
          <p className="filter-title-small">쌤 연령 범위</p>
          <div className="age-range-container">
            <div className="age-input-container">
              <div className="age-input-group">
                <label>최소 나이</label>
                <input
                  ref={minAgeRef}
                  type="number"
                  value={minAge}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "" || isNaN(inputValue)) {
                      return; // 빈 값이나 숫자가 아닌 값은 무시
                    }
                    const value = parseInt(inputValue);
                    if (value !== minAge) {
                      handleAgeChange("min", value);
                    }
                  }}
                  className="age-input"
                />
                <span>세</span>
              </div>
              <span className="age-separator">~</span>
              <div className="age-input-group">
                <label>최대 나이</label>
                <input
                  ref={maxAgeRef}
                  type="number"
                  value={maxAge}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "" || isNaN(inputValue)) {
                      return; // 빈 값이나 숫자가 아닌 값은 무시
                    }
                    const value = parseInt(inputValue);
                    if (value !== maxAge) {
                      handleAgeChange("max", value);
                    }
                  }}
                  className="age-input"
                />
                <span>세</span>
              </div>
            </div>

            <div className="age-range-label">
              18세 ~ 80세 범위에서 선택해주세요
            </div>
          </div>
        </div>
      </div>
      {/* 새로 추가한 검색 필터 UI 끝! */}

      {/* 지정 쌤 검색 섹션 */}
      <div className="teacher-search-section">
        <div className="teacher-search-header">
          <h3 className="teacher-search-title">지정 쌤 검색</h3>
          <p className="teacher-search-warning">
            ⚠️ 주의: 지정쌤 검색 시 입력하신 내용이 초기화될 수 있습니다. 지정쌤
            선택후에 나머지 내용을 입력하세요.
          </p>
        </div>

        <div className="teacher-search-input-group">
          <input
            type="text"
            placeholder="쌤 이름을 입력하세요"
            className={`teacher-search-input ${hopeTutorId ? "disabled" : ""}`}
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            disabled={hopeTutorId !== null}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleTeacherSearch();
              }
            }}
          />
          <button
            className={`teacher-search-button ${hopeTutorId ? "selected" : ""}`}
            disabled={hopeTutorId !== null}
          >
            {hopeTutorId ? "선택됨" : "검색"}
          </button>
          {hopeTutorId && (
            <button
              className="teacher-reset-button"
              onClick={() => {
                setHopeTutorId(null);
                setTeacherName("");
              }}
            >
              검색
            </button>
          )}
        </div>
      </div>

      {/* 아동 분류 폼 섹션 */}
      <div className="child-classification-section">
        <h2 className="classification-title">누구를?</h2>

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
              {["유아", "1", "2", "3", "4", "5", "6"].map((grade) => (
                <button
                  key={grade}
                  className={`grade-button ${
                    selectedGrade === grade ? "active" : ""
                  }`}
                  onClick={() => handleGradeSelect(grade)}
                >
                  {grade === "유아" ? "유아" : `${grade}학년`}
                </button>
              ))}
            </div>
            <div className="age-display">
              {showAgeInput ? (
                <div className="custom-age-input">
                  <span>나이: </span>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={customAge}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log("나이 입력 변경:", value);

                      if (value >= 1 && value <= 6) {
                        setCustomAge(e.target.value);
                      } else if (value > 6) {
                        alert("유아는 6세 이하만 입력 가능합니다.");
                        setCustomAge("6");
                      } else if (value < 1) {
                        alert("유아는 1세 이상만 입력 가능합니다.");
                        setCustomAge("1");
                      }
                    }}
                    onInput={(e) => {
                      console.log("나이 입력 이벤트:", e.target.value);
                    }}
                    className="age-input"
                    placeholder="5"
                  />
                  <span>세</span>
                </div>
              ) : (
                <span>{getAgeByGrade(selectedGrade)}</span>
              )}
              {showAgeInput && (
                <div className="age-note">
                  <span>※ 1세 ~ 6세만 입력 가능</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 시급 정보 */}
        <div className="wage-section">
          <p className="wage-label">시급</p>
          <div className="wage-input-group">
            <div className="wage-input-field">
              <label>최저 시급</label>
              <div className="wage-input-container display-only">
                <input
                  type="text"
                  value={formatNumber(minWage)}
                  readOnly
                  className="wage-input display-only"
                  placeholder="최저 시급"
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

        {/* 알려주고 싶은 것 */}
        <div className="additional-info-section">
          <div className="section-icon">
            <div className="letknow-icon">
              <img src="/img/letknow.png" alt="알려주기" />
            </div>
          </div>
          <div className="content-area">
            <h3>이렇게 해주세요!</h3>
            <textarea
              ref={additionalInfoRef}
              placeholder="예시) 직접 책을 읽어주세요&#10;아이가 잘 읽는지 옆에서 봐주세요&#10;가끔 다른 놀이를 해도 괜찮아요"
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
