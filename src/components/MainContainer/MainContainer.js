import React from "react";
import "./MainContainer.css";

import Header from "../Header/Header"; // 💡 Header 컴포넌트 불러오기
import Navigation from "../Navigation/Navigation"; // 💡 Navigation 컴포넌트 불러오기

function MainContainer({ children }) {
  return (
    <div className="main-container">
      <Header />
      <Navigation />
      {children}
    </div>
  );
}

export default MainContainer;
