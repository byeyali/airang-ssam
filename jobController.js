const { TutorJob, Member, TutorJobCategory, Category } = require("../models");
const { Op } = require("sequelize");

// 튜터 작업 목록 조회
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

    // 사용자 타입 검증
    if (!memberType || !["parents", "tutors"].includes(memberType)) {
      return res
        .status(400)
        .json({ error: "유효하지 않은 사용자 타입입니다." });
    }

    // 기본 WHERE 조건
    let whereCondition = {};

    if (memberType === "parents") {
      whereCondition.requester_id = memberId;
    } else if (memberType === "tutors") {
      whereCondition[Op.or] = [
        { status: "open" },
        { matched_tutor_id: memberId },
        { prepfered_tutor_id: memberId },
      ];
    }
    // admin은 전체 공고를 볼 수 있도록 whereCondition을 빈 객체로 유지

    // 추가 필터 조건
    if (status) {
      // tutors의 경우 Op.or 조건이 있으므로 status 필터를 조정
      if (memberType === "tutors" && whereCondition[Op.or]) {
        // tutors의 경우 status가 "open"인 경우만 필터링
        if (status !== "open") {
          whereCondition[Op.or] = whereCondition[Op.or].filter(
            (condition) => !condition.status || condition.status === status
          );
        }
      } else {
        whereCondition.status = status;
      }
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
        model: TutorJobCategory,
        as: "categories",
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "category_nm"],
          },
        ],
      },
    ];

    // 카테고리 ID로 필터링
    if (categoryId) {
      includeConditions[1].where = { category_id: categoryId };
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
        jobData.categories?.map((tjc) => ({
          id: tjc.category.id,
          name: tjc.category.category_nm,
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
      error: "작업 목록 조회 중 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// 특정 튜터 작업 조회
const getTutorJob = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 기본 WHERE 조건
    let whereCondition = { id };

    // 부모 사용자는 자신이 요청한 작업만 조회 가능
    if (memberType === "parents") {
      whereCondition.requester_id = memberId;
    }

    const job = await TutorJob.findOne({
      where: whereCondition,
      include: [
        {
          model: Member,
          as: "requester",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: TutorJobCategory,
          as: "categories",
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "category_nm"],
            },
          ],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ error: "작업을 찾을 수 없습니다." });
    }

    // 응답 데이터 가공
    const jobData = job.toJSON();
    jobData.categories =
      jobData.categories?.map((tjc) => ({
        id: tjc.category.id,
        name: tjc.category.category_nm,
      })) || [];

    res.json({
      success: true,
      data: jobData,
    });
  } catch (err) {
    console.error("getTutorJob 에러:", err);
    res.status(500).json({
      error: "작업 조회 중 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// 튜터 작업 상태 업데이트
const updateTutorJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 상태값 검증
    const validStatuses = ["open", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "유효하지 않은 상태값입니다." });
    }

    // 작업 조회
    const job = await TutorJob.findOne({
      where: { id },
      include: [
        {
          model: Member,
          as: "requester",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ error: "작업을 찾을 수 없습니다." });
    }

    // 권한 검증 (부모는 자신의 작업만, 튜터는 open 상태의 작업만)
    if (memberType === "parents" && job.requester_id !== memberId) {
      return res.status(403).json({ error: "작업을 수정할 권한이 없습니다." });
    }

    if (memberType === "tutors" && job.status !== "open") {
      return res
        .status(403)
        .json({ error: "이미 진행 중이거나 완료된 작업입니다." });
    }

    // 상태 업데이트
    await job.update({ status });

    res.json({
      success: true,
      message: "작업 상태가 업데이트되었습니다.",
      data: {
        id: job.id,
        status: job.status,
        updatedAt: job.updated_at,
      },
    });
  } catch (err) {
    console.error("updateTutorJobStatus 에러:", err);
    res.status(500).json({
      error: "작업 상태 업데이트 중 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = {
  getTutorJobList,
  getTutorJob,
  updateTutorJobStatus,
};
