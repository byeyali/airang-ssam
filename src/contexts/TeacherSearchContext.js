import React, { createContext, useContext, useState, useCallback } from "react";

const TeacherSearchContext = createContext();

export const useTeacherSearch = () => {
  const context = useContext(TeacherSearchContext);
  if (!context) {
    throw new Error(
      "useTeacherSearch must be used within a TeacherSearchProvider"
    );
  }
  return context;
};

export const TeacherSearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const setSearchData = useCallback((results, query) => {
    // 상태 변경을 배치로 처리
    setSearchResults(results || []);
    setSearchQuery(query || "");
  }, []);

  const clearSearchData = useCallback(() => {
    setSearchResults([]);
    setSearchQuery("");
  }, []);

  return (
    <TeacherSearchContext.Provider
      value={{
        searchResults,
        searchQuery,
        setSearchData,
        clearSearchData,
      }}
    >
      {children}
    </TeacherSearchContext.Provider>
  );
};
