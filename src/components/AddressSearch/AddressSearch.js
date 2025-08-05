import React, { useState, useEffect, useRef } from "react";
import {
  searchAddress,
  formatAddressData,
  extractRegionCode,
} from "../../services/kakaoAPI";
import "./AddressSearch.css";

const AddressSearch = ({
  onAddressSelect,
  placeholder = "주소를 검색하세요",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const resultsRef = useRef(null);

  // 검색어 변경 시 디바운스 처리
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 검색 실행
  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await searchAddress(searchQuery);
      const formattedResults = formatAddressData(data);

      setSearchResults(formattedResults);
      setShowResults(true);
    } catch (error) {
      console.error("Address search failed:", error);
      setError("주소 검색에 실패했습니다. 다시 시도해주세요.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 주소 선택
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setSearchQuery(address.full_address);
    setShowResults(false);

    // 지역 정보 추출
    const regionInfo = extractRegionCode(address.full_address);

    // 부모 컴포넌트에 선택된 주소 정보 전달
    onAddressSelect({
      fullAddress: address.full_address,
      roadAddress: address.road_address_name,
      jibunAddress: address.address_name,
      latitude: address.y,
      longitude: address.x,
      region: regionInfo,
    });
  };

  // 검색 결과 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색어 초기화
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedAddress(null);
    setSearchResults([]);
    setShowResults(false);
    setError(null);
    onAddressSelect(null);
  };

  return (
    <div className="address-search-container" ref={resultsRef}>
      <div className="address-search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="address-search-input"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="address-search-loading">
            <div className="spinner"></div>
          </div>
        )}
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="address-search-clear"
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="address-search-error">
          <p>{error}</p>
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="address-search-results">
          <ul className="address-results-list">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="address-result-item"
                onClick={() => handleAddressSelect(result)}
              >
                <div className="address-result-main">
                  <span className="address-result-name">
                    {result.road_address_name || result.address_name}
                  </span>
                </div>
                {result.road_address_name &&
                  result.address_name !== result.road_address_name && (
                    <div className="address-result-sub">
                      <span className="address-result-jibun">
                        지번: {result.address_name}
                      </span>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults &&
        searchResults.length === 0 &&
        !isLoading &&
        searchQuery.trim().length >= 2 && (
          <div className="address-search-no-results">
            <p>검색 결과가 없습니다.</p>
            <p>다른 검색어를 입력해보세요.</p>
          </div>
        )}
    </div>
  );
};

export default AddressSearch;
