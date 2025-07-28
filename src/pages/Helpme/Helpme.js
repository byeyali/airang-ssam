//
// Helpme.js
// 모든 카테고리 항목에서 중복 선택이 가능한 최종 파일
//

import React, { useState } from 'react';
import './Helpme.css';

const Helpme = () => {
    // 🧠 'selectedItems'라는 상태(state)를 만들고, 초깃값으로 빈 배열([])을 넣어줘.
    // 이 배열에 선택된 항목들의 이름이 저장될 거야.
    const [selectedItems, setSelectedItems] = useState([]);
    const [address, setAddress] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [startDate, setStartDate] = useState('2025-07-30');
    const [endDate, setEndDate] = useState('2026-07-30');
    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartTime] = useState('11:00');
    const [endTime, setEndTime] = useState('19:00');
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [teacherName, setTeacherName] = useState('');



    // 📘 항목을 클릭했을 때 호출될 함수야.
    const handleItemClick = (item) => {
        // 클릭된 항목이 이미 선택된 항목인지 확인해.
        if (selectedItems.includes(item)) {
            // 이미 있으면 배열에서 제거해서 선택을 해제해.
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            // 없으면 배열에 추가해서 선택해.
            setSelectedItems([...selectedItems, item]);
        }
    };



    // 📘 특정 항목이 현재 선택된 상태인지 확인하는 함수.
    const isItemSelected = (item) => {
        return selectedItems.includes(item);
    };

// 요일 버튼 클릭 핸들러
    const handleDayClick = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };
    // 성별 버튼 클릭 핸들러
    const handleGenderClick = (gender) => {
        setSelectedGender(gender);
    };

    return (

        <div className="helpme-container">
            <div className="helpme-header">
                <h1>도와줘요 쌤</h1>
                <p>어느 분야를 돌봐드리면 될까요?</p>
            </div>

            <div className="category-wrapper">
                
                {/* 돌봄 카테고리 */}
                <div className="category">
                    <div className="category-title">돌봄</div>
                    <div className="item-list">
                        <div 
                            className="item-card" 
                            onClick={() => handleItemClick('방과 후 마중')} 
                        >
                            {/* ✨ 이미지 그라데이션 클래스('돌봄-1')와 이미지 경로를 같이 넣어줬어. */}
                            <div className="item-image 돌봄-1" style={{ backgroundImage: `url('/img/afterschool.png')` }}></div>
                            <div className="item-text">방과 후 마중</div>
                            {/* 선택 여부에 따라 체크 표시가 보이도록 동적으로 클래스를 적용해. */}
                            <div className={`item-icon-circle ${isItemSelected('방과 후 마중') ? 'selected' : ''}`}>
             
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('음식 챙김')}
                        >
                            <div className="item-image 돌봄-2" style={{ backgroundImage: `url('/img/food.png')` }}></div>
                            <div className="item-text">음식 챙김</div>
                            <div className={`item-icon-circle ${isItemSelected('음식 챙김') ? 'selected' : ''}`}>

                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('정리 정돈')}
                        >
                            <div className="item-image 돌봄-3" style={{ backgroundImage: `url('/img/clean.png')` }}></div>
                            <div className="item-text">정리 정돈</div>
                            <div className={`item-icon-circle ${isItemSelected('정리 정돈') ? 'selected' : ''}`}>
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('특수 돌봄')}
                        >
                            <div className="item-image 돌봄-4" style={{ backgroundImage: `url('/img/specialcare.png')` }}></div>
                            <div className="item-text">특수 돌봄</div>
                            <div className={`item-icon-circle ${isItemSelected('특수 돌봄') ? 'selected' : ''}`}>

                            </div>
                        </div>
                    </div>
                </div>

                {/* 놀이 카테고리 */}
                <div className="category">
                    <div className="category-title">놀이</div>
                    <div className="item-list">
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('스포츠')}
                        >
                            <div className="item-image 놀이-1" style={{ backgroundImage: `url('/img/sports.png')` }}></div>
                            <div className="item-text">스포츠</div>
                            <div className={`item-icon-circle ${isItemSelected('스포츠') ? 'selected' : ''}`}>

                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('음악')}
                        >
                            <div className="item-image 놀이-2" style={{ backgroundImage: `url('/img/music.png')` }}></div>
                            <div className="item-text">음악</div>
                            <div className={`item-icon-circle ${isItemSelected('음악') ? 'selected' : ''}`}>
            
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('미술')}>
                            <div className="item-image 놀이-3" style={{ backgroundImage: `url('/img/art.png')` }}></div>
                            <div className="item-text">미술</div>
                            <div className={`item-icon-circle ${isItemSelected('미술') ? 'selected' : ''}`}>
             
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('보드게임')}>
                            <div className="item-image 놀이-4" style={{ backgroundImage: `url('/img/boardgame.png')` }}></div>
                            <div className="item-text">보드게임</div>
                            <div className={`item-icon-circle ${isItemSelected('보드게임') ? 'selected' : ''}`}>
             
                            </div>
                        </div>
                    </div>
                </div>

                {/* 스터디 카테고리 */}
                <div className="category">
                    <div className="category-title">스터디</div>
                    <div className="item-list">
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('산수')}>
                            <div className="item-image 스터디-1" style={{ backgroundImage: `url('/img/math.png')` }}></div>
                            <div className="item-text">산수</div>
                            <div className={`item-icon-circle ${isItemSelected('산수') ? 'selected' : ''}`}>
            
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('교과 보충')}>
                            <div className="item-image 스터디-2" style={{ backgroundImage: `url('/img/textbook.png')` }}></div>
                            <div className="item-text">교과 보충</div>
                            <div className={`item-icon-circle ${isItemSelected('교과 보충') ? 'selected' : ''}`}>
                      
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('독서 대화')}>
                            <div className="item-image 스터디-3" style={{ backgroundImage: `url('/img/reading.png')` }}></div>
                            <div className="item-text">독서 대화</div>
                            <div className={`item-icon-circle ${isItemSelected('독서 대화') ? 'selected' : ''}`}>
                        
                            </div>
                        </div>
                        <div 
                            className="item-card"
                            onClick={() => handleItemClick('제2외국어')}>
                            <div className="item-image 스터디-4" style={{ backgroundImage: `url('/img/secondlanguage.png')` }}></div>
                            <div className="item-text">제2외국어</div>
                            <div className={`item-icon-circle ${isItemSelected('제2외국어') ? 'selected' : ''}`}>
                        
                            </div>
                        </div>
                    </div>
                </div>

            </div>

{/* ✨✨✨ 여기부터 새로운 검색 필터 UI를 추가합니다. */}
            <div className="search-filter-section">
                <div className="search-row">
                    <p className="search-title">어느 지역에 살고 계시나요?</p>
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="살고 계신 지역"
                            className="search-input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button className="search-button">검색</button>
                    </div>
                    <div className="search-result">
                        <p>{searchResult || '세종특별고시 고운동'}</p>
                    </div>
                </div>

                <div className="filter-group">
                    <p className="filter-title">원하시는 돌봄기간</p>
                    <div className="date-picker-row">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <span>~</span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className="filter-group">
                    <p className="filter-title">원하시는 돌봄요일</p>
                    <div className="day-selector">
                        {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                            <button
                                key={day}
                                className={`day-button ${selectedDays.includes(day) ? 'active' : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <p className="filter-title">원하시는 돌봄시간</p>
                    <div className="time-selector">
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        <span>~</span>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                </div>

                <div className="filter-group-inline">
                    <p className="filter-title">원하시는 쌤 연령</p>
                    <div className="age-selector-group">
                        <input
                            type="number"
                            placeholder="몇 세"
                            value={ageMin}
                            onChange={(e) => setAgeMin(e.target.value)}
                        />
                        <span className="age-divider">~</span>
                        <input
                            type="number"
                            placeholder="몇 세"
                            value={ageMax}
                            onChange={(e) => setAgeMax(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="filter-group-inline">
                    <p className="filter-title">원하시는 쌤 성별</p>
                    <div className="gender-selector">
                        <button
                            className={`gender-button ${selectedGender === '여성' ? 'active' : ''}`}
                            onClick={() => handleGenderClick('여성')}
                        >
                            여성
                        </button>
                        <button
                            className={`gender-button ${selectedGender === '남성' ? 'active' : ''}`}
                            onClick={() => handleGenderClick('남성')}
                        >
                            남성
                        </button>
                    </div>
                </div>

                <div className="search-row-bottom">
                    <p className="filter-title">지정 쌤 검색</p>
                    <input
                        type="text"
                        placeholder="쌤 이름을 입력하세요"
                        className="search-input-bottom"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                    />
                    <button className="magnifying-glass-button">
                        <img src="/img/magnifying_glass.png" alt="검색" />
                    </button>
                </div>
            </div>
            {/* 새로 추가한 검색 필터 UI 끝! */}
        </div>
    );
}

export default Helpme;