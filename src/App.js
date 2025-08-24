import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { TeacherProvider } from "./contexts/TeacherContext";
import { MatchingProvider } from "./contexts/MatchingContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TeacherSearchProvider } from "./contexts/TeacherSearchContext";
import { AdminDashboardProvider } from "./contexts/AdminDashboardContext";
import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import TeacherSearchModal from "./components/TeacherSearchModal/TeacherSearchModal";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Helpme from "./pages/Helpme/Helpme";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import Applications from "./pages/Applications/Applications";
import TeacherApplications from "./pages/TeacherApplications/TeacherApplications";
import Reviews from "./pages/Reviews/Reviews";

import Matchings from "./pages/Matchings/Matchings";
import MatchingsDetail from "./pages/Matchings/MatchingsDetail";
import ParentService from "./pages/ParentService/ParentService";
import TeacherService from "./pages/TeacherService/TeacherService";
import ApplicationDetail from "./pages/ApplicationDetail/ApplicationDetail";
import MyReviews from "./pages/MyReviews/MyReviews";
import TeacherDetail from "./pages/TeacherDetail/TeacherDetail";
import TeacherNotifications from "./pages/TeacherNotifications/TeacherNotifications";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import PaymentStatusPage from "./pages/PaymentStatusPage/PaymentStatusPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage/PaymentHistoryPage";
import SalaryStatusPage from "./pages/AdminDashboard/SalaryStatusPage";
import TeacherPaymentStatus from "./pages/TeacherPaymentStatus/TeacherPaymentStatus";
import ParentPaymentHistory from "./pages/ParentPaymentHistory/ParentPaymentHistory";
import ParentRecharge from "./pages/ParentRecharge/ParentRecharge";
import ContractManagement from "./pages/AdminDashboard/ContractManagement";
import ParentContractManagement from "./pages/ParentContractManagement/ParentContractManagement";
import TeacherContractManagement from "./pages/TeacherContractManagement/TeacherContractManagement";
import TeacherMyPage from "./pages/TeacherMyPage/TeacherMyPage";
import ParentMyPage from "./pages/ParentMyPage/ParentMyPage";
import DebugInfo from "./components/DebugInfo/DebugInfo";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const [isTeacherSearchModalOpen, setIsTeacherSearchModalOpen] =
    useState(false);
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);

  // URL이 teacher-search일 때 모달 열기 (안정적 처리)
  useEffect(() => {
    if (location.pathname === "/teacher-search") {
      // 약간의 지연으로 안정성 확보
      setTimeout(() => {
        setIsTeacherSearchModalOpen(true);
      }, 50);
    } else {
      setIsTeacherSearchModalOpen(false);
    }
  }, [location.pathname]);

  const handleCloseTeacherSearchModal = useCallback(() => {
    setIsModalTransitioning(true);
    setIsTeacherSearchModalOpen(false);

    // 모달 닫기 애니메이션 완료 후 뒤로가기
    setTimeout(() => {
      window.history.back();
      setIsModalTransitioning(false);
    }, 300);
  }, []);

  if (isAuthPage) {
    return (
      <div className="App">
        <main className="auth-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Helpme" element={<Helpme />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/applications" element={<Applications />} />
          <Route
            path="/teacher-applications"
            element={<TeacherApplications />}
          />
          <Route path="/reviews" element={<Reviews />} />

          <Route path="/matchings" element={<Matchings />} />
          <Route path="/matchings-detail/:id" element={<MatchingsDetail />} />
          <Route path="/parent-service" element={<ParentService />} />
          <Route path="/teacher-service" element={<TeacherService />} />
          <Route
            path="/application-detail/:id"
            element={<ApplicationDetail />}
          />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/teacher-detail/:id" element={<TeacherDetail />} />
          <Route
            path="/teacher-notifications"
            element={<TeacherNotifications />}
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/payment-status" element={<PaymentStatusPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/admin/payment-status" element={<PaymentStatusPage />} />
          <Route path="/admin/salary-status" element={<SalaryStatusPage />} />
          <Route
            path="/teacher/payment-status"
            element={<TeacherPaymentStatus />}
          />
          <Route
            path="/parent/payment-history"
            element={<ParentPaymentHistory />}
          />
          <Route path="/parent/recharge" element={<ParentRecharge />} />
          <Route path="/contract-management" element={<ContractManagement />} />
          <Route
            path="/parent/contract-management"
            element={<ParentContractManagement />}
          />
          <Route
            path="/teacher/contract-management"
            element={<TeacherContractManagement />}
          />
          <Route path="/teacher/my-page" element={<TeacherMyPage />} />
          <Route path="/parent/my-page" element={<ParentMyPage />} />
          <Route path="/my-page" element={<ParentMyPage />} />
          <Route path="/teacher-search" element={<div />} />
        </Routes>
      </main>
      <Footer />

      {/* TeacherSearch 모달 */}
      <TeacherSearchModal
        isOpen={isTeacherSearchModalOpen && !isModalTransitioning}
        onClose={handleCloseTeacherSearchModal}
        onTeacherSelect={(teacher) => {
          // 모달 닫기
          setIsTeacherSearchModalOpen(false);

          // 선택된 쌤 정보를 전역 변수에 저장
          window.selectedTeacher = teacher;
          window.fromTeacherSearch = true;

          // 커스텀 이벤트 발생 (항상 발생)
          window.dispatchEvent(
            new CustomEvent("teacherSelected", {
              detail: { teacher },
            })
          );

          // 다른 페이지에서 온 경우에만 navigate
          if (location.pathname !== "/Helpme") {
            setTimeout(() => {
              navigate("/Helpme", {
                state: {
                  selectedTeacher: teacher,
                  fromTeacherSearch: true,
                },
              });
            }, 100);
          }
        }}
      />

      {/* 디버그 정보 컴포넌트 (개발/배포 환경에서만 표시) */}
      {process.env.NODE_ENV === "development" ||
      window.location.hostname.includes("azurestaticapps") ? (
        <DebugInfo />
      ) : null}
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <ReviewProvider>
          <ApplicationProvider>
            <TeacherProvider>
              <MatchingProvider>
                <NotificationProvider>
                  <TeacherSearchProvider>
                    <AdminDashboardProvider>
                      <AppContent />
                    </AdminDashboardProvider>
                  </TeacherSearchProvider>
                </NotificationProvider>
              </MatchingProvider>
            </TeacherProvider>
          </ApplicationProvider>
        </ReviewProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
