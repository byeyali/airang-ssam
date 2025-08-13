import React, { createContext, useContext, useState, useEffect } from "react";

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};

// 이름 마스킹 함수
const maskName = (name) => {
  if (name.length <= 2) return name;
  return (
    name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1)
  );
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    // 로컬 스토리지 초기화 (강제로 새 데이터 사용)
    localStorage.removeItem("reviews");

    // 로컬 스토리지에서 후기 데이터 불러오기
    const savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
      return JSON.parse(savedReviews);
    }

    // 초기 후기 데이터
    return [];
  });

  // 후기 데이터가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (reviewData) => {
    const newReview = {
      id: `review_${Date.now()}`,
      ...reviewData,
      maskedName: maskName(reviewData.name || ""),
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, "")
        .replace(/\s/g, "."),
    };
    setReviews((prev) => [...prev, newReview]);
  };

  const updateReview = (id, updatedData) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id
          ? {
              ...review,
              ...updatedData,
              maskedName: maskName(updatedData.name || review.maskedName),
            }
          : review
      )
    );
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  const getReviewById = (id) => {
    return reviews.find((review) => review.id === id);
  };

  const value = {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    getReviewById,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};
