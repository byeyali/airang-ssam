import React, { createContext, useContext, useState } from "react";

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      location: "서울특별시 강남구",
      rating: 5,
      text: "항상 시간맞춰 오셨고, 아이와 최선을 다해 시간 보내주셨어요~아기를 진심으로 예뻐해주시고, 아껴주시고 돌보아주셨어요.",
      momName: "김미영",
      date: "2024.01.15",
      userId: "user1",
    },
    {
      id: 2,
      location: "대전특별시 하대전구",
      rating: 4,
      text: "아이가 너무 좋아해요! 선생님이 정말 따뜻하고 전문적으로 돌봐주셔서 안심하고 맡길 수 있었어요.",
      momName: "이수진",
      date: "2024.01.12",
      userId: "user2",
    },
    {
      id: 3,
      location: "부산광역시 해운대구",
      rating: 5,
      text: "정말 감사합니다. 아이가 선생님 덕분에 많이 성장했어요. 다음에도 꼭 부탁드리고 싶어요!",
      momName: "박지영",
      date: "2024.01.10",
      userId: "user3",
    },
    {
      id: 4,
      location: "인천광역시 연수구",
      rating: 4,
      text: "첫 아이라 걱정이 많았는데, 선생님이 정말 세심하게 돌봐주셔서 안심했어요. 추천합니다!",
      momName: "최민지",
      date: "2024.01.08",
      userId: "user4",
    },
    {
      id: 5,
      location: "대구광역시 수성구",
      rating: 5,
      text: "아이가 선생님을 너무 좋아해요. 매일 선생님 이야기를 하며 기다리고 있어요. 정말 감사합니다!",
      momName: "정현아",
      date: "2024.01.05",
      userId: "user5",
    },
    {
      id: 6,
      location: "광주광역시 서구",
      rating: 4,
      text: "선생님이 아이의 특성을 잘 파악하시고 맞춤형으로 돌봐주셔서 아이가 많이 발전했어요.",
      momName: "한소영",
      date: "2024.01.03",
      userId: "user6",
    },
  ]);

  const addReview = (newReview, currentUser) => {
    const review = {
      id: Date.now(),
      ...newReview,
      userId: currentUser?.id || "anonymous",
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(".", ""),
    };
    setReviews((prev) => [review, ...prev]);
  };

  const updateReview = (reviewId, updatedData) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, ...updatedData } : review
      )
    );
  };

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  const getHomeReviews = () => {
    return reviews.slice(0, 6); // 홈페이지에는 최신 6개만 표시
  };

  const getAllReviews = () => {
    return reviews;
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        updateReview,
        deleteReview,
        getHomeReviews,
        getAllReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
