import React from 'react';

import './MainContainer.css';

function MainContainer({ children }) {
    return (
        // <div className="main-wrapper">
            <div className="main-container">
                {children} {/* 📘 이 자리에 각 페이지의 내용(회원가입 폼 등)이 들어갈 거야 */}
            </div>
        // </div>
    );
}

export default MainContainer;