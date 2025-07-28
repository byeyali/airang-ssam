import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

// 컴포넌트 파일 안들을 모두 불러와.
import MainContainer from './components/MainContainer/MainContainer';
import Header from './components/Header/Header';
import Navigation from "./components/Navigation/Navigation";

// 페이지(컴포넌트)들을 불러와.
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login/Login';
import Helpme from './pages/Helpme/Helpme'; 


const App = () => {
  return (

    <Router>

      <MainContainer>
        <Header />
        <Navigation />     
      {/* <Routes>는 여러 <Route> 중에서 현재 URL과 일치하는 
        첫 번째 <Route>를 찾아 렌더링해주는 역할이야.
      */}
        <Routes>
          {/* '도와줘요 쌤' 페이지 라우팅! */}
          {/* 사용자가 '/helpme' 주소로 접속하면 Helpme 컴포넌트를 보여줘. */}
          <Route path="/helpme" element={<Helpme />} /> 
          
          {/* 다른 페이지 라우팅도 이렇게 추가해줘. */}
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </MainContainer>
    </Router>

  );
}

export default App;
