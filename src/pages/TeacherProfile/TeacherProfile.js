import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTeacher } from "../../contexts/TeacherContext";
import RegionSearch from "../../components/RegionSearch/RegionSearch";
import axiosInstance from "../../config/axiosInstance";

import "./TeacherProfile.css";

const TeacherProfile = () => {
  const { user } = useUser();
  const {
    createTutor,
    getTutorById,
    getTutorCategories,
    getTutorRegions,
    addTutorCategories,
    addTutorRegions,
    deleteTutorCategories,
    deleteTutorRegions,
    updateTutor,
    saveTutorFilePaths,
    uploadTutorFiles,
    setError,
  } = useTeacher();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카테고리
  const [fieldCategories, setFieldCategories] = useState({
    care: [],
    play: [],
    study: [],
  });

  // 분야 선택 상태
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [isGraduate, setIsGraduate] = useState("");
  const [careerYears, setCareerYears] = useState(0);
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [certification, setCertification] = useState("");
  const [photoFile, setPhotoFile] = useState({
    photo_image: null, // 클라이언트 파일 객체 (File)
    photo_path: null, // 서버 반환 경로 (String - Azure Blob URL)
  });

  // 파일 업로드
  const [uploadedFiles, setUploadedFiles] = useState({
    identityVerification: null,
    healthCheck: null,
    qualification: null,
    portfolio: null,
    bankbook: null,
  });

  // 업로드 파일 경로
  const [serverFilePaths, setServerFilePaths] = useState({
    identityVerification: null,
    healthCheck: null,
    qualification: null,
    portfolio: null,
    bankbook: null,
  });

  const selectRef = useRef(null);
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

    const fetchExistingProfile = async () => {
      if (user && (user.type === "tutor" || user.member_type === "tutor")) {
        const userId = user.id || user.member_id;

        try {
          const existingProfile = await getTutorById(userId);

          if (existingProfile && existingProfile.data) {
            // 기존 프로필이 있는 경우 - 수정 모드
            const profileData = existingProfile.data;
            setIsEditMode(true);

            // 분야 데이터는 TeacherContext의 함수로 가져오기
            const fetchTutorCategories = async () => {
              try {
                const categoryIds = await getTutorCategories(profileData.id);
                setSelectedFields(categoryIds);
              } catch (error) {
                console.error("분야 데이터 로드 실패:", error);
                setSelectedFields([]);
                console.warn(
                  "분야 데이터를 불러올 수 없습니다. 빈 상태로 진행합니다."
                );
              }
            };

            // 분야 데이터 로드 (에러가 발생해도 계속 진행)
            fetchTutorCategories();

            // 지역 데이터는 TeacherContext의 함수로 가져오기
            const fetchTutorRegions = async () => {
              try {
                const regions = await getTutorRegions(profileData.id);
                setSelectedRegions(regions);
              } catch (error) {
                setSelectedRegions([]);
                console.warn(
                  "지역 데이터를 불러올 수 없습니다. 빈 상태로 진행합니다."
                );
              }
            };

            // 지역 데이터 로드 (에러가 발생해도 계속 진행)
            fetchTutorRegions();
            setSchool(profileData.school || "");
            setMajor(profileData.major || "");
            setIsGraduate(
              profileData.is_graduate || profileData.isGraduate || false
            );
            setCareerYears(
              profileData.career_years || profileData.careerYears || 0
            );
            setBirthYear(profileData.birth_year || profileData.birthYear || "");
            setGender(profileData.gender || "");
            setIntroduction(profileData.introduction || "");
            setCertification(profileData.certification || "");

            // 사진 파일 정보 설정
            setPhotoFile({
              photo_image: null,
              photo_path:
                profileData.photo_path || profileData.photoPath || null,
            });
            console.log(
              "기존 프로필 사진 경로:",
              profileData.photo_path || profileData.photoPath
            );

            // 업로드된 파일 정보 설정
            setUploadedFiles({
              identityVerification:
                profileData.identity_verification ||
                profileData.identityVerification ||
                null,
              healthCheck:
                profileData.health_check || profileData.healthCheck || null,
              qualification: profileData.qualification || null,
              portfolio: profileData.portfolio || null,
              bankbook: profileData.bankbook || null,
            });

            // 서버 파일 경로 정보 설정
            setServerFilePaths({
              identityVerification:
                profileData.identity_verification_path ||
                profileData.identityVerificationPath ||
                null,
              healthCheck:
                profileData.health_check_path ||
                profileData.healthCheckPath ||
                null,
              qualification:
                profileData.qualification_path ||
                profileData.qualificationPath ||
                null,
              portfolio:
                profileData.portfolio_path || profileData.portfolioPath || null,
              bankbook:
                profileData.bankbook_path || profileData.bankbookPath || null,
            });
          } else {
            // 기존 프로필이 없는 경우 - 신규 등록 모드
            setIsEditMode(false);

            // user.name 에서 이름 추출
            setName(user.name);

            // user.birth_date에서 생년 추출
            let defaultBirthYear = "";
            if (user.birth_date) {
              const birthDate = new Date(user.birth_date);
              if (!isNaN(birthDate.getTime())) {
                defaultBirthYear = birthDate.getFullYear().toString();
              }
            }

            // 주민등록번호 7번째 자리로 성별 추출
            let defaultGender = "";
            if (user.residence_no && user.residence_no.length >= 7) {
              const seventhDigit = parseInt(user.residence_no.charAt(6));
              if (
                seventhDigit === 1 ||
                seventhDigit === 3 ||
                seventhDigit === 5
              ) {
                defaultGender = "male";
              } else if (
                seventhDigit === 2 ||
                seventhDigit === 4 ||
                seventhDigit === 6
              ) {
                defaultGender = "female";
              }
            }

            // 입력 가능하도록 초기화된 값 설정
            setSelectedFields([]);
            setSelectedRegions([]);
            setSchool("");
            setMajor("");
            setIsGraduate(false);
            setCareerYears(0);
            setBirthYear(defaultBirthYear);
            setGender(defaultGender);
            setIntroduction("");
            setCertification("");

            // 파일 정보 초기화
            setPhotoFile({
              photo_image: null,
              photo_path: null,
            });

            setUploadedFiles({
              identityVerification: null,
              healthCheck: null,
              qualification: null,
              portfolio: null,
              bankbook: null,
            });

            setServerFilePaths({
              identityVerification: null,
              healthCheck: null,
              qualification: null,
              portfolio: null,
              bankbook: null,
            });
          }
        } catch (error) {
          console.error("프로필 로드 실패:", error);
          // 네트워크 에러나 서버 에러 등 예상치 못한 에러 처리
          if (setError) {
            setError("프로필을 불러오는 중 오류가 발생했습니다.");
          }
        }
      }
    };

    fetchCategories();
    fetchExistingProfile();

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
            file: file, // 실제 파일 객체 저장
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }));
      }
    }
  };

  // 파일 업로드 액션 처리
  const handleFileUploadAction = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
      return;
    }

    const filesToUpload = Object.keys(uploadedFiles).filter(
      (key) => uploadedFiles[key]
    );
    if (filesToUpload.length === 0) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }

    try {
      // 임시로 tutorId를 1로 설정 (실제로는 생성된 tutorId를 사용해야 함)
      const tutorId = 1; // TODO: 실제 tutorId로 변경 필요

      const result = await uploadTutorFiles(tutorId, uploadedFiles);

      // 업로드된 파일들의 경로를 serverFilePaths에 저장
      if (result.added && Array.isArray(result.added)) {
        const newFilePaths = {};
        result.added.forEach((file) => {
          // file_doc_type을 키로 사용하여 매핑
          newFilePaths[file.file_doc_type] = file.file_path;
        });

        setServerFilePaths((prev) => ({
          ...prev,
          ...newFilePaths,
        }));
      }

      alert("파일 업로드가 완료되었습니다!");
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 저장 처리
  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
      return;
    }

    if (isSubmitting) {
      return; // 중복 제출 방지
    }

    if (selectedFields.length === 0) {
      alert("활동하실 돌봄 분야를 선택해주세요.");
      setTimeout(() => {
        selectRef.current?.focus();
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

    // 수정 모드에서는 기존 사진이 있거나 새 사진이 업로드되어야 함
    if (!isEditMode && !photoFile.photo_image) {
      alert("프로필 사진을 업로드해주세요.");
      return;
    }

    // 수정 모드에서 사진이 없는 경우 (기존 사진도 없고 새 사진도 없는 경우)
    if (isEditMode && !photoFile.photo_image && !photoFile.photo_path) {
      alert("프로필 사진을 업로드해주세요.");
      return;
    }

    const submitData = new FormData();

    // FormData에 텍스트 데이터 append
    submitData.append("name", name);
    submitData.append("school", school);
    submitData.append("major", major);
    submitData.append("is_graduate", isGraduate);
    submitData.append("career_years", careerYears);
    submitData.append("birth_year", birthYear);
    submitData.append("gender", gender);
    submitData.append("introduction", introduction);
    submitData.append("certification", certification);

    // 사진 (있을 경우) - 백엔드에서 'file' 필드로 처리
    if (photoFile?.photo_image) {
      submitData.append("file", photoFile.photo_image);
      console.log("새 사진 파일 업로드:", photoFile.photo_image.name);
    } else if (isEditMode && photoFile?.photo_path) {
      console.log("기존 사진 유지:", photoFile.photo_path);
    } else {
      console.log("사진 파일이 없습니다.");
    }

    // 현재 백엔드에서는 다른 파일들을 처리하지 않으므로 주석 처리
    // 필수 서류 파일들 (있을 경우에만)
    // Object.entries(uploadedFiles).forEach(([key, file]) => {
    //   if (file?.file) {
    //     submitData.append(key, file.file);
    //   }
    // });

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // 수정 모드: 기존 데이터 삭제 후 새로운 데이터 추가
        const userId = user.id || user.member_id;
        const existingProfile = await getTutorById(userId);

        if (existingProfile && existingProfile.data) {
          const tutorId = existingProfile.data.id;

          // 1. 기존 카테고리 삭제
          try {
            await deleteTutorCategories(tutorId);
            console.log("기존 카테고리 삭제 완료");
          } catch (error) {
            console.error("기존 카테고리 삭제 실패:", error);
          }

          // 2. 기존 지역 삭제
          try {
            await deleteTutorRegions(tutorId);
            console.log("기존 지역 삭제 완료");
          } catch (error) {
            console.error("기존 지역 삭제 실패:", error);
          }

          // 3. 튜터 정보 업데이트
          const tutorResponse = await updateTutor(tutorId, submitData);

          // 4. 새로운 카테고리 추가
          if (selectedFields && selectedFields.length > 0) {
            try {
              await addTutorCategories(tutorId, selectedFields);
              console.log("새로운 카테고리 추가 완료");
            } catch (categoryError) {
              console.error("분야 추가 실패:", categoryError);
              alert("프로필은 수정되었지만 분야 추가에 실패했습니다.");
            }
          }

          // 5. 새로운 지역 추가
          if (selectedRegions && selectedRegions.length > 0) {
            try {
              await addTutorRegions(tutorId, selectedRegions);
              console.log("새로운 지역 추가 완료");
            } catch (regionError) {
              console.error("지역 추가 실패:", regionError);
              alert("프로필은 수정되었지만 지역 추가에 실패했습니다.");
            }
          }

          alert("쌤 프로필이 성공적으로 수정되었습니다!");
          navigate("/teacher-profile");
          return;
        }
      }

      // 신규 등록 모드: 기존 로직
      const tutorResponse = await createTutor(submitData);

      // 2. 서버에서 반환된 파일 경로들을 저장
      let filePathsToSave = {};

      // 백엔드에서 photo_path를 반환하는 경우 (Azure Blob URL)
      if (tutorResponse.photo_path) {
        // 사진 경로를 photoFile 상태에 저장
        setPhotoFile((prev) => ({
          ...prev,
          photo_path: tutorResponse.photo_path,
        }));

        filePathsToSave.photo_image = tutorResponse.photo_path;
      } else {
        console.log("photo_path가 응답에 없습니다.");
      }

      // 기존 filePaths/files 처리 (향후 확장용)
      if (tutorResponse.filePaths || tutorResponse.files) {
        const filePaths = tutorResponse.filePaths || tutorResponse.files;

        // 파일 경로들을 상태에 저장
        setServerFilePaths((prev) => ({
          ...prev,
          ...filePaths,
        }));

        filePathsToSave = { ...filePathsToSave, ...filePaths };
      }

      // 3. 생성된 튜터의 ID를 가져옴 (여러 가능한 필드명 확인)
      const tutorId =
        tutorResponse.id ||
        tutorResponse.tutor_id ||
        tutorResponse.user_id ||
        tutorResponse.tutorId ||
        tutorResponse.userId;

      if (!tutorId) {
        console.error("튜터 응답에서 ID를 찾을 수 없음:", tutorResponse);
        throw new Error(
          "튜터 ID를 찾을 수 없습니다. 응답 데이터를 확인해주세요."
        );
      }

      console.log("생성된 튜터 ID:", tutorId);

      // 3. 카테고리 추가 API 호출
      if (selectedFields && selectedFields.length > 0) {
        try {
          const categoryResponse = await addTutorCategories(
            tutorId,
            selectedFields
          );
        } catch (categoryError) {
          console.error("분야 추가 실패:", categoryError);

          // 분야 추가 실패 시 사용자에게 알림
          const errorMessage =
            categoryError.response?.data?.message ||
            categoryError.message ||
            "분야 추가 중 오류가 발생했습니다.";

          alert(
            `프로필은 등록되었지만 분야 추가에 실패했습니다.\n오류: ${errorMessage}\n나중에 다시 시도해주세요.`
          );
        }
      } else {
        console.log("선택된 분야가 없어 분야 추가를 건너뜁니다.");
      }

      // 4. 지역 추가 API 호출
      if (selectedRegions && selectedRegions.length > 0) {
        try {
          const regionResponse = await addTutorRegions(
            tutorId,
            selectedRegions
          );
        } catch (regionError) {
          console.error("지역 추가 실패:", regionError);

          // 지역 추가 실패 시 사용자에게 알림
          const errorMessage =
            regionError.response?.data?.message ||
            regionError.message ||
            "지역 추가 중 오류가 발생했습니다.";

          alert(
            `프로필은 등록되었지만 지역 추가에 실패했습니다.\n오류: ${errorMessage}\n나중에 다시 시도해주세요.`
          );
        }
      } else {
        console.log("선택된 지역이 없어 지역 추가를 건너뜁니다.");
      }

      alert("쌤 프로필이 성공적으로 등록되었습니다!");
      navigate("/teacher-profile");
    } catch (error) {
      console.error("프로필 등록 실패:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "프로필 등록 중 문제가 발생했습니다.";

      alert(`프로필 등록 실패: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
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
      </div>

      {/* 분야 선택 섹션 */}
      <div className="field-selection-section">
        {/* 선택된 분야 표시 */}
        {selectedFields.length > 0 && (
          <div className="selected-fields-display">
            <h4>선택된 분야 ({selectedFields.length}/4)</h4>
            <div className="selected-fields-list">
              {selectedFields.map((fieldId) => {
                // 모든 카테고리에서 해당 ID의 분야 찾기
                const allFields = [
                  ...fieldCategories.care,
                  ...fieldCategories.play,
                  ...fieldCategories.study,
                ];
                const field = allFields.find((f) => f.id === fieldId);
                return field ? (
                  <span key={fieldId} className="selected-field-tag">
                    {field.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

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
              tabIndex={-1}
              disabled
            />
            <span>년생</span>
          </div>

          <div className="gender-selection">
            <label>성별</label>
            <div className="gender-buttons" tabIndex={-1}>
              <button
                className={`gender-button ${
                  gender === "female" ? "selected" : ""
                }`}
                disabled
              >
                여성
              </button>
              <button
                className={`gender-button ${
                  gender === "male" ? "selected" : ""
                }`}
                disabled
              >
                남성
              </button>
            </div>
          </div>
        </div>

        {/* 근무 가능 위치 */}
        <div className="region-selection-container">
          <label>근무 가능 위치</label>
          <div className="region-hint">최대 4곳까지 동 단위로 선택하세요</div>
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
            <div className="photo-preview">
              {console.log("현재 photoFile.photo_path:", photoFile.photo_path)}
              {photoFile.photo_path ? (
                <img
                  src={photoFile.photo_path}
                  alt="프로필 사진"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginLeft: "20px",
                  }}
                  onError={(e) => {
                    console.error("이미지 로드 실패:", photoFile.photo_path);
                    // 이미지 로드 실패 시 대체 텍스트 표시
                    e.target.style.display = "none";
                    const parent = e.target.parentElement;
                    if (parent) {
                      const fallbackDiv = document.createElement("div");
                      fallbackDiv.style.cssText = `
                        width: 90px;
                        height: 90px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #f5f5f5;
                        border-radius: 8px;
                        margin-left: 20px;
                        color: #666;
                        font-size: 14px;
                        font-weight: 600;
                      `;
                      fallbackDiv.textContent = "사진";
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                  onLoad={() => {
                    console.log("이미지 로드 성공:", photoFile.photo_path);
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    marginLeft: "20px",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  사진
                </div>
              )}
            </div>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={(e) => handleFileUpload("photo", e)}
              style={{ display: "none" }}
            />
            <label
              htmlFor="photo-upload"
              className="upload-button-small"
              style={{ marginLeft: "20px" }}
            >
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
        <button
          className="save-button"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </div>

      {/* 파일 업로드 */}
      <div id="file-upload-section" className="file-upload-section">
        <h3>필요한 서류를 업로드해주세요</h3>
        <p className="upload-hint">
          프로필 사진과 함께 필요한 서류들을 업로드해주세요.
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
                {uploadedFiles[key]?.name || "파일 올리기"}
              </label>
            </div>
          ))}
        </div>

        <div className="file-upload-action">
          <button
            className="upload-button"
            onClick={handleFileUploadAction}
            disabled={
              Object.keys(uploadedFiles).filter((key) => uploadedFiles[key])
                .length === 0
            }
          >
            파일 업로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
