const addTutorJobCategory = async (req, res) => {
  try {
    console.log("=== addTutorJobCategory 백엔드 디버그 ===");
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);

    // 라우트에서 :id로 설정되어 있으므로 jobId 대신 id 사용
    const jobId = req.params.id; // req.params.jobId에서 req.params.id로 변경
    const categories = req.body.categories;

    console.log("추출된 jobId:", jobId, "타입:", typeof jobId);
    console.log("추출된 categories:", categories, "타입:", typeof categories);
    console.log("categories 배열 여부:", Array.isArray(categories));

    // jobId 유효성 검사
    if (!jobId || jobId === undefined || jobId === null) {
      console.log("jobId가 유효하지 않음");
      return res.status(400).json({ message: "jobId가 유효하지 않습니다." });
    }

    if (!Array.isArray(categories)) {
      console.log("categories가 배열이 아님");
      return res.status(400).json({ message: "카테고리를 선택하세요" });
    }

    // TutorJobCategory 모델 확인
    console.log("TutorJobCategory 모델:", typeof TutorJobCategory);
    if (!TutorJobCategory) {
      console.log("TutorJobCategory 모델이 정의되지 않음");
      return res.status(500).json({ message: "TutorJobCategory 모델 오류" });
    }

    const result = [];
    for (const categoryId of categories) {
      console.log(
        "처리 중인 categoryId:",
        categoryId,
        "타입:",
        typeof categoryId
      );

      try {
        const category = await TutorJobCategory.findOne({
          where: {
            tutor_job_id: jobId,
            category_id: categoryId,
          },
        });

        console.log("기존 카테고리 조회 결과:", category);

        if (!category) {
          console.log("새 카테고리 생성 시도...");
          const newCategory = await TutorJobCategory.create({
            tutor_job_id: jobId,
            category_id: categoryId,
          });
          console.log("새 카테고리 생성 성공:", newCategory);
          result.push(newCategory);
        } else {
          console.log("기존 카테고리 존재, 건너뜀");
        }
      } catch (categoryError) {
        console.error("개별 카테고리 처리 중 오류:", categoryError);
        console.error("오류 스택:", categoryError.stack);
        throw categoryError;
      }
    }

    console.log("최종 결과:", result);
    res
      .status(200)
      .json({ message: "튜터 공지 카테고리 정보 등록완료", added: result });
  } catch (err) {
    console.error("=== addTutorJobCategory 전체 오류 ===");
    console.error("오류 메시지:", err.message);
    console.error("오류 스택:", err.stack);
    console.error("오류 객체:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
      details: "백엔드 로그를 확인하세요",
    });
  }
};
