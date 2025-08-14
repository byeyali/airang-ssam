import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Navigation.css";

function Navigation() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  console.log(user);

  const handleImageError = (imageName) => {
    console.log(`이미지 로딩 실패: ${imageName}`);
    setImageLoadErrors((prev) => ({
      ...prev,
      [imageName]: true,
    }));
  };

  const handleParentFeatureClick = (e, featureName) => {
    if (!user) {
      e.preventDefault();
      alert(
        `로그인이 필요합니다. ${featureName} 기능을 이용하려면 로그인해주세요.`
      );
      navigate("/login");
      return;
    }
    if (
      user &&
      user.member_type !== "parents" &&
      user.member_type !== "admin"
    ) {
      e.preventDefault();
      alert(`${featureName} 기능은 부모님 회원만 이용할 수 있습니다.`);
      return;
    }
  };

  const handleTeacherFeatureClick = (e, featureName) => {
    if (!user) {
      e.preventDefault();
      alert(
        `로그인이 필요합니다. ${featureName} 기능을 이용하려면 로그인해주세요.`
      );
      navigate("/login");
      return;
    }
    if (user && user.member_type !== "tutor" && user.member_type !== "admin") {
      e.preventDefault();
      alert(`${featureName} 기능은 쌤 회원만 이용할 수 있습니다.`);
      return;
    }
  };

  const handleMatchingClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("로그인이 필요합니다. 매칭 관리 기능을 이용하려면 로그인해주세요.");
      navigate("/login");
      return;
    }
  };

  const handleMyPageClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("로그인이 필요합니다. 마이 페이지를 이용하려면 로그인해주세요.");
      navigate("/login");
      return;
    }

    // 사용자 타입에 따라 다른 마이페이지로 이동
    e.preventDefault();
    if (user.member_type === "parents") {
      navigate("/parent/my-page");
    } else if (user.member_type === "teacher" || user.member_type === "tutor") {
      navigate("/teacher/my-page");
    } else if (user.member_type === "admin") {
      navigate("/admin-dashboard");
    } else {
      alert("알 수 없는 사용자 타입입니다.");
    }
  };

  return (
    <nav className="main-navigation">
      {/* 관리자 로그인 시 네비게이션 순서 */}
      {user && user.member_type === "admin" ? (
        <>
          {/* 1. 도와줘요 쌤 */}
          <Link
            to="/Helpme"
            className="nav-item"
            onClick={handleParentFeatureClick}
          >
            <img
              src="/img/icon_help.png"
              alt="도와줘요 쌤"
              className="nav-icon"
              onError={() => handleImageError("icon_help")}
            />
            <span className="nav-text">도와줘요 쌤</span>
          </Link>

          {/* 2. 쌤이 되어 볼래요? */}
          <Link
            to="/teacher-profile"
            className="nav-item"
            onClick={handleTeacherFeatureClick}
          >
            <img
              src="/img/icon_teacher.png"
              alt="쌤이 되어 볼래요?"
              className="nav-icon"
              onError={() => handleImageError("icon_teacher")}
            />
            <span className="nav-text">쌤이 되어 볼래요?</span>
          </Link>

          {/* 3. 우리 아이 쌤 찾기 */}
          <Link to="/teacher-applications" className="nav-item">
            <img
              src="/img/icon_find.png"
              alt="우리 아이 쌤 찾기"
              className="nav-icon"
            />
            <span className="nav-text">우리 아이 쌤 찾기</span>
          </Link>

          {/* 4. 공고 찾기 */}
          <Link to="/applications" className="nav-item">
            <img
              src="/img/findteacher.png"
              alt="공고 찾기"
              className="nav-icon"
            />
            <span className="nav-text">공고 찾기</span>
          </Link>

          {/* 5. 매칭 관리 */}
          <Link
            to="/matchings"
            className="nav-item"
            onClick={handleMatchingClick}
          >
            <img
              src="/img/matching-teacher.png"
              alt="매칭 관리"
              className="nav-icon"
            />
            <span className="nav-text">매칭 관리</span>
          </Link>

          {/* 6. 계약 현황 */}
          <Link
            to="/contract-management"
            className="nav-item"
            onClick={handleMyPageClick}
          >
            <img
              src="/img/img-nav-contract.png"
              alt="계약 현황"
              className="nav-icon"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="nav-text">계약 현황</span>
          </Link>

          {/* 7. 마이 페이지 */}
          <Link to="#" className="nav-item" onClick={handleMyPageClick}>
            <img
              src="/img/nav-mypage-teacher.png"
              alt="마이 페이지"
              className="nav-icon"
            />
            <span className="nav-text">마이 페이지</span>
          </Link>
        </>
      ) : (
        /* 일반 사용자 네비게이션 */
        <>
          {/* 도와줘요 쌤 - 부모와 관리자만 표시 */}
          {(!user || user.member_type === "parents") && (
            <Link to="/Helpme" className="nav-item">
              <img
                src="/img/icon_help.png"
                alt="도와줘요 쌤"
                className="nav-icon"
                onError={() => handleImageError("icon_help")}
              />
              <span className="nav-text">도와줘요 쌤</span>
            </Link>
          )}

          {/* 쌤이 되어 볼래요? - 부모가 아닐 때만 표시 */}
          {(!user || user.member_type !== "parents") && (
            <Link to="/teacher-profile" className="nav-item">
              <img
                src="/img/icon_teacher.png"
                alt="쌤이 되어 볼래요?"
                className="nav-icon"
                onError={() => handleImageError("icon_teacher")}
              />
              <span className="nav-text">쌤이 되어 볼래요?</span>
            </Link>
          )}

          {/* 부모 기능 메뉴 - 부모만 표시 */}
          {(!user || user.member_type === "parents") && (
            <Link
              to="/teacher-applications"
              className="nav-item"
              onClick={(e) => handleParentFeatureClick(e, "우리 아이 쌤 찾기")}
            >
              <img
                src="/img/icon_find.png"
                alt="우리 아이 쌤 찾기"
                className="nav-icon"
              />
              <span className="nav-text">우리 아이 쌤 찾기</span>
            </Link>
          )}

          {/* 쌤 기능 메뉴 - 쌤과 튜터만 표시 (부모 제외) */}
          {(!user ||
            user.member_type === "teacher" ||
            user.member_type === "tutor") && (
            <Link
              to="/applications"
              className="nav-item"
              onClick={(e) => handleTeacherFeatureClick(e, "공고 찾기")}
            >
              <img
                src="/img/findteacher.png"
                alt="공고 찾기"
                className="nav-icon"
              />
              <span className="nav-text">공고 찾기</span>
            </Link>
          )}

          {/* 매칭 관리 - 모든 사용자 표시 */}
          <Link
            to="/matchings"
            className="nav-item"
            onClick={handleMatchingClick}
          >
            <img
              src="/img/matching-teacher.png"
              alt="매칭 관리"
              className="nav-icon"
            />
            <span className="nav-text">매칭 관리</span>
          </Link>

          {/* 계약 현황 - 모든 사용자 표시 */}
          <Link
            to="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              if (user.member_type === "admin") {
                navigate("/contract-management");
              } else if (user.member_type === "parents") {
                navigate("/parent/contract-management");
              } else if (
                user.member_type === "teacher" ||
                user.member_type === "tutor"
              ) {
                navigate("/teacher/contract-management");
              }
            }}
          >
            <img
              src="/img/img-nav-contract.png"
              alt="계약 현황"
              className="nav-icon"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="nav-text">계약 현황</span>
          </Link>

          {/* 마이 페이지 - 모든 사용자 표시 */}
          <Link to="#" className="nav-item" onClick={handleMyPageClick}>
            <img
              src="/img/nav-mypage-teacher.png"
              alt="마이 페이지"
              className="nav-icon"
            />
            <span className="nav-text">마이 페이지</span>
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navigation;
