import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Footer.css";

function Footer() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleReviewClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("로그인이 필요합니다. 로그인 후 후기를 작성해주세요.");
      navigate("/login");
      return;
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>부모님을 위한 서비스</h3>
          <ul>
            <li>
              <Link to="/Helpme">공고 작성하기</Link>
            </li>
            <li>
              <Link to="/teacher-applications">쌤 찾아보기</Link>
            </li>
            <li>
              <Link to="/applications">내 공고 관리</Link>
            </li>
            <li>
              <Link to="/matchings">매칭 현황</Link>
            </li>
            <li>
              <Link to="/reviews" onClick={handleReviewClick}>
                후기 작성하기
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>쌤을 위한 서비스</h3>
          <ul>
            <li>
              <Link to="/teacher-profile">쌤 등록하기</Link>
            </li>
            <li>
              <Link to="/teacher-applications">공고 찾아보기</Link>
            </li>
            <li>
              <Link to="/matchings">매칭 현황</Link>
            </li>
            <li>
              <Link to="/reviews" onClick={handleReviewClick}>
                후기 확인하기
              </Link>
            </li>
            <li>
              <Link to="/feedback">문의하기</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>고객지원</h3>
          <ul>
            <li>
              <Link to="/feedback">문의하기</Link>
            </li>
            <li>
              <a href="tel:1588-0088">1588-0088</a>
            </li>
            <li>
              <a href="mailto:support@airangsam.com">support@airangsam.com</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>회사정보</h3>
          <ul>
            <li>
              <Link to="/about">회사 소개</Link>
            </li>
            <li>
              <Link to="/terms">이용약관</Link>
            </li>
            <li>
              <Link to="/privacy">개인정보처리방침</Link>
            </li>
            <li>
              <Link to="/careers">채용정보</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-info">
          <p>&copy; 2024 아이랑 쌤이랑. All rights reserved.</p>
          <p>사업자등록번호: 123-45-67890 | 대표: 김아이랑</p>
          <p>주소: 서울특별시 강남구 테헤란로 123</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
