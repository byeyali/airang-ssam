import React from "react";
import { useUser } from "../../contexts/UserContext";
import ParentMatchings from "./ParentMatchings";
import TeacherMatchings from "./TeacherMatchings";
import AdminMatchings from "./AdminMatchings";

function Matchings() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="matchings-page">
        <div className="login-required">
          <h2>로그인이 필요합니다</h2>
          <p>매칭 관리를 위해 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  // 사용자 타입에 따라 적절한 컴포넌트 렌더링
  if (user.member_type === "parents") {
    return <ParentMatchings />;
  } else if (user.member_type === "tutor") {
    return <TeacherMatchings />;
  } else if (user.member_type === "admin") {
    return <AdminMatchings />;
  }

  return (
    <div className="matchings-page">
      <div className="login-required">
        <h2>접근 권한이 없습니다</h2>
        <p>부모, 쌤 또는 관리자 회원으로 로그인해주세요.</p>
      </div>
    </div>
  );
}

export default Matchings;
