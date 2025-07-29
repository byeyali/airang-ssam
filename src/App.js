import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import "./App.css";

// 컴포넌트 파일 안들을 모두 불러와.
import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";
import MainContainer from "./components/MainContainer/MainContainer";

// 페이지(컴포넌트)들을 불러와.
import SignUp from "./pages/Signup/SignUp";
import Login from "./pages/Login/Login";
import Helpme from "./pages/Helpme/Helpme";
import Home from "./pages/Home/Home";
import Feedback from "./pages/Feedback/Feedback";
import Reviews from "./pages/Reviews/Reviews";

const App = () => {
  return (
    <UserProvider>
      <ReviewProvider>
        <Router>
          <div className="App">
            <MainContainer>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/Helpme" element={<Helpme />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
              </Routes>
            </MainContainer>
            <Footer />
          </div>
        </Router>
      </ReviewProvider>
    </UserProvider>
  );
};

function Footer() {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} 아이랑쌤. All rights reserved.</p>
    </footer>
  );
}

export default App;
