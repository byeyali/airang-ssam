const getTutorJobList = async (req, res) => {
  try {
    // 쿼리 파라미터에서 member_id와 member_type 추출
    const memberId = req.query.member_id;
    const memberType = req.query.member_type;

    console.log("memberId", memberId);
    console.log("memberType", memberType);

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

    // 기본 WHERE 조건
    let whereCondition = {};

    if (memberType === "parents") {
      whereCondition.requester_id = memberId;
    } else if (memberType === "tutor") {
      // 선생님의 경우 지역 기반 필터링
      try {
        // 먼저 선생님의 지역 정보를 조회
        const tutorRegions = await TutorRegion.findAll({
          where: { tutor_id: memberId },
          attributes: ["region_name"],
        });

        if (tutorRegions.length === 0) {
          // 선생님이 지역을 등록하지 않은 경우 빈 결과 반환
          return res.json({
            success: true,
            data: [],
            pagination: {
              currentPage: parseInt(page),
              totalPages: 0,
              totalCount: 0,
              limit: parseInt(limit),
              hasNextPage: false,
              hasPrevPage: false,
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
            message:
              "등록된 지역이 없습니다. 쌤 프로필에서 활동 가능 지역을 등록해주세요.",
          });
        }

        // 선생님이 등록한 지역들
        const regionNames = tutorRegions.map((region) => region.region_name);

        // 기본 조건 설정
        whereCondition = {
          $or: [
            { status: "open" },
            { matched_tutor_id: memberId },
            { preferred_tutor_id: memberId },
          ],
          work_place: {
            $in: regionNames,
          },
        };
      } catch (regionError) {
        console.error("선생님 지역 정보 조회 오류:", regionError);
        return res.status(500).json({
          error: "선생님 지역 정보 조회 중 오류가 발생했습니다.",
        });
      }
    }
    // admin은 전체 공고를 볼 수 있도록 whereCondition을 빈 객체로 유지

    // 추가 필터 조건
    if (status) {
      if (memberType === "tutor" && whereCondition.$or) {
        // tutor의 경우 status가 "open"인 경우만 필터링
        if (status !== "open") {
          whereCondition.$or = whereCondition.$or.filter(
            (condition) => !condition.status || condition.status === status
          );
        }
      } else {
        whereCondition.status = status;
      }
    }

    if (startDate && endDate) {
      whereCondition.created_at = {
        $between: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereCondition.created_at = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      whereCondition.created_at = {
        $lte: new Date(endDate),
      };
    }

    if (searchKeyword) {
      const searchCondition = {
        $or: [
          { title: { $like: `%${searchKeyword}%` } },
          { description: { $like: `%${searchKeyword}%` } },
        ],
      };

      if (Object.keys(whereCondition).length > 0) {
        whereCondition = {
          $and: [whereCondition, searchCondition],
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

    // 데이터 조회 (카테고리 정보 제외)
    const { count, rows: jobList } = await TutorJob.findAndCountAll({
      where: whereCondition,
      include: includeConditions,
      order: orderCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

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
