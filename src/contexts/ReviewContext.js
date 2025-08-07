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
    return [
      {
        id: "review_001",
        userId: "user_001",
        teacherId: "teacher_001",
        teacherName: "양연희",
        maskedName: "김*정",
        rating: 5,
        content:
          "양연희 쌤께서 우리 아이를 정말 잘 챙겨주셨어요. 피아노도 가르쳐주시고, 영어도 함께 공부할 수 있어서 아이가 너무 좋아했어요. 체계적으로 가르쳐주시고, 아이의 관심사에 맞춰서 수업을 진행해주셔서 정말 만족스러웠습니다.",
        date: "2025.01.15",
        region: "관악구",
      },
      {
        id: "review_002",
        userId: "user_002",
        teacherId: "teacher_002",
        teacherName: "김민수",
        maskedName: "박*영",
        rating: 4,
        content:
          "김민수 쌤은 아이들과 정말 잘 어울리시는 분이에요. 영어 수업을 재미있게 가르쳐주시고, 체육 활동도 함께 해주셔서 아이가 건강하게 성장할 수 있었어요. 다음에도 꼭 부탁드리고 싶어요!",
        date: "2025.01.12",
        region: "강남구",
      },
      {
        id: "review_003",
        userId: "user_003",
        teacherId: "teacher_003",
        teacherName: "박지영",
        maskedName: "이*수",
        rating: 5,
        content:
          "박지영 쌤은 음악과 미술을 정말 잘 가르쳐주시는 분이에요. 아이의 창의력을 키워주시고, 요리 활동도 함께 해주셔서 아이가 다양한 경험을 할 수 있었어요. 정말 감사했습니다!",
        date: "2025.01.10",
        region: "마포구",
      },
      {
        id: "review_004",
        userId: "user_004",
        teacherId: "teacher_004",
        teacherName: "이준호",
        maskedName: "최*희",
        rating: 4,
        content:
          "이준호 쌤은 체육 활동을 정말 잘 가르쳐주시는 분이에요. 축구와 농구를 재미있게 가르쳐주시고, 아이들이 건강하게 운동할 수 있도록 도와주셨어요. 아이가 운동을 좋아하게 되었어요!",
        date: "2025.01.08",
        region: "성동구",
      },
      {
        id: "review_005",
        userId: "user_005",
        teacherId: "teacher_005",
        teacherName: "최영희",
        maskedName: "정*민",
        rating: 5,
        content:
          "최영희 쌤은 오랜 경험을 바탕으로 아이들을 정말 잘 챙겨주시는 분이에요. 기초 학습부터 생활습관까지 체계적으로 가르쳐주시고, 따뜻한 마음으로 아이를 돌봐주셨어요. 정말 만족스러웠습니다.",
        date: "2025.01.05",
        region: "노원구",
      },
      {
        id: "review_006",
        userId: "user_006",
        teacherId: "teacher_006",
        teacherName: "정수진",
        maskedName: "한*우",
        rating: 4,
        content:
          "정수진 쌤은 수학을 정말 잘 가르쳐주시는 분이에요. 어려워하는 부분을 쉽게 설명해주시고, 단계별로 차근차근 가르쳐주셔서 아이가 수학을 좋아하게 되었어요. 감사합니다!",
        date: "2025.01.03",
        region: "양천구",
      },
      {
        id: "review_007",
        userId: "user_007",
        teacherId: "teacher_007",
        teacherName: "김미영",
        maskedName: "송*현",
        rating: 5,
        content:
          "김미영 쌤은 영어를 정말 재미있게 가르쳐주시는 분이에요. 게임을 통해 자연스럽게 영어를 배울 수 있도록 해주시고, 아이가 영어에 대한 흥미를 갖게 되었어요. 정말 감사합니다!",
        date: "2025.01.01",
        region: "서초구",
      },
      {
        id: "review_008",
        userId: "user_008",
        teacherId: "teacher_008",
        teacherName: "박현우",
        maskedName: "임*수",
        rating: 4,
        content:
          "박현우 쌤은 체육과 음악을 함께 가르쳐주시는 분이에요. 아이들이 즐겁게 운동하면서 음악도 배울 수 있어서 아이가 정말 좋아했어요. 체계적으로 가르쳐주셔서 감사합니다.",
        date: "2024.12.30",
        region: "강서구",
      },
      {
        id: "review_009",
        userId: "user_009",
        teacherId: "teacher_009",
        teacherName: "이수진",
        maskedName: "강*영",
        rating: 5,
        content:
          "이수진 쌤은 미술과 요리를 정말 잘 가르쳐주시는 분이에요. 아이의 창의력을 키워주시고, 안전하게 요리 활동을 할 수 있도록 도와주셨어요. 아이가 요리를 좋아하게 되었어요!",
        date: "2024.12.28",
        region: "광진구",
      },
      {
        id: "review_010",
        userId: "user_010",
        teacherId: "teacher_010",
        teacherName: "최동현",
        maskedName: "조*민",
        rating: 4,
        content:
          "최동현 쌤은 수학과 과학을 재미있게 가르쳐주시는 분이에요. 실험을 통해 과학의 원리를 쉽게 이해할 수 있도록 해주시고, 아이가 과학에 대한 관심을 갖게 되었어요.",
        date: "2024.12.25",
        region: "동대문구",
      },
      {
        id: "review_011",
        userId: "user_011",
        teacherId: "teacher_011",
        teacherName: "정미라",
        maskedName: "윤*희",
        rating: 5,
        content:
          "정미라 쌤은 아이들을 정말 따뜻하게 돌봐주시는 분이에요. 학습뿐만 아니라 생활습관까지 체계적으로 가르쳐주시고, 아이가 건강하게 성장할 수 있도록 도와주셨어요.",
        date: "2024.12.22",
        region: "중랑구",
      },
      {
        id: "review_012",
        userId: "user_012",
        teacherId: "teacher_012",
        teacherName: "김태현",
        maskedName: "백*우",
        rating: 4,
        content:
          "김태현 쌤은 체육 활동을 정말 잘 가르쳐주시는 분이에요. 축구와 농구를 재미있게 가르쳐주시고, 아이들이 건강하게 운동할 수 있도록 도와주셨어요. 아이가 운동을 좋아하게 되었어요!",
        date: "2024.12.20",
        region: "성북구",
      },
      {
        id: "review_013",
        userId: "user_013",
        teacherId: "teacher_013",
        teacherName: "박서연",
        maskedName: "김*수",
        rating: 5,
        content:
          "박서연 쌤은 영어와 수학을 정말 잘 가르쳐주시는 분이에요. 아이의 수준에 맞춰서 차근차근 가르쳐주시고, 재미있는 게임을 통해 자연스럽게 학습할 수 있도록 해주셨어요.",
        date: "2024.12.18",
        region: "강동구",
      },
      {
        id: "review_014",
        userId: "user_014",
        teacherId: "teacher_014",
        teacherName: "이민호",
        maskedName: "이*영",
        rating: 4,
        content:
          "이민호 쌤은 체육과 음악을 함께 가르쳐주시는 분이에요. 아이들이 즐겁게 운동하면서 음악도 배울 수 있어서 아이가 정말 좋아했어요. 체계적으로 가르쳐주셔서 감사합니다.",
        date: "2024.12.15",
        region: "송파구",
      },
      {
        id: "review_015",
        userId: "user_015",
        teacherId: "teacher_015",
        teacherName: "최지영",
        maskedName: "박*민",
        rating: 5,
        content:
          "최지영 쌤은 미술과 요리를 정말 잘 가르쳐주시는 분이에요. 아이의 창의력을 키워주시고, 안전하게 요리 활동을 할 수 있도록 도와주셨어요. 아이가 요리를 좋아하게 되었어요!",
        date: "2024.12.12",
        region: "영등포구",
      },
      {
        id: "review_016",
        userId: "user_016",
        teacherId: "teacher_016",
        teacherName: "정현우",
        maskedName: "최*희",
        rating: 4,
        content:
          "정현우 쌤은 수학과 과학을 재미있게 가르쳐주시는 분이에요. 실험을 통해 과학의 원리를 쉽게 이해할 수 있도록 해주시고, 아이가 과학에 대한 관심을 갖게 되었어요.",
        date: "2024.12.10",
        region: "구로구",
      },
    ];
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
