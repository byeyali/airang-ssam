import React from "react";
import { Link } from "react-router-dom";
import "./ParentService.css";

function ParentService() {
  return (
    <div className="parent-service-page">
      <div className="service-container">
        {/* 헤더 섹션 */}
        <div className="service-header">
          <h1>부모님 서비스</h1>
          <p className="service-subtitle">
            우리 아이를 위한 맞춤형 쌤을 찾아보세요
          </p>
        </div>

        {/* 메인 서비스 소개 */}
        <div className="service-intro">
          <div className="intro-content">
            <h2>아이랑 쌤이랑이 부모님께 드리는 서비스</h2>
            <p>
              아이랑 쌤이랑은 우리 아이의 성장과 안전을 최우선으로 생각하는
              부모님들을 위해 신뢰할 수 있는 쌤을 연결해드리는 서비스입니다.
            </p>
          </div>
        </div>

        {/* 서비스 특징 */}
        <div className="service-features">
          <h3>서비스 특징</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4>신중한 검증</h4>
              <p>신원조회, 건강검진, 자격증 확인을 통해 검증된 쌤만 선별</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>맞춤 매칭</h4>
              <p>아이의 나이, 성격, 필요에 맞는 쌤을 정확히 매칭</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>합리적 가격</h4>
              <p>투명한 가격 정책으로 부담 없는 비용으로 서비스 이용</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h4>편리한 관리</h4>
              <p>앱을 통해 언제든지 쌤과 소통하고 일정 관리</p>
            </div>
          </div>
        </div>

        {/* 이용 방법 */}
        <div className="service-process">
          <h3>이용 방법</h3>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>공고 등록</h4>
                <p>아이의 나이, 성격, 필요한 서비스를 상세히 작성해주세요</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>쌤 매칭</h4>
                <p>조건에 맞는 쌤들이 지원하고, 가장 적합한 쌤을 선택하세요</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>서비스 시작</h4>
                <p>선택한 쌤과 상담 후 서비스를 시작하세요</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>후기 작성</h4>
                <p>
                  서비스 완료 후 후기를 남겨 다른 부모님들에게 도움을 주세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 종류 */}
        <div className="service-types">
          <h3>제공 서비스</h3>
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

        {/* 안전 보장 */}
        <div className="safety-guarantee">
          <h3>안전 보장</h3>
          <div className="safety-content">
            <div className="safety-item">
              <div className="safety-icon">🛡️</div>
              <div className="safety-text">
                <h4>신원 조회</h4>
                <p>모든 쌤은 신원조회를 통과한 검증된 인력입니다</p>
              </div>
            </div>
            <div className="safety-item">
              <div className="safety-icon">🏥</div>
              <div className="safety-text">
                <h4>건강 검진</h4>
                <p>정기적인 건강검진을 통해 안전한 서비스를 보장합니다</p>
              </div>
            </div>
            <div className="safety-item">
              <div className="safety-icon">📋</div>
              <div className="safety-text">
                <h4>자격증 확인</h4>
                <p>보육교사, 사회복지사 등 관련 자격증을 보유한 쌤들입니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="service-cta">
          <h3>지금 시작해보세요</h3>
          <p>우리 아이에게 최고의 쌤을 연결해드립니다</p>
          <div className="cta-buttons">
            <Link to="/Helpme" className="cta-button primary">
              공고 등록하기
            </Link>
            <Link to="/teacher-applications" className="cta-button secondary">
              쌤 찾아보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentService;
