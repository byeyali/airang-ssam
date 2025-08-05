import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTeacher } from "../../contexts/TeacherContext";
import RegionSearch from "../../components/RegionSearch/RegionSearch";
import "./TeacherProfile.css";

const TeacherProfile = () => {
  const { user, updateUserProfile } = useUser();
  const { getTeacherById } = useTeacher();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  // 분야 선택 상태
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({
    photo: null,
    identityVerification: null,
    healthCheck: null,
    qualification: null,
    portfolio: null,
    bankbook: null,
  });

  // 기존 프로필 데이터 불러오기
  useEffect(() => {
    if (user && user.type === "teacher") {
      const existingProfile = getTeacherById(user.id);
      if (existingProfile) {
        setIsEditMode(true);
        setSelectedFields(existingProfile.fields || []);
        setSelectedRegions(existingProfile.regions || []);
        setBirthYear(existingProfile.birthYear || "");
        setGender(existingProfile.gender || "");
        setUploadedFiles(
          existingProfile.uploadedFiles || {
            photo: null,
            identityVerification: null,
            healthCheck: null,
            qualification: null,
            portfolio: null,
            bankbook: null,
          }
        );
      }
    }
  }, [user, getTeacherById]);

  // 분야 카테고리 (Helpme 페이지와 동일한 구조)
  const fieldCategories = {
    care: [
      {
        id: "afterSchool",
        name: "방과 후 마중",
        image: "/img/afterschool.png",
      },
      { id: "foodCare", name: "음식 챙김", image: "/img/food.png" },
      { id: "clean", name: "정리 정돈", image: "/img/clean.png" },
      { id: "specialCare", name: "특수 돌봄", image: "/img/specialcare.png" },
    ],
    play: [
      { id: "sports", name: "스포츠", image: "/img/sports.png" },
      { id: "music", name: "음악", image: "/img/music.png" },
      { id: "art", name: "미술", image: "/img/art.png" },
      { id: "boardGame", name: "보드게임", image: "/img/boardgame.png" },
    ],
    study: [
      { id: "math", name: "산수", image: "/img/math.png" },
      { id: "subjectTutoring", name: "교과 보충", image: "/img/textbook.png" },
      { id: "readingDiscussion", name: "독서 대화", image: "/img/reading.png" },
      {
        id: "secondLanguage",
        name: "제2외국어",
        image: "/img/secondlanguage.png",
      },
    ],
  };

  // 분야 선택 처리
  const handleFieldSelect = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  // 지역 선택 처리
  const handleRegionSelect = (regions) => {
    setSelectedRegions(regions);
  };

  // 성별 선택 처리
  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  // 파일 업로드 처리
  const handleFileUpload = (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      }));
    }
  };

  // 저장 처리
  const handleSave = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
      return;
    }

    if (selectedFields.length === 0) {
      alert("활동하실 돌봄 분야를 선택해주세요.");
      return;
    }

    if (selectedRegions.length === 0) {
      alert("활동 가능한 지역을 선택해주세요.");
      return;
    }

    if (!birthYear || !gender) {
      alert("생년과 성별을 입력해주세요.");
      return;
    }

    // 사용자 프로필 업데이트
    const profileData = {
      selectedFields,
      selectedRegions,
      birthYear,
      gender,
      uploadedFiles,
      profileCompleted: true,
    };

    updateUserProfile(profileData);
    alert("프로필이 성공적으로 저장되었습니다!");
    navigate("/applications");
  };

  // 분야 카드 렌더링 (Helpme 페이지와 동일한 스타일)
  const renderFieldCard = (field) => {
    const isSelected = selectedFields.includes(field.id);
    return (
      <div
        key={field.id}
        className="item-card"
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

  return (
    <div className="teacher-profile-container">
      <div className="profile-header">
        <h1>{isEditMode ? "쌤 프로필 수정" : "쌤 프로필 등록"}</h1>
        <p>
          {isEditMode
            ? "프로필 정보를 수정해주세요"
            : "활동하실 돌봄 분야 선택해주세요"}
        </p>
      </div>

      {/* 분야 선택 섹션 */}
      <div className="field-selection-section">
        <div className="field-categories">
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
      </div>

      {/* 개인정보 입력 섹션 */}
      <div className="personal-info-section">
        <div className="birth-year-input">
          <label>생년</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="1990"
            min="1950"
            max="2010"
          />
          <span>년생</span>
        </div>

        <div className="gender-selection">
          <label>성별</label>
          <div className="gender-buttons">
            <button
              className={`gender-button ${
                gender === "female" ? "selected" : ""
              }`}
              onClick={() => handleGenderSelect("female")}
            >
              여성
            </button>
            <button
              className={`gender-button ${gender === "male" ? "selected" : ""}`}
              onClick={() => handleGenderSelect("male")}
            >
              남성
            </button>
          </div>
        </div>
      </div>

      {/* 지역 선택 섹션 */}
      <div className="region-selection-section">
        <h3>어느 지역이 활동 가능하세요?</h3>
        <div className="region-search-container">
          <label>활동가능지역</label>
          <RegionSearch
            onRegionSelect={handleRegionSelect}
            selectedRegions={selectedRegions}
            multiple={true}
            placeholder="지역을 검색하세요"
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="action-buttons">
        <button className="save-button" onClick={handleSave}>
          {isEditMode ? "수정 완료" : "저장"}
        </button>
        <button
          className="upload-button"
          onClick={() =>
            document.getElementById("file-upload-section").scrollIntoView()
          }
        >
          파일 올리기
        </button>
      </div>

      {/* 파일 업로드 섹션 */}
      <div id="file-upload-section" className="file-upload-section">
        <h3>필요한 서류를 업로드해주세요</h3>
        <p className="upload-hint">
          아이를 돌보는 모습이나, 학습 중인 모습 사진이면 좋아요 (아이 얼굴
          가리지 처리해드립니다)
        </p>

        <div className="upload-list">
          <div className="upload-item">
            <span>1. 사진</span>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={(e) => handleFileUpload("photo", e)}
              style={{ display: "none" }}
            />
            <label htmlFor="photo-upload" className="upload-button-small">
              {uploadedFiles.photo ? uploadedFiles.photo.name : "파일 올리기"}
            </label>
          </div>

          <div className="upload-item">
            <span>2. 신원증명</span>
            <input
              type="file"
              id="identity-upload"
              onChange={(e) => handleFileUpload("identityVerification", e)}
              style={{ display: "none" }}
            />
            <label htmlFor="identity-upload" className="upload-button-small">
              {uploadedFiles.identityVerification
                ? uploadedFiles.identityVerification.name
                : "파일 올리기"}
            </label>
          </div>

          <div className="upload-item">
            <span>3. 건강 확인</span>
            <input
              type="file"
              id="health-upload"
              onChange={(e) => handleFileUpload("healthCheck", e)}
              style={{ display: "none" }}
            />
            <label htmlFor="health-upload" className="upload-button-small">
              {uploadedFiles.healthCheck
                ? uploadedFiles.healthCheck.name
                : "파일 올리기"}
            </label>
          </div>

          <div className="upload-item">
            <span>4. 자격 증명</span>
            <input
              type="file"
              id="qualification-upload"
              onChange={(e) => handleFileUpload("qualification", e)}
              style={{ display: "none" }}
            />
            <label
              htmlFor="qualification-upload"
              className="upload-button-small"
            >
              {uploadedFiles.qualification
                ? uploadedFiles.qualification.name
                : "파일 올리기"}
            </label>
          </div>

          <div className="upload-item">
            <span>5. 포트폴리오</span>
            <input
              type="file"
              id="portfolio-upload"
              onChange={(e) => handleFileUpload("portfolio", e)}
              style={{ display: "none" }}
            />
            <label htmlFor="portfolio-upload" className="upload-button-small">
              {uploadedFiles.portfolio
                ? uploadedFiles.portfolio.name
                : "파일 올리기"}
            </label>
          </div>

          <div className="upload-item">
            <span>6. 통장 사본</span>
            <input
              type="file"
              id="bankbook-upload"
              onChange={(e) => handleFileUpload("bankbook", e)}
              style={{ display: "none" }}
            />
            <label htmlFor="bankbook-upload" className="upload-button-small">
              {uploadedFiles.bankbook
                ? uploadedFiles.bankbook.name
                : "파일 올리기"}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
