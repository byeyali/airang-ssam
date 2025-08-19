import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import { createPortal } from "react-dom";

import { useTeacherSearch } from "../../contexts/TeacherSearchContext";
import { useUser } from "../../contexts/UserContext";
import { useApplication } from "../../contexts/ApplicationContext";
import { getMatchingTeachersByScore } from "../../config/api";
import "./TeacherSearchModal.css";

const TeacherSearchModal = memo(({ isOpen, onClose, onTeacherSelect }) => {
  const { searchResults, searchQuery, clearSearchData } = useTeacherSearch();
  const { user } = useUser();
  const { getAllApplications } = useApplication();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const initializationRef = useRef(false);
  const modalRef = useRef(null);

  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const transformTeacherData = useCallback((teacher) => {
    return {
      id: teacher.id,
      name: teacher.name,
      rating: teacher.rating || 4.0, // 기본값 설정
      regions: teacher.regions
        ? teacher.regions.split(", ")
        : ["지역 정보 없음"],
      skills: teacher.categories
        ? teacher.categories.split(", ")
        : ["분야 정보 없음"],
      birth_year: teacher.birth_year,
      gender: teacher.gender,
      categories: teacher.categories,
    };
  }, []);

  // 메모이제이션된 검색 결과 (성별 매칭 적용)
  const memoizedSearchResults = useMemo(() => {
    // 백엔드 데이터 변환
    const transformedResults = searchResults.map(transformTeacherData);

    if (!user || user.type !== "parents" || !transformedResults.length) {
      return transformedResults;
    }

    // 부모의 공고 정보 가져오기
    const applications = getAllApplications();
    const parentApplications = applications.filter(
      (app) => app.parentId === user.id
    );

    if (parentApplications.length === 0) {
      return searchResults;
    }

    // 가장 최근 공고를 기준으로 성별 매칭 점수 계산
    const latestApplication = parentApplications[0];
    const teachersWithScores = getMatchingTeachersByScore(
      latestApplication,
      searchResults
    );

    return teachersWithScores;
  }, [searchResults, user, getAllApplications]);

  // 쌤 이미지 매핑 함수
  const getTeacherImage = (teacher) => {
    // 백엔드에서 받은 photo_path가 있으면 사용
    if (teacher.photo_path) {
      return teacher.photo_path;
    }

    // photo_path가 없으면 기본 이미지 사용
    return "/img/teacher-30-woman.png";
  };

  // 초기화 체크 (한 번만 실행)
  useEffect(() => {
    if (isOpen && !initializationRef.current) {
      initializationRef.current = true;
      setHasInitialized(true);

      // 검색 결과가 없으면 모달 닫기
      if (memoizedSearchResults.length === 0 && !searchQuery) {
        onClose();
        return;
      }

      // 로딩 완료 (더 긴 지연으로 안정성 확보)
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, memoizedSearchResults.length, searchQuery, onClose]);

  // 모달이 닫힐 때 초기화 리셋
  useEffect(() => {
    if (!isOpen) {
      initializationRef.current = false;
      setHasInitialized(false);
      setIsLoading(true);
    }
  }, [isOpen]);

  const handleTeacherSelect = useCallback(
    (teacher) => {
      // 콜백 실행 (App.js에서 모달 닫기 처리)
      if (onTeacherSelect) {
        onTeacherSelect(teacher);
      }
    },
    [onTeacherSelect]
  );

  const handleCloseModal = useCallback(() => {
    clearSearchData();
    onClose();
  }, [clearSearchData, onClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleCloseModal]);

  // 모달 외부 클릭 방지
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="teacher-search-modal-overlay" onClick={handleCloseModal}>
      <div
        ref={modalRef}
        className="teacher-search-modal"
        onClick={handleModalClick}
      >
        <div className="modal-header">
          <button className="close-button" onClick={handleCloseModal}>
            ×
          </button>
          <h1 className="search-title">"{searchQuery}" 쌤 검색 결과</h1>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>검색 결과를 불러오는 중...</p>
          </div>
        ) : (
          <div className="search-results">
            {memoizedSearchResults.length > 0 ? (
              <div className="results-count">
                총 {memoizedSearchResults.length}명의 쌤을 찾았습니다.
              </div>
            ) : (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}

            <div className="teachers-list">
              {memoizedSearchResults.map((teacher) => (
                <div key={teacher.id} className="teacher-list-item">
                  <div className="teacher-list-content">
                    <div className="teacher-basic-info">
                      <div className="teacher-name">{teacher.name}</div>
                      <div className="teacher-details">
                        <span className="birth-year">
                          {teacher.birth_year}년생
                        </span>
                        <span className="gender">{teacher.gender}</span>
                      </div>
                    </div>
                    <div className="teacher-info-section">
                      <div className="teacher-categories">
                        {teacher.categories ? (
                          teacher.categories
                            .split(", ")
                            .map((category, index) => (
                              <span key={index} className="category-tag">
                                {category}
                              </span>
                            ))
                        ) : (
                          <span className="no-categories">분야 정보 없음</span>
                        )}
                      </div>
                      <div className="teacher-regions">
                        {teacher.regions && teacher.regions.length > 0 ? (
                          teacher.regions.map((region, index) => (
                            <span key={index} className="region-tag">
                              {region}
                            </span>
                          ))
                        ) : (
                          <span className="no-regions">지역 정보 없음</span>
                        )}
                      </div>
                    </div>
                    <div className="teacher-actions">
                      <button
                        className="teacher-select-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeacherSelect(teacher);
                        }}
                      >
                        선택
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
});

TeacherSearchModal.displayName = "TeacherSearchModal";

export default TeacherSearchModal;
