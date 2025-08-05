import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTeacherSearch } from "../../contexts/TeacherSearchContext";
import "./TeacherSearchModal.css";

const TeacherSearchModal = memo(({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { searchResults, searchQuery, clearSearchData } = useTeacherSearch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const initializationRef = useRef(false);
  const modalRef = useRef(null);

  // 메모이제이션된 검색 결과
  const memoizedSearchResults = useMemo(() => searchResults, [searchResults]);

  // 쌤 이미지 매핑 함수
  const getTeacherImage = (teacherId) => {
    const imageMap = {
      teacher_001: "/img/teacher-kimyouhghee-womam.png", // 김영희
      teacher_002: "/img/teacher-30-man.png", // 박민수
      teacher_003: "/img/teacher-kimjiyoung.jpg", // 김지영
      teacher_004: "/img/teacher-math-english.jpg", // 최지영
      teacher_005: "/img/teacher-studing-with-2children.jpeg", // 한미영
      teacher_006: "/img/teacher-30-man.png", // 정성훈
      teacher_007: "/img/teacher-30-man.png", // 김태현
      teacher_008: "/img/teacher-30-man.png", // 박성훈
      teacher_010: "/img/teacher-40-woman.png", // 박O영 (45세)
    };
    return imageMap[teacherId] || "/img/teacher-30-woman.png";
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

  const handleTeacherClick = useCallback(
    (teacherId) => {
      // 모달을 닫지 않고 바로 네비게이션
      navigate(`/teacher-detail/${teacherId}`);
    },
    [navigate]
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

            <div className="teachers-grid">
              {memoizedSearchResults.map((teacher) => (
                <div
                  key={teacher.id}
                  className="teacher-card"
                  onClick={() => handleTeacherClick(teacher.id)}
                >
                  <div className="teacher-avatar">
                    <img
                      src={getTeacherImage(teacher.id)}
                      alt={teacher.name}
                      onError={(e) => {
                        e.target.src = "/img/teacher-30-woman.png";
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="teacher-info">
                    <h3 className="teacher-name">{teacher.name}</h3>
                    <div className="teacher-rating">⭐ {teacher.rating}</div>
                    <div className="teacher-regions">
                      📍 {teacher.regions.join(", ")}
                    </div>
                    <div className="teacher-skills">
                      {teacher.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
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
