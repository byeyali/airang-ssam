const fs = require("fs");
const { error } = require("console");
const { TutorJob, Member, TutorJobCategory, Category } = require("../models");
const { Op, DATE } = require("sequelize");

const createTutorJob = async (req, res) => {
  try {
    const requesterId = req.member.id;
    const { title, ...etc } = req.body;
    const tutorJob = { title, ...etc };

    // 요청자가 부모 회원이 아닐 경우 에러 RETURN
    const member = await Member.findOne({
      where: { id: requesterId, member_type: "parents" },
    });

    if (!member) {
      return res.status(404).json({
        message: "요청자가 부모 회원이 아닙니다.",
      });
    }

    const newTutorJob = await TutorJob.create({
      title: tutorJob.title,
      requester_id: requesterId, // 보호자
      target: tutorJob.target,
      objective: tutorJob.objective,
      work_type: tutorJob.work_type,
      start_date: tutorJob.start_date,
      end_date: tutorJob.end_date,
      start_time: tutorJob.start_time,
      end_time: tutorJob.end_time,
      work_day: tutorJob.work_day,
      work_place: tutorJob.work_place, // 시/도 구/군 지역
      work_place_address: tutorJob.work_place_address,
      payment: tutorJob.payment,
      negotiable: tutorJob.negotiable,
      payment_cycle: tutorJob.payment_cycle,
      preferred_tutor_id: tutorJob.preferred_tutor_id,
      tutor_age_fr: tutorJob.tutor_age_fr,
      tutor_age_to: tutorJob.tutor_age_to,
      tutor_sex: tutorJob.tutor_sex,
      description: tutorJob.description,
      etc: tutorJob.etc,
    });

    res.status(201).json(newTutorJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorJobList = async (req, res) => {
  try {
    // 쿼리 파라미터에서 member_id와 member_type 추출
    const memberId = req.query.member_id;
    const memberType = req.query.member_type;

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
    if (!memberType || !["parents", "tutor", "admin"].includes(memberType)) {
      return res
        .status(400)
        .json({ error: "유효하지 않은 사용자 타입입니다." });
    }

    // 디버깅 로그 추가
    console.log("=== getTutorJobList 디버깅 ===");
    console.log("memberId:", memberId);
    console.log("memberType:", memberType);

    // 기본 WHERE 조건
    let whereCondition = {};

    if (memberType === "parents") {
      whereCondition.requester_id = memberId;
      console.log("parents 조건 적용:", whereCondition);
    } else if (memberType === "tutor") {
      whereCondition[Op.or] = [
        { status: "open" },
        { matched_tutor_id: memberId },
        { preferred_tutor_id: memberId },
      ];
      console.log("tutor 조건 적용:", JSON.stringify(whereCondition, null, 2));
    } else if (memberType === "admin") {
      console.log("admin 조건 적용: 전체 조회");
    }
    // admin은 전체 공고를 볼 수 있도록 whereCondition을 빈 객체로 유지

    // 추가 필터 조건
    if (status) {
      // tutor의 경우 Op.or 조건이 있으므로 status 필터를 조정
      if (memberType === "tutor" && whereCondition[Op.or]) {
        // tutor의 경우 status가 "open"인 경우만 필터링
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

    // 임시로 카테고리 정보 없이 기본 데이터만 조회
    const includeConditions = [
      {
        model: Member,
        as: "requester",
        attributes: ["id", "name", "email"],
      },
    ];

    // 최종 WHERE 조건 로그
    console.log(
      "최종 whereCondition:",
      JSON.stringify(whereCondition, null, 2)
    );

    // 데이터 조회 (카테고리 정보 제외)
    const { count, rows: jobList } = await TutorJob.findAndCountAll({
      where: whereCondition,
      include: includeConditions,
      order: orderCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    console.log("조회된 데이터 개수:", count);

    // 응답 데이터 가공
    const processedJobList = jobList.map((job) => {
      const jobData = job.toJSON();

      // 카테고리 정보는 빈 배열로 설정 (나중에 별도 조회)
      jobData.categories = [];

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

const getTutorJobById = async (req, res) => {
  try {
    console.log("=== getTutorJobById 시작 ===");
    console.log("요청된 ID:", req.params.id);
    console.log("사용자 정보:", req.member);

    const memberId = req.member.id;
    const memberType = req.member.member_type;
    const jobId = req.params.id;

    // 권한 검증: 본인의 공고만 조회 가능
    if (memberType === "parents") {
      // 부모는 자신이 작성한 공고만 조회 가능
      const job = await TutorJob.findOne({
        where: { id: jobId, requester_id: memberId },
        include: [
          {
            model: Member,
            as: "requester",
            attributes: ["id", "name", "email", "cell_phone"],
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
        return res
          .status(404)
          .json({ message: "도와줘요 쌤 공고가 없습니다." });
      }

      const jobData = job.toJSON();
      console.log("카테고리 개수:", jobData.categories?.length || 0);

      jobData.categories =
        jobData.categories?.map((cat) => ({
          id: cat.id,
          name: cat.category_nm,
          category_cd: cat.category_cd,
          grp_cd: cat.grp_cd,
        })) || [];

      console.log("최종 응답 데이터 준비 완료");
      return res.json(jobData);
    } else {
      return res.status(403).json({ error: "공고 조회 권한이 없습니다." });
    }
  } catch (err) {
    console.error("=== getTutorJobById 에러 ===");
    console.error("에러 메시지:", err.message);
    console.error("에러 스택:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const updateTutorJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 권한 검증: 부모만 자신의 공고를 수정할 수 있음
    if (memberType !== "parents") {
      return res.status(403).json({ error: "공고 수정 권한이 없습니다." });
    }

    // 공고 존재 여부 및 소유권 확인
    const existingJob = await TutorJob.findOne({
      where: { id: jobId, requester_id: memberId },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "수정할 공고를 찾을 수 없습니다." });
    }

    const tobeTutorJob = req.body;

    const updatedData = {};
    // 변경사항 비교
    if (existingJob.title !== tobeTutorJob.title)
      updatedData.title = tobeTutorJob.title;
    if (existingJob.target !== tobeTutorJob.target)
      updatedData.target = tobeTutorJob.target;
    if (existingJob.objective !== tobeTutorJob.objective)
      updatedData.objective = tobeTutorJob.objective;
    if (existingJob.work_type !== tobeTutorJob.work_type)
      updatedData.work_type = tobeTutorJob.work_type;
    if (existingJob.start_date !== tobeTutorJob.start_date)
      updatedData.start_date = tobeTutorJob.start_date;
    if (existingJob.end_date !== tobeTutorJob.end_date)
      updatedData.end_date = tobeTutorJob.end_date;
    if (existingJob.start_time !== tobeTutorJob.start_time)
      updatedData.start_time = tobeTutorJob.start_time;
    if (existingJob.end_time !== tobeTutorJob.end_time)
      updatedData.end_time = tobeTutorJob.end_time;
    if (existingJob.work_day !== tobeTutorJob.work_day)
      updatedData.work_day = tobeTutorJob.work_day;
    if (existingJob.work_place !== tobeTutorJob.work_place)
      updatedData.work_place = tobeTutorJob.work_place;
    if (existingJob.work_place_address !== tobeTutorJob.work_place_address)
      updatedData.work_place_address = tobeTutorJob.work_place_address;
    if (existingJob.payment !== tobeTutorJob.payment)
      updatedData.payment = tobeTutorJob.payment;
    if (existingJob.negotiable !== tobeTutorJob.negotiable)
      updatedData.negotiable = tobeTutorJob.negotiable;
    if (existingJob.payment_cycle !== tobeTutorJob.payment_cycle)
      updatedData.payment_cycle = tobeTutorJob.payment_cycle;
    if (existingJob.preferred_tutor_id !== tobeTutorJob.preferred_tutor_id)
      updatedData.preferred_tutor_id = tobeTutorJob.preferred_tutor_id;
    if (existingJob.tutor_age_fr !== tobeTutorJob.tutor_age_fr)
      updatedData.tutor_age_fr = tobeTutorJob.tutor_age_fr;
    if (existingJob.tutor_age_to !== tobeTutorJob.tutor_age_to)
      updatedData.tutor_age_to = tobeTutorJob.tutor_age_to;
    if (existingJob.tutor_sex !== tobeTutorJob.tutor_sex)
      updatedData.tutor_sex = tobeTutorJob.tutor_sex;
    if (existingJob.description !== tobeTutorJob.description)
      updatedData.description = tobeTutorJob.description;
    if (existingJob.etc !== tobeTutorJob.etc)
      updatedData.etc = tobeTutorJob.etc;

    const [updated] = await TutorJob.update(updatedData, {
      where: { id: jobId },
    });

    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 업데이트 후 새 데이터 조회
    const updatedJob = await TutorJob.findOne({
      where: { id: jobId },
    });

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTutorJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;

    const { status, matched_tutor_id, matched_at } = req.body;

    // TUTOR 공고 현재 상태 조회
    const asisStatus = await TutorJob.findOne({
      where: { id: jobId },
    });
    if (!asisStatus) {
      return res.status(404).json({
        message: "도와줘요~쌤 공고를 찾을 수 없습니다.",
      });
    }

    const updatedData = {};
    if (status === "matched") {
      updatedData.status = status;
      updatedData.matched_tutor_id = matched_tutor_id;
      updatedData.matched_at = new Date();
    } else if (asisStatus.status !== "closed") {
      updatedData.status = status;
    }

    const [updated] = await TutorJob.update(updatedData, {
      where: { id: jobId },
    });

    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 업데이트 후 새 데이터 조회
    const updatedStatus = await TutorJob.findOne({
      where: { id: jobId },
    });

    res.json(updatedStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 권한 검증: 부모만 자신의 공고를 삭제할 수 있음
    if (memberType !== "parents") {
      return res.status(403).json({ error: "공고 삭제 권한이 없습니다." });
    }

    // 공고 존재 여부 및 소유권 확인
    const job = await TutorJob.findOne({
      where: { id: jobId, requester_id: memberId },
    });

    if (!job) {
      return res.status(404).json({ message: "삭제할 공고가 없습니다." });
    }

    // 공고상태 확인
    if (job.status !== "registered") {
      return res.status(403).json({
        message: "도와줘요~쌤 공고를 삭제할 수 없는 상태입니다.",
      });
    }

    const deletedJob = await TutorJob.destroy({
      where: { id: jobId },
    });

    if (!deletedJob) {
      return res.status(404).json({ message: "삭제할 공고가 없습니다." });
    } else {
      res.json({ message: "공고가 삭제되었습니다." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTutorJobCategory = async (req, res) => {
  try {
    const jobId = req.params.id;
    const memberId = req.member.id;
    const memberType = req.member.member_type;
    const categories = req.body.categories;

    // 권한 검증: 부모만 자신의 공고에 카테고리를 추가할 수 있음
    if (memberType !== "parents") {
      return res.status(403).json({ error: "카테고리 추가 권한이 없습니다." });
    }

    // 공고 존재 여부 및 소유권 확인
    const existingJob = await TutorJob.findOne({
      where: { id: jobId, requester_id: memberId },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "공고를 찾을 수 없습니다." });
    }

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "카테고리를 선택하세요" });
    }

    const result = [];
    for (const categoryId of categories) {
      const category = await TutorJobCategory.findOne({
        where: {
          tutor_job_id: jobId,
          category_id: categoryId,
        },
      });

      if (!category) {
        const newCategory = await TutorJobCategory.create({
          tutor_job_id: jobId,
          category_id: categoryId,
        });
        result.push(newCategory);
      }
    }

    res
      .status(200)
      .json({ message: "튜터 공지 카테고리 정보 등록완료", added: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorJobCategory = async (req, res) => {
  try {
    const jobId = req.params.id;
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    // 권한 검증: 부모만 자신의 공고의 카테고리를 삭제할 수 있음
    if (memberType !== "parents") {
      return res.status(403).json({ error: "카테고리 삭제 권한이 없습니다." });
    }

    // 공고 존재 여부 및 소유권 확인
    const existingJob = await TutorJob.findOne({
      where: { id: jobId, requester_id: memberId },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "공고를 찾을 수 없습니다." });
    }

    const deletedCount = await TutorJobCategory.destroy({
      where: { tutor_job_id: jobId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 카테고리가 없습니다." });
    }

    return res.status(200).json({
      message: "카테고리 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTutorJob,
  updateTutorJob,
  getTutorJobList,
  getTutorJobById,
  updateTutorJobStatus,
  deleteTutorJob,
  addTutorJobCategory,
  deleteTutorJobCategory,
};
