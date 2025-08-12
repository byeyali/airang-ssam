import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./TeacherMyPage.css";

function TeacherMyPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [matchings, setMatchings] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // 프로필 데이터
  const [profileData, setProfileData] = useState({
    name: "김영희",
    age: 30,
    gender: "여성",
    education: "서울대학교 교육학과 졸업",
    experience: "7년",
    subjects: ["피아노", "미술", "영어", "수학"],
    introduction:
      "안녕하세요! 아이들과 함께 성장하는 것을 좋아하는 김영희입니다. 피아노와 미술을 전문으로 가르치고 있으며, 아이들의 창의성과 예술성을 키워주는 재미있고 효과적인 수업을 진행합니다.",
    hourlyWage: 30000,
    availableDays: ["월", "화", "수", "목", "금"],
    availableTime: "오후 2시 ~ 오후 8시",
    location: "서울특별시 관악구",
    phone: "010-9876-5432",
    email: "b@abc.com",
  });

  // 임시 데이터
  const mockMatchings = [
    {
      id: "matching_001",
      parentName: "김가정",
      childName: "김가정님 댁",
      childGender: "boy",
      subject: "수학",
      hourlyWage: 25000,
      status: "pending",
      createdAt: "2024-01-15T10:30:00",
      message:
        "수학 과목을 가르쳐주세요. 아이가 수학을 어려워해서 기초부터 차근차근 가르쳐주시면 좋겠습니다.",
    },
    {
      id: "matching_002",
      parentName: "박영희",
      childName: "박소영",
      childGender: "girl",
      subject: "영어",
      hourlyWage: 30000,
      status: "accepted",
      createdAt: "2024-01-14T14:20:00",
      message: "영어 회화를 중점적으로 가르쳐주세요.",
    },
  ];

  const mockContracts = [
    {
      id: "contract_001",
      parentName: "김가정",
      childName: "김민수",
      subject: "수학",
      hourlyWage: 25000,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      contractDuration: 3,
      status: "pending",
      createdAt: "2024-01-15T10:30:00",
      message:
        "수학 과목을 가르쳐주세요. 아이가 수학을 어려워해서 기초부터 차근차근 가르쳐주시면 좋겠습니다.",
    },
    {
      id: "contract_002",
      parentName: "박영희",
      childName: "박소영",
      subject: "영어",
      hourlyWage: 30000,
      sessionsPerWeek: 3,
      hoursPerSession: 1.5,
      contractDuration: 6,
      status: "accepted",
      createdAt: "2024-01-14T14:20:00",
      message: "영어 회화를 중점적으로 가르쳐주세요.",
    },
  ];

  const mockEarnings = [
    {
      id: "earning_001",
      parentName: "박영희",
      childName: "박소영",
      subject: "영어",
      date: "2024-01-15",
      hours: 3,
      hourlyWage: 30000,
      totalAmount: 90000,
      status: "paid",
    },
    {
      id: "earning_002",
      parentName: "이미영",
      childName: "이준호",
      subject: "수학",
      date: "2024-01-14",
      hours: 2,
      hourlyWage: 25000,
      totalAmount: 50000,
      status: "pending",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMatchings(mockMatchings);
    setContracts(mockContracts);
    setEarnings(mockEarnings);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      case "paid":
        return "지급완료";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "accepted":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      case "paid":
        return "#2196f3";
      default:
        return "#757575";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const handleAcceptMatching = (matchingId) => {
    setMatchings((prev) =>
      prev.map((matching) =>
        matching.id === matchingId
          ? { ...matching, status: "accepted" }
          : matching
      )
    );
  };

  const handleRejectMatching = (matchingId) => {
    setMatchings((prev) =>
      prev.map((matching) =>
        matching.id === matchingId
          ? { ...matching, status: "rejected" }
          : matching
      )
    );
  };

  const handleAcceptContract = (contractId) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "accepted" }
          : contract
      )
    );
  };

  const handleRejectContract = (contractId) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "rejected" }
          : contract
      )
    );
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // 여기에 프로필 저장 로직 추가
    alert("프로필이 성공적으로 수정되었습니다.");
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!user || (user.type !== "teacher" && user.type !== "tutor")) {
    return (
      <div className="teacher-my-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>선생님 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-my-page">
      <div className="teacher-my-page-container">
        <div className="page-header">
          <h1>마이 페이지</h1>
          <p>{user.name} 선생님의 활동 내역을 확인하세요</p>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            내 프로필 확인
          </button>
          <button
            className={`tab-button ${activeTab === "earnings" ? "active" : ""}`}
            onClick={() => setActiveTab("earnings")}
          >
            수당 내역
          </button>
        </div>

        <div className="content-area">
          {/* 프로필 탭 */}
          {activeTab === "profile" && (
            <div className="profile-section">
              <div className="profile-header">
                <h2>내 프로필</h2>
                {!isEditingProfile && (
                  <button
                    className="edit-profile-btn"
                    onClick={handleEditProfile}
                  >
                    프로필 수정
                  </button>
                )}
              </div>

              <div className="profile-content">
                <div className="profile-card">
                  <div className="profile-basic-info">
                    <div className="profile-avatar">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/img/teacher-woman-31-glasses.png"
                        }
                        alt="프로필 이미지"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="profile-avatar-fallback"
                        style={{ display: "none" }}
                      >
                        <span>{profileData.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="profile-info">
                      <h3>{profileData.name} 선생님</h3>
                      <p className="profile-subtitle">
                        {profileData.age}세 {profileData.gender}
                      </p>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="detail-group">
                      <h4>기본 정보</h4>
                      <div className="detail-item">
                        <span className="label">학력:</span>
                        <span className="value">{profileData.education}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">경력:</span>
                        <span className="value">{profileData.experience}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">전문 과목:</span>
                        <span className="value">
                          {profileData.subjects.join(", ")}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">희망 시급:</span>
                        <span className="value">
                          {formatCurrency(profileData.hourlyWage)}원
                        </span>
                      </div>
                    </div>

                    <div className="detail-group">
                      <h4>수업 가능 정보</h4>
                      <div className="detail-item">
                        <span className="label">가능 요일:</span>
                        <span className="value">
                          {profileData.availableDays.join(", ")}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">가능 시간:</span>
                        <span className="value">
                          {profileData.availableTime}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">수업 지역:</span>
                        <span className="value">{profileData.location}</span>
                      </div>
                    </div>

                    <div className="detail-group">
                      <h4>연락처</h4>
                      <div className="detail-item">
                        <span className="label">전화번호:</span>
                        <span className="value">{profileData.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">이메일:</span>
                        <span className="value">{profileData.email}</span>
                      </div>
                    </div>

                    <div className="detail-group">
                      <h4>자기소개</h4>
                      <div className="introduction-text">
                        <p>{profileData.introduction}</p>
                      </div>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="profile-actions">
                      <button className="save-btn" onClick={handleSaveProfile}>
                        저장
                      </button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>
                        취소
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 수당 내역 탭 */}
          {activeTab === "earnings" && (
            <div className="earnings-section">
              <h2>수당 내역</h2>
              {earnings.length === 0 ? (
                <div className="no-data">
                  <p>수당 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="items-list">
                  {earnings.map((earning) => (
                    <div key={earning.id} className="item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h3>
                            {earning.parentName}님 - {earning.childName}
                          </h3>
                          <p className="subject-info">{earning.subject}</p>
                        </div>
                        <div className="item-status">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(earning.status),
                            }}
                          >
                            {getStatusText(earning.status)}
                          </span>
                        </div>
                      </div>

                      <div className="item-details">
                        <div className="detail-row">
                          <span className="label">수업일:</span>
                          <span className="value">
                            {formatDate(earning.date)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">수업 시간:</span>
                          <span className="value">{earning.hours}시간</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">시급:</span>
                          <span className="value">
                            {formatCurrency(earning.hourlyWage)}원
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">총 수당:</span>
                          <span className="value total-amount">
                            {formatCurrency(earning.totalAmount)}원
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="earnings-summary">
                <h3>수당 요약</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">이번 달 총 수당:</span>
                    <span className="value">
                      {formatCurrency(
                        earnings.reduce((sum, e) => sum + e.totalAmount, 0)
                      )}
                      원
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">지급 완료:</span>
                    <span className="value">
                      {formatCurrency(
                        earnings
                          .filter((e) => e.status === "paid")
                          .reduce((sum, e) => sum + e.totalAmount, 0)
                      )}
                      원
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">지급 대기:</span>
                    <span className="value">
                      {formatCurrency(
                        earnings
                          .filter((e) => e.status === "pending")
                          .reduce((sum, e) => sum + e.totalAmount, 0)
                      )}
                      원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherMyPage;
