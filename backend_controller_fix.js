const { TutorJob, Member, TutorJobCategory, Category } = require("../models");
const { Op } = require("sequelize");

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

const updateTutorJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 권한 확인 (부모만 자신의 공고를 수정할 수 있음)
    if (memberType !== "parents") {
      return res.status(403).json({ error: "공고 수정 권한이 없습니다." });
    }

    // 기존 공고 조회
    const existingJob = await TutorJob.findOne({
      where: {
        id: jobId,
        requester_id: memberId, // 자신의 공고만 수정 가능
      },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "수정할 공고를 찾을 수 없습니다." });
    }

    // 업데이트할 데이터 준비
    const updateData = {
      title: req.body.title,
      objective: req.body.objective,
      work_type: req.body.work_type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      work_day: req.body.work_day,
      work_place: req.body.work_place,
      work_place_address: req.body.work_place_address,
      payment: req.body.payment,
      negotiable: req.body.negotiable,
      payment_cycle: req.body.payment_cycle,
      preferred_tutor_id: req.body.preferred_tutor_id,
      tutor_age_fr: req.body.tutor_age_fr,
      tutor_age_to: req.body.tutor_age_to,
      tutor_sex: req.body.tutor_sex,
      description: req.body.description,
      etc: req.body.etc,
      target: req.body.target,
    };

    // undefined 값 제거
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // 공고 업데이트
    await existingJob.update(updateData);

    // 업데이트된 공고 조회
    const updatedJob = await TutorJob.findByPk(jobId);

    res.json({
      success: true,
      message: "공고가 성공적으로 수정되었습니다.",
      data: updatedJob,
    });
  } catch (err) {
    console.error("updateTutorJob 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorJobCategory = async (req, res) => {
  try {
    const jobId = req.params.id;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 권한 확인 (부모만 자신의 공고를 수정할 수 있음)
    if (memberType !== "parents") {
      return res.status(403).json({ error: "공고 수정 권한이 없습니다." });
    }

    // 공고 존재 및 권한 확인
    const existingJob = await TutorJob.findOne({
      where: {
        id: jobId,
        requester_id: memberId,
      },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "공고를 찾을 수 없습니다." });
    }

    // 해당 공고의 모든 카테고리 삭제
    const deletedCount = await TutorJobCategory.destroy({
      where: { tutor_job_id: jobId },
    });

    res.json({
      success: true,
      message: "카테고리가 성공적으로 삭제되었습니다.",
      count: deletedCount,
    });
  } catch (err) {
    console.error("deleteTutorJobCategory 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

const getTutorJobById = async (req, res) => {
  try {
    const job = await TutorJob.findByPk(req.params.id, {
      include: [
        {
          model: Member,
          as: "requester",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] }, // 중간 테이블 속성은 제외
          attributes: ["id", "category_nm", "category_cd", "grp_cd"],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "도와줘요 쌤 공고가 없습니다." });
    } else {
      // 응답 데이터 가공
      const jobData = job.toJSON();
      jobData.categories =
        jobData.categories?.map((cat) => ({
          id: cat.id,
          name: cat.category_nm,
          category_cd: cat.category_cd,
          grp_cd: cat.grp_cd,
        })) || [];

      return res.json(jobData);
    }
  } catch (err) {
    console.error("getTutorJobById 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

const getTutorJobList = async (req, res) => {
  try {
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 쿼리 파라미터 추출
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
      status,
      startDate,
      endDate,
      categoryId,
      searchKeyword,
    } = req.query;

    // 기본 WHERE 조건
    let whereCondition = {};

    // 부모 사용자는 자신이 요청한 작업만 조회
    if (memberType === "parents") {
      whereCondition.requester_id = memberId;
    } else {
      // 튜터는 open 상태의 작업만 조회
      whereCondition.status = "open";
    }

    // 상태 필터링
    if (status && status !== "all") {
      whereCondition.status = status;
    }

    if (startDate && endDate) {
      whereCondition.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereCondition.created_at = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereCondition.created_at = {
        [Op.lte]: new Date(endDate),
      };
    }

    if (searchKeyword) {
      // 검색 조건을 Op.and로 감싸서 기존 조건과 AND 연산
      const searchCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${searchKeyword}%` } },
          { description: { [Op.like]: `%${searchKeyword}%` } },
        ],
      };

      if (Object.keys(whereCondition).length > 0) {
        whereCondition = {
          [Op.and]: [whereCondition, searchCondition],
        };
      } else {
        whereCondition = searchCondition;
      }
    }

    // 정렬 조건
    const orderCondition = [[sortBy, sortOrder.toUpperCase()]];

    // 페이지네이션
    const offset = (page - 1) * limit;

    // 카테고리 필터링을 위한 include 조건
    const includeConditions = [
      {
        model: Member,
        as: "requester",
        attributes: ["id", "name", "email"],
      },
      {
        model: Category,
        as: "categories",
        through: { attributes: [] }, // 중간 테이블 속성은 제외
        attributes: ["id", "category_nm", "category_cd", "grp_cd"],
      },
    ];

    // 카테고리 ID로 필터링
    if (categoryId) {
      includeConditions[1].where = { id: categoryId };
    }

    // 데이터 조회
    const { count, rows: jobList } = await TutorJob.findAndCountAll({
      where: whereCondition,
      include: includeConditions,
      order: orderCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // 카테고리 조인으로 인한 중복 제거
    });

    // 응답 데이터 가공
    const processedJobList = jobList.map((job) => {
      const jobData = job.toJSON();

      // 카테고리 정보 추출
      jobData.categories =
        jobData.categories?.map((cat) => ({
          id: cat.id,
          name: cat.category_nm,
          category_cd: cat.category_cd,
          grp_cd: cat.grp_cd,
        })) || [];

      return jobData;
    });

    // 페이지네이션 정보
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: processedJobList,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount: count,
        limit: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        status,
        startDate,
        endDate,
        categoryId,
        searchKeyword,
        sortBy,
        sortOrder,
      },
    });
  } catch (err) {
    console.error("getTutorJobList 에러:", err);
    res.status(500).json({
      error: "공고 목록 조회 중 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = {
  addTutorJobCategory,
  getTutorJobById,
  updateTutorJob,
  deleteTutorJobCategory,
  getTutorJobList,
};
