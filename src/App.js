import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { TeacherProvider } from "./contexts/TeacherContext";
import { MatchingProvider } from "./contexts/MatchingContext";
import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Helpme from "./pages/Helpme/Helpme";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import Applications from "./pages/Applications/Applications";
import TeacherApplications from "./pages/TeacherApplications/TeacherApplications";
import Reviews from "./pages/Reviews/Reviews";
import Feedback from "./pages/Feedback/Feedback";
import Matchings from "./pages/Matchings/Matchings";
import ParentService from "./pages/ParentService/ParentService";
import TeacherService from "./pages/TeacherService/TeacherService";
import ApplicationDetail from "./pages/ApplicationDetail/ApplicationDetail";
import MyReviews from "./pages/MyReviews/MyReviews";
import "./App.css";

function App() {
  return (
    <Router>
      <UserProvider>
        <ReviewProvider>
          <ApplicationProvider>
            <TeacherProvider>
              <MatchingProvider>
                <div className="App">
                  <Header />
                  <Navigation />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/Helpme" element={<Helpme />} />
                      <Route
                        path="/teacher-profile"
                        element={<TeacherProfile />}
                      />
                      <Route path="/applications" element={<Applications />} />
                      <Route
                        path="/teacher-applications"
                        element={<TeacherApplications />}
                      />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/matchings" element={<Matchings />} />
                      <Route
                        path="/parent-service"
                        element={<ParentService />}
                      />
                      <Route
                        path="/teacher-service"
                        element={<TeacherService />}
                      />
                      <Route
                        path="/application-detail/:applicationId"
                        element={<ApplicationDetail />}
                      />
                      <Route path="/my-reviews" element={<MyReviews />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </MatchingProvider>
            </TeacherProvider>
          </ApplicationProvider>
        </ReviewProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
