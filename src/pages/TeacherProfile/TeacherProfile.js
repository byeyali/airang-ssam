import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTeacher } from "../../contexts/TeacherContext";
import RegionSearch from "../../components/RegionSearch/RegionSearch";
import axiosInstance from "../../config/axiosInstance";

import "./TeacherProfile.css";

const TeacherProfile = () => {
  const { user } = useUser();
  const { createTutor, getTutorById } = useTeacher();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);

  // 카테고리
  const [fieldCategories, setFieldCategories] = useState({
    care: [],
    play: [],
    study: [],
  });

  // 분야 선택 상태
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [isGraduate, setIsGraduate] = useState("");
  const [careerYears, setCareerYears] = useState(0);
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [certification, setCertification] = useState("");
  const [photoFile, setPhotoFile] = useState({
    photo_image: null,
  });

  /************************************************** */
  const [uploadedFiles, setUploadedFiles] = useState({
    identityVerification: null,
    healthCheck: null,
    qualification: null,
    portfolio: null,
    bankbook: null,
  });
  /************************************************** */

  const selectRef = useRef(null);
  const birthYearRef = useRef(null);
  const genderRef = useRef(null);
  const locationRef = useRef(null);
  const introductionRef = useRef(null);

  // 기존 프로필 데이터 불러오기
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
              id: item.category_cd,
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
    if (user && user.type === "tutor") {
      const existingProfile = getTutorById(user.id);
      if (existingProfile) {
        setIsEditMode(true);
        setSelectedFields(existingProfile.fields || []);
        setSelectedRegions(existingProfile.regions || []);
        setSchool(existingProfile.school || "");
        setMajor(existingProfile.major || "");
        setIsGraduate(existingProfile.is_graduate || false);
        setCareerYears(existingProfile.career_years || 0);
        setBirthYear(existingProfile.birthYear || "");
        setGender(existingProfile.gender || "");
        setIntroduction(existingProfile.introduction || "");
        setCertification(existingProfile.certification || "");

        setPhotoFile(
          existingProfile.photoFile || {
            photo_image: null,
          }
        );
        setUploadedFiles(
          existingProfile.uploadedFiles || {
            identityVerification: null,
            healthCheck: null,
            qualification: null,
            portfolio: null,
            bankbook: null,
          }
        );
      }
    }

    if (!user) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, getTutorById, navigate]);

  // 분야 선택 처리
  const handleFieldSelect = (fieldId) => {
    setSelectedFields((prev) => {
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

  // 지역 API 호출
  const fetchRegions = async (query) => {
    try {
      const response = await axiosInstance.get(
        `/locations/area?keyword=${encodeURIComponent(query)}`
      );
      return response.data.regionArray || [];
    } catch (error) {
      return [];
    }
  };

  // 지역 선택 처리 (빈 지역 필터링)
  const handleRegionSelect = (regions) => {
    // 빈 지역 필터링
    const validRegions = regions.filter(
      (region) => region && region.regionNm && region.regionNm.trim() !== ""
    );

    setSelectedRegions(validRegions);
  };

  // 성별 선택 처리
  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  // 자기소개 입력 처리
  const handleIntroductionChange = (inputIntroduction) => {
    setIntroduction(inputIntroduction);
  };

  // 자기소개 입력 처리
  const handleCertificationChange = (inputCertification) => {
    setCertification(inputCertification);
  };

  // 파일 업로드 처리
  const handleFileUpload = (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      if (fileType === "photo") {
        // 사진 파일은 별도 상태로 처리
        setPhotoFile({ photo_image: file });
      } else {
        // 일반 파일은 uploadedFiles에 저장
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }));
      }
    }
  };

  // 저장 처리
  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
      return;
    }

    if (selectedFields.length === 0) {
      alert("활동하실 돌봄 분야를 선택해주세요.");
      setTimeout(() => {
        selectRef.current?.focus();
      }, 0);
      return;
    }

    if (!birthYear) {
      alert("생년을 입력해주세요.");
      setTimeout(() => {
        birthYearRef.current?.focus();
      }, 0);
      return;
    }

    if (!gender) {
      alert("성별을 입력해주세요");
      setTimeout(() => {
        genderRef.current?.focus();
      }, 0);
      return;
    }

    if (selectedRegions.length === 0) {
      alert("활동 가능한 지역을 선택해주세요.");
      setTimeout(() => {
        locationRef.current?.focus();
      }, 0);
      return;
    }

    // 활동가능 지역 선택 갯수 체크
    if (selectedRegions.length > 4) {
      alert("활동 가능한 지역은 내개의 지역입니다.");
      return;
    }

    // 활동가능 지역 선택 갯수 체크
    if (!introduction || introduction.trim() === "") {
      alert("자기소개를 입력하세요");
      setTimeout(() => {
        introductionRef.current?.focus();
      }, 0);
      return;
    }

    if (!photoFile.photo_image) {
      alert("프로필 사진을 업로드해주세요.");
      return;
    }

    // 사용자 프로필 업데이트
    const profileData = {
      selectedFields,
      school,
      major,
      isGraduate,
      careerYears,
      birthYear,
      gender,
      selectedRegions,
      introduction,
      certification,
      photoFile,
      uploadedFiles,
      profileCompleted: true,
    };

    const submitData = new FormData();

    // FormData에 텍스트 데이터 append
    submitData.append("school", school);
    submitData.append("major", major);
    submitData.append("is_graduate", isGraduate);
    submitData.append("career_years", careerYears);
    submitData.append("birth_year", birthYear);
    submitData.append("gender", gender);
    submitData.append("introduction", introduction);
    submitData.append("certification", certification);

    // 지역과 분야는 배열 → JSON 문자열로 변환 후 전송
    //submitData.append("fields", JSON.stringify(selectedFields));
    //submitData.append("regions", JSON.stringify(selectedRegions));

    // 사진 (있을 경우)
    if (photoFile?.photo_image) {
      submitData.append("file", photoFile.photo_image);
    }

    // 필수 서류 파일들 (있을 경우에만)
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      if (file?.file) {
        submitData.append(key, file.file);
      }
    });

    try {
      await createTutor(submitData);
      alert("쌤 프로필이 성공적으로 등록되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("프로필 등록 실패:", error);
      alert("프로필 등록 중 문제가 발생했습니다.");
    }
  };

  // 분야 카드 렌더링 (Helpme 페이지와 동일한 스타일)
  const renderFieldCard = (field) => {
    const isSelected = selectedFields.includes(field.id);
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

  return !user ? (
    <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem" }}>
      로그인이 필요합니다. 로그인 페이지로 이동 중...
    </div>
  ) : (
    <div className="teacher-profile-container">
      <div className="profile-header">
        <h1>쌤 프로필 등록</h1>
        <p>자신 있는 분야는?</p>
      </div>

      {/* 분야 선택 섹션 */}
      <div className="field-selection-section">
        <div className="field-categories" ref={selectRef} tabIndex={-1}>
          {/* 돌봄 */}
          <div className="category">
            <div className="category-title">돌봄</div>
            <div className="item-list">
              {fieldCategories.care.map(renderFieldCard)}
            </div>
          </div>

          {/* 놀이 */}
          <div className="category">
            <div className="category-title">놀이</div>
            <div className="item-list">
              {fieldCategories.play.map(renderFieldCard)}
            </div>
          </div>

          {/* 스터디 */}
          <div className="category">
            <div className="category-title">스터디</div>
            <div className="item-list">
              {fieldCategories.study.map(renderFieldCard)}
            </div>
          </div>
        </div>
      </div>

      {/* 개인정보 입력 섹션 */}
      <div className="personal-info-section">
        <h3>쌤에 대해 알려주세요</h3>

        {/* 학력 및 경력 정보 */}
        <div className="basic-info-row">
          <div className="basic-info-input">
            <label>학교</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="예: 서울대학교"
            />
          </div>

          <div className="basic-info-input">
            <label>전공</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 아동교육학과"
            />
          </div>
        </div>

        <div className="basic-info-row">
          <div className="basic-info-input">
            <label>졸업</label>
            <select
              value={isGraduate}
              onChange={(e) => setIsGraduate(e.target.value)}
            >
              <option value="not applicable"></option>
              <option value="attending">재학 중</option>
              <option value="graduate">졸업</option>
            </select>
          </div>

          <div className="basic-info-input">
            <label>경력</label>
            <input
              type="number"
              min="0"
              value={careerYears}
              onChange={(e) => setCareerYears(Number(e.target.value))}
              placeholder="예: 3"
            />
            <span className="unit">년</span>
          </div>
        </div>
        <div className="basic-info-row">
          <div className="basic-info-input">
            <label>생년</label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1990"
              min="1950"
              max="2010"
              ref={birthYearRef}
              tabIndex={-1}
            />
            <span>년생</span>
          </div>

          <div className="gender-selection">
            <label>성별</label>
            <div className="gender-buttons" ref={genderRef} tabIndex={-1}>
              <button
                className={`gender-button ${
                  gender === "female" ? "selected" : ""
                }`}
                onClick={() => handleGenderSelect("female")}
              >
                여성
              </button>
              <button
                className={`gender-button ${
                  gender === "male" ? "selected" : ""
                }`}
                onClick={() => handleGenderSelect("male")}
              >
                남성
              </button>
            </div>
          </div>
        </div>

        {/* 근무 가능 위치 */}
        <div className="region-selection-container">
          <label>근무 가능 위치</label>
          <div className="region-hint">최대 4곳까지 구 단위로 선택하세요</div>
          <div className="region-search-container">
            <RegionSearch
              onRegionSelect={handleRegionSelect}
              selectedRegions={selectedRegions ?? []}
              multiple={true}
              placeholder="지역을 검색하세요"
              maxRegions={4}
              fetchRegions={fetchRegions}
              ref={locationRef}
              tabIndex={-1}
            />
          </div>
        </div>
      </div>

      {/* 자기 소개 */}
      <div className="self-introduction-section">
        <h3>자기 소개</h3>
        <textarea
          className="self-introduction-textarea"
          placeholder="자신에 대해 소개해주세요..."
          rows="4"
          value={introduction}
          onChange={(e) => handleIntroductionChange(e.target.value)}
          ref={introductionRef}
          tabIndex={-1}
        />
        {/*  자격사항 */}
        <h3>자격사항</h3>
        <textarea
          className="self-introduction-textarea"
          placeholder="자격사항을 입력해 주세요..."
          rows="4"
          value={certification}
          onChange={(e) => handleCertificationChange(e.target.value)}
        />
        {/* 사진 업로드 */}
        <div className="photo-upload-section">
          <h4>사진 업로드</h4>
          <p className="upload-hint">
            아이를 돌보는 모습이나 학습 중인 사진이면 좋아요. (아이 얼굴은
            가려드립니다)
          </p>
          <div className="upload-item">
            <span>사진</span>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={(e) => handleFileUpload("photo", e)}
              style={{ display: "none" }}
            />
            <label htmlFor="photo-upload" className="upload-button-small">
              {photoFile.photo_image
                ? photoFile.photo_image.name
                  ? photoFile.photo_image.name // 파일 객체인 경우
                  : "이미지 업로드됨" // URL 등 문자열일 경우
                : "파일 올리기"}
            </label>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="action-buttons">
        <button className="save-button" onClick={handleSave}>
          저장
        </button>
      </div>

      {/* 파일 업로드 */}
      <div id="file-upload-section" className="file-upload-section">
        <h3>필요한 서류를 업로드해주세요</h3>
        <p className="upload-hint">
          아이를 돌보는 모습이나, 학습 중인 모습 사진이면 좋아요 (아이 얼굴
          가리지 처리해드립니다)
        </p>

        <div className="upload-list">
          {[
            { key: "identityVerification", label: "1. 신원증명" },
            { key: "healthCheck", label: "2. 건강 확인" },
            { key: "qualification", label: "3. 자격 증명" },
            { key: "portfolio", label: "4. 포트폴리오" },
            { key: "bankbook", label: "5. 통장 사본" },
          ].map(({ key, label, accept }) => (
            <div className="upload-item" key={key}>
              <span>{label}</span>
              <input
                type="file"
                id={`${key}-upload`}
                accept={accept || "*"}
                onChange={(e) => handleFileUpload(key, e)}
                style={{ display: "none" }}
              />
              <label htmlFor={`${key}-upload`} className="upload-button-small">
                {uploadedFiles[key] ? uploadedFiles[key].name : "파일 올리기"}
              </label>
            </div>
          ))}
        </div>

        <div className="file-upload-action">
          <button className="upload-button">파일 올리기</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
