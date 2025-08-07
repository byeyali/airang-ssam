import React, { useState, useEffect, useRef } from "react";
import { searchRegion, searchRegionLocal } from "../../config/api";
import "./RegionSearch.css";

const RegionSearch = ({
  onRegionSelect,
  selectedRegions = [],
  multiple = false,
  placeholder = "지역을 검색하세요",
  maxRegions = null,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 지역 검색
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // 간단한 테스트용 지역 데이터
    const testRegions = [
      {
        title: "서울특별시 관악구",
        id: "seoul_gwanak",
        address: "서울특별시 관악구",
      },
      {
        title: "서울특별시 강남구",
        id: "seoul_gangnam",
        address: "서울특별시 강남구",
      },
      {
        title: "서울특별시 서초구",
        id: "seoul_seocho",
        address: "서울특별시 서초구",
      },
      {
        title: "서울특별시 마포구",
        id: "seoul_mapo",
        address: "서울특별시 마포구",
      },
      {
        title: "서울특별시 영등포구",
        id: "seoul_yeongdeungpo",
        address: "서울특별시 영등포구",
      },
      {
        title: "서울특별시 금천구",
        id: "seoul_geumcheon",
        address: "서울특별시 금천구",
      },
      {
        title: "서울특별시 동작구",
        id: "seoul_dongjak",
        address: "서울특별시 동작구",
      },
      {
        title: "서울특별시 구로구",
        id: "seoul_guro",
        address: "서울특별시 구로구",
      },
      {
        title: "서울특별시 강서구",
        id: "seoul_gangseo",
        address: "서울특별시 강서구",
      },
      {
        title: "서울특별시 양천구",
        id: "seoul_yangcheon",
        address: "서울특별시 양천구",
      },
      {
        title: "서울특별시 송파구",
        id: "seoul_songpa",
        address: "서울특별시 송파구",
      },
      {
        title: "서울특별시 강동구",
        id: "seoul_gangdong",
        address: "서울특별시 강동구",
      },
      {
        title: "서울특별시 광진구",
        id: "seoul_gwangjin",
        address: "서울특별시 광진구",
      },
      {
        title: "서울특별시 성동구",
        id: "seoul_seongdong",
        address: "서울특별시 성동구",
      },
      {
        title: "서울특별시 중구",
        id: "seoul_jung",
        address: "서울특별시 중구",
      },
      {
        title: "서울특별시 용산구",
        id: "seoul_yongsan",
        address: "서울특별시 용산구",
      },
      {
        title: "서울특별시 서대문구",
        id: "seoul_seodaemun",
        address: "서울특별시 서대문구",
      },
      {
        title: "서울특별시 은평구",
        id: "seoul_eunpyeong",
        address: "서울특별시 은평구",
      },
      {
        title: "서울특별시 노원구",
        id: "seoul_nowon",
        address: "서울특별시 노원구",
      },
      {
        title: "서울특별시 도봉구",
        id: "seoul_dobong",
        address: "서울특별시 도봉구",
      },
      {
        title: "서울특별시 강북구",
        id: "seoul_gangbuk",
        address: "서울특별시 강북구",
      },
      {
        title: "서울특별시 중랑구",
        id: "seoul_jungnang",
        address: "서울특별시 중랑구",
      },
      {
        title: "경기도 안양시",
        id: "gyeonggi_anyang",
        address: "경기도 안양시",
      },
      {
        title: "경기도 성남시",
        id: "gyeonggi_seongnam",
        address: "경기도 성남시",
      },
      {
        title: "경기도 부천시",
        id: "gyeonggi_bucheon",
        address: "경기도 부천시",
      },
      {
        title: "경기도 수원시",
        id: "gyeonggi_suwon",
        address: "경기도 수원시",
      },
      {
        title: "경기도 고양시",
        id: "gyeonggi_goyang",
        address: "경기도 고양시",
      },
      {
        title: "경기도 용인시",
        id: "gyeonggi_yongin",
        address: "경기도 용인시",
      },
      {
        title: "경기도 평택시",
        id: "gyeonggi_pyeongtaek",
        address: "경기도 평택시",
      },
      {
        title: "경기도 의정부시",
        id: "gyeonggi_uijeongbu",
        address: "경기도 의정부시",
      },
      {
        title: "경기도 안산시",
        id: "gyeonggi_ansan",
        address: "경기도 안산시",
      },
      {
        title: "경기도 김포시",
        id: "gyeonggi_gimpo",
        address: "경기도 김포시",
      },
      {
        title: "경기도 광주시",
        id: "gyeonggi_gwangju",
        address: "경기도 광주시",
      },
      {
        title: "경기도 하남시",
        id: "gyeonggi_hanam",
        address: "경기도 하남시",
      },
      {
        title: "경기도 오산시",
        id: "gyeonggi_osan",
        address: "경기도 오산시",
      },
      {
        title: "경기도 시흥시",
        id: "gyeonggi_siheung",
        address: "경기도 시흥시",
      },
      {
        title: "경기도 군포시",
        id: "gyeonggi_gunpo",
        address: "경기도 군포시",
      },
      {
        title: "경기도 의왕시",
        id: "gyeonggi_uiwang",
        address: "경기도 의왕시",
      },
      {
        title: "경기도 남양주시",
        id: "gyeonggi_namyangju",
        address: "경기도 남양주시",
      },
      {
        title: "경기도 구리시",
        id: "gyeonggi_guri",
        address: "경기도 구리시",
      },
      {
        title: "경기도 파주시",
        id: "gyeonggi_paju",
        address: "경기도 파주시",
      },
      {
        title: "경기도 양평군",
        id: "gyeonggi_yangpyeong",
        address: "경기도 양평군",
      },
      {
        title: "경기도 여주시",
        id: "gyeonggi_yeoju",
        address: "경기도 여주시",
      },
      {
        title: "경기도 이천시",
        id: "gyeonggi_icheon",
        address: "경기도 이천시",
      },
      {
        title: "경기도 광명시",
        id: "gyeonggi_gwangmyeong",
        address: "경기도 광명시",
      },
      {
        title: "경기도 과천시",
        id: "gyeonggi_gwacheon",
        address: "경기도 과천시",
      },
      {
        title: "인천광역시",
        id: "incheon",
        address: "인천광역시",
      },
      {
        title: "부산광역시",
        id: "busan",
        address: "부산광역시",
      },
      {
        title: "대구광역시",
        id: "daegu",
        address: "대구광역시",
      },
      {
        title: "광주광역시",
        id: "gwangju",
        address: "광주광역시",
      },
      {
        title: "대전광역시",
        id: "daejeon",
        address: "대전광역시",
      },
      {
        title: "울산광역시",
        id: "ulsan",
        address: "울산광역시",
      },
    ];

    // 검색어로 필터링 (더 유연한 검색)
    const filteredResults = testRegions.filter((region) => {
      const searchLower = searchQuery.toLowerCase();
      const titleLower = region.title.toLowerCase();
      const addressLower = region.address.toLowerCase();

      // 제목이나 주소에 검색어가 포함되어 있는지 확인
      return (
        titleLower.includes(searchLower) || addressLower.includes(searchLower)
      );
    });

    setResults(filteredResults);
    setIsOpen(true);
    setLoading(false);
  };

  // 검색 입력 처리
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // 최대 개수에 도달했으면 검색하지 않음
    if (maxRegions && validSelectedRegions.length >= maxRegions) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (value.trim()) {
      handleSearch(value);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  // 지역 선택
  const handleRegionSelect = (region) => {
    if (multiple) {
      // 다중 선택 모드
      const isAlreadySelected = selectedRegions.some(
        (selected) => selected.id === region.id
      );

      if (!isAlreadySelected) {
        // 최대 개수 제한 확인
        if (maxRegions && validSelectedRegions.length >= maxRegions) {
          alert(`최대 ${maxRegions}개까지 선택할 수 있습니다.`);
          return;
        }
        onRegionSelect([...selectedRegions, region]);
      }
    } else {
      // 단일 선택 모드
      onRegionSelect([region]);
    }
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // 선택된 지역 제거
  const handleRemoveRegion = (regionId) => {
    const updatedRegions = selectedRegions.filter(
      (region) => region.id !== regionId
    );
    onRegionSelect(updatedRegions);
  };

  // 빈 지역 필터링
  const validSelectedRegions = selectedRegions.filter(
    (region) =>
      region && region.id && region.title && region.title.trim() !== ""
  );

  return (
    <div className="region-search-container" ref={dropdownRef}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={
            maxRegions && validSelectedRegions.length >= maxRegions
              ? `최대 ${maxRegions}개까지 선택 가능`
              : placeholder
          }
          className="region-search-input"
          disabled={maxRegions && validSelectedRegions.length >= maxRegions}
        />
        {loading && <div className="loading-spinner"></div>}
      </div>

      {/* 선택된 지역들 표시 */}
      {validSelectedRegions.length > 0 && (
        <div className="selected-regions">
          {validSelectedRegions.map((region) => (
            <div key={region.id} className="selected-region-tag">
              <span>{region.title}</span>
              <button
                onClick={() => handleRemoveRegion(region.id)}
                className="remove-region-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 검색 결과 드롭다운 */}
      {isOpen &&
        results.length > 0 &&
        !(maxRegions && validSelectedRegions.length >= maxRegions) && (
          <div className="region-dropdown">
            {results.map((region) => (
              <div
                key={region.id}
                className="region-option"
                onClick={() => handleRegionSelect(region)}
              >
                <div className="region-title">{region.title}</div>
                <div className="region-address">
                  {region.address || region.title}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* 검색 결과가 없을 때 */}
      {isOpen && !loading && results.length === 0 && query.trim() && (
        <div className="region-dropdown">
          <div className="no-results">검색 결과가 없습니다.</div>
        </div>
      )}

      {/* 최대 개수 도달 시 안내 메시지 */}
      {maxRegions && validSelectedRegions.length >= maxRegions && (
        <div className="max-regions-message">
          최대 {maxRegions}개까지 선택 가능합니다. 지역을 제거한 후 다시
          추가해주세요.
        </div>
      )}
    </div>
  );
};

export default RegionSearch;
