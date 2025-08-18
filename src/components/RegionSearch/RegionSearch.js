import React, { useState, useEffect, useRef } from "react";
import "./RegionSearch.css";

const RegionSearch = ({
  onRegionSelect,
  selectedRegions = [],
  multiple = false,
  placeholder = "지역을 검색하세요",
  fetchRegions,
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
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const regions = await fetchRegions(searchQuery);

      setResults(regions);
      setIsOpen(true);
    } catch (error) {
      setResults([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // 검색 입력 처리
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query);
    }
  };

  // 지역 선택
  const handleRegionSelect = (region) => {
    if (multiple) {
      // 다중 선택 모드
      const isAlreadySelected = selectedRegions.some(
        (selected) => selected.regionNm === region.regionNm
      );

      if (selectedRegions.length >= 4) {
        // 선택된 지역이 4개 이상이면 추가 안 함
        return;
      }

      if (!isAlreadySelected) {
        onRegionSelect([...selectedRegions, region]);
      }
    } else {
      // 단일 선택 모드
      onRegionSelect(region);
    }
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // 선택된 지역 제거
  const handleRemoveRegion = (regionNm) => {
    const updatedRegions = selectedRegions.filter(
      (region) => region.regionNm !== regionNm
    );
    onRegionSelect(updatedRegions);
  };

  return (
    <div className="region-search-container" ref={dropdownRef}>
      {/* 선택된 지역들 표시 */}
      {selectedRegions.length > 0 && (
        <div className="selected-regions">
          {selectedRegions.map((region, index) => (
            <div
              key={`${region.regionNm}-${index}`}
              className="selected-region-tag"
            >
              <span>{region.regionNm}</span>
              <button
                onClick={() => handleRemoveRegion(region.regionNm)}
                className="remove-region-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="region-search-input"
        />
        {loading && <div className="loading-spinner"></div>}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && results.length > 0 && (
        <div className="region-dropdown">
          {results.map((region, index) => (
            <div
              key={`${region.regionNm}-${region.regionCd || index}`}
              className="region-option"
              onClick={() => handleRegionSelect(region)}
            >
              <div className="region-title">{region.regionNm}</div>
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
    </div>
  );
};

export default RegionSearch;
