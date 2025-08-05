import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TeacherService.css";

function TeacherService() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    // 페이지 이동 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="teacher-service-page">
      <div className="service-container">
        {/* 헤더 섹션 */}
        <div className="service-header">
          <h1>쌤 서비스</h1>
          <p className="service-subtitle">
            아이들과 함께하는 의미 있는 일을 시작해보세요
          </p>
        </div>

        {/* 메인 서비스 소개 */}
        <div className="service-intro">
          <div className="intro-content">
            <h2>아이랑 쌤이랑이 쌤께 드리는 서비스</h2>
            <p>
              아이랑 쌤이랑은 아이들의 성장을 돕고 싶은 분들에게 안전하고 신뢰할
              수 있는 플랫폼을 제공합니다. 검증된 시스템을 통해 부모님과
              연결되어 안정적인 수입과 보람찬 경험을 만들어가세요.
            </p>
          </div>
        </div>

        {/* 서비스 특징 */}
        <div className="service-features">
          <h3>서비스 특징</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h4>안정적 수입</h4>
              <p>
                투명한 가격 정책과 정기적인 급여 지급으로 안정적인 수입 보장
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>안전 보장</h4>
              <p>
                검증된 부모님과의 매칭으로 안전하고 신뢰할 수 있는 환경 제공
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h4>편리한 관리</h4>
              <p>앱을 통해 일정 관리, 소통, 수입 확인을 한 번에 처리</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>맞춤 매칭</h4>
              <p>본인의 경험과 특기를 살릴 수 있는 맞춤형 매칭 서비스</p>
            </div>
          </div>
        </div>

        {/* 지원 과정 */}
        <div className="service-process">
          <h3>지원 과정</h3>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>프로필 등록</h4>
                <p>본인의 경험, 자격증, 활동 가능 지역을 상세히 등록해주세요</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>서류 검증</h4>
                <p>
                  신원조회, 건강검진, 자격증 등 필요한 서류를 업로드해주세요
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>매칭 시작</h4>
                <p>검증 완료 후 부모님의 공고에 지원하고 매칭을 시작하세요</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>서비스 제공</h4>
                <p>매칭된 부모님과 상담 후 아이들과 함께하는 시간을 보내세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 활동 분야 */}
        <div className="service-types">
          <h3>활동 분야</h3>
          <div className="types-grid">
            <div className="type-card">
              <div className="type-icon">🏠</div>
              <h4>방과 후 돌봄</h4>
              <p>학교에서 집까지 안전하게 마중하고, 숙제를 도와드립니다</p>
            </div>
            <div className="type-card">
              <div className="type-icon">🍽️</div>
              <h4>식사 챙김</h4>
              <p>영양 균형을 맞춘 건강한 식사를 준비해드립니다</p>
            </div>
            <div className="type-card">
              <div className="type-icon">📚</div>
              <h4>학습 지도</h4>
              <p>수학, 영어, 국어 등 교과 학습을 체계적으로 지도합니다</p>
            </div>
            <div className="type-card">
              <div className="type-icon">🎨</div>
              <h4>특기 활동</h4>
              <p>음악, 미술, 스포츠 등 아이의 재능을 키워드립니다</p>
            </div>
          </div>
        </div>

        {/* 지원 혜택 */}
        <div className="benefits-section">
          <h3>지원 혜택</h3>
          <div className="benefits-content">
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <div className="benefit-text">
                <h4>합리적인 급여</h4>
                <p>
                  경험과 자격에 따른 투명한 급여 체계로 안정적인 수입을
                  보장합니다
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📈</div>
              <div className="benefit-text">
                <h4>경력 개발</h4>
                <p>
                  다양한 경험을 통해 전문성을 키우고 경력을 발전시킬 수 있습니다
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🤝</div>
              <div className="benefit-text">
                <h4>커뮤니티</h4>
                <p>
                  다른 쌤들과의 소통을 통해 정보를 공유하고 네트워크를
                  형성합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="service-cta">
          <h3>지금 시작해보세요</h3>
          <p>아이들과 함께하는 의미 있는 일을 시작하세요</p>
          <div className="cta-buttons">
            <button
              onClick={() => handleNavigate("/teacher-profile")}
              className="cta-button primary"
            >
              프로필 등록하기
            </button>
            <button
              onClick={() => handleNavigate("/teacher-applications")}
              className="cta-button secondary"
            >
              공고 찾아보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherService;
