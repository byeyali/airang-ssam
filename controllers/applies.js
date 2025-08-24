const {
  TutorJob,
  Tutor,
  Member,
  TutorApply,
  TutorContract,
} = require("../models");
const { Op } = require("sequelize");

// 매칭 요청 생성 (공고 지원)
const createJobApply = async (req, res) => {
  try {
    const tutorId = req.member.id;
    const { tutor_job_id, message } = req.body;

    // 공고가 있는지 확인
    const job = await TutorJob.findOne({
      where: {
        id: tutor_job_id,
        status: "open",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "모집 가능 공고정보가 없습니다.",
      });
    }

    // 튜터 체크 - member_id로 조회
    const tutor = await Tutor.findOne({
      where: { member_id: tutorId },
    });
    if (!tutor) {
      return res.status(403).json({
        message: "등록된 쌤이 아닙니다. 쌤 정보를 등록후에 지원해 주세요.",
      });
    }

    const existingApply = await TutorApply.findOne({
      where: {
        tutor_id: tutor.id,
        tutor_job_id: tutor_job_id,
      },
    });
    if (existingApply) {
      return res.status(400).json({
        message: "이미 지원한 공고입니다.",
      });
    }

    const newTutorApply = await TutorApply.create({
      tutor_id: tutor.id,
      tutor_job_id: tutor_job_id,
      message: message,
      apply_status: "ready",
    });

    res.status(201).json(newTutorApply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 공고의 신청내역 조회 (단일 조회)
const getJobApply = async (req, res) => {
  try {
    const { jobId } = req.params;
    const memberId = req.member.id;

    // 해당 공고가 현재 로그인한 부모의 것인지 확인
    const tutorJob = await TutorJob.findOne({
      where: { id: jobId, requester_id: memberId },
    });

    if (!tutorJob) {
      return res.status(404).json({
        success: false,
        message: "해당 공고를 찾을 수 없거나 접근 권한이 없습니다.",
      });
    }

    // 신청내역 조회 (선생님 정보 포함)
    const applications = await TutorApply.findAll({
      where: { tutor_job_id: jobId },
      include: [
        {
          model: Tutor,
          as: "Tutor",
          include: [
            {
              model: Member,
              as: "Member",
              attributes: ["name"],
            },
          ],
          attributes: [
            "id",
            "name",
            "birth_year",
            "gender",
            "school",
            "major",
            "is_graduate",
            "career_years",
            "introduction",
            "photo_path",
          ],
        },
      ],
      attributes: ["id", "apply_status", "message", "created_at"],
      order: [["created_at", "DESC"]],
    });

    // 응답 데이터 포맷팅
    const formattedApplications = applications.map((application, index) => {
      const tutor = application.Tutor;
      console.log("Tutor 데이터:", tutor);
      console.log("photo_path 값:", tutor.photo_path);
      return {
        id: application.id,
        tutorId: tutor.id,
        tutorName: tutor.name,
        birthYear: tutor.birth_year,
        gender: tutor.gender,
        school: tutor.school,
        major: tutor.major,
        isGraduate: tutor.is_graduate,
        careerYears: tutor.career_years,
        introduction: tutor.introduction,
        photo_path: tutor.photo_path,
        applyStatus: application.apply_status,
        message: application.message,
        appliedAt: application.created_at,
        rank: index + 1,
      };
    });

    res.json({
      success: true,
      data: formattedApplications,
      totalCount: formattedApplications.length,
    });
  } catch (error) {
    console.error("신청내역 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "신청내역을 조회하는 중 오류가 발생했습니다.",
    });
  }
};

// 매칭 요청 수정
const updateJobApply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const tutorId = req.member.id;

    // 신청내역 조회 및 권한 확인
    const application = await TutorApply.findOne({
      where: { id: id },
      include: [
        {
          model: Tutor,
          where: { member_id: tutorId },
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "해당 신청내역을 찾을 수 없거나 수정 권한이 없습니다.",
      });
    }

    // 신청내역 수정
    await application.update({
      message: message,
    });

    res.json({
      success: true,
      message: "신청내역이 수정되었습니다.",
    });
  } catch (error) {
    console.error("신청내역 수정 오류:", error);
    res.status(500).json({
      success: false,
      message: "신청내역을 수정하는 중 오류가 발생했습니다.",
    });
  }
};

// 계약 생성
const createContract = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    // 신청내역 조회 및 권한 확인
    const application = await TutorApply.findOne({
      where: { id: id },
      include: [
        {
          model: TutorJob,
          where: { requester_id: memberId },
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "해당 신청내역을 찾을 수 없거나 계약 권한이 없습니다.",
      });
    }

    // 계약 상태로 변경
    await application.update({
      apply_status: "contract",
    });

    // 공고 상태도 매칭 완료로 변경
    await TutorJob.update(
      {
        status: "matched",
        matched_tutor_id: application.tutor_id,
        matched_at: new Date(),
      },
      {
        where: { id: application.tutor_job_id },
      }
    );

    res.json({
      success: true,
      message: "계약이 성공적으로 생성되었습니다.",
    });
  } catch (error) {
    console.error("계약 생성 오류:", error);
    res.status(500).json({
      success: false,
      message: "계약을 생성하는 중 오류가 발생했습니다.",
    });
  }
};

const getJobApplyMessage = async (req, res) => {
  try {
    const { member_id, job_id } = req.query;
    const currentMemberId = req.member.id;

    const tutorJob = await TutorJob.findOne({
      where: {
        id: job_id,
      },
    });

    if (!tutorJob) {
      return res.status(404).json({
        success: false,
        message: "해당 공고를 찾을 수 없거나 접근 권한이 없습니다.",
      });
    }

    // member_id로 tutor_id 조회
    const tutor = await Tutor.findOne({
      where: {
        member_id: member_id,
      },
      attributes: ["id"],
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "해당 선생님 정보를 찾을 수 없습니다.",
      });
    }

    // 매칭 요청 메시지 조회 (최신의 마지막 메시지만 반환)
    const matchingMessage = await TutorApply.findOne({
      where: {
        tutor_id: tutor.id,
        tutor_job_id: job_id,
      },
      attributes: ["id", "message", "apply_status", "created_at"],
      include: [
        {
          model: Tutor,
          as: "Tutor",
          attributes: ["name"],
        },
      ],
      order: [["created_at", "DESC"]], // 최신순으로 정렬하여 마지막 메시지 반환
    });

    if (!matchingMessage) {
      return res.status(404).json({
        success: false,
        message: "해당 매칭 요청 메시지를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: matchingMessage,
    });
  } catch (error) {
    console.error("매칭 요청 메시지 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "매칭 요청 메시지를 조회하는 중 오류가 발생했습니다.",
    });
  }
};

const updateApplyStatus = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applyId = req.params.id;
    const loginId = req.member.id; // 로그인한 사용자 ID
    const { status } = req.body;

    // 1. 공고 데이터 존재여부 확인 - tb_tutor_job.id and status === "open"
    const tutorJob = await TutorJob.findOne({
      where: {
        id: jobId,
        status: "open",
      },
    });

    if (!tutorJob) {
      return res.status(404).json({
        success: false,
        message: "해당 공고를 찾을 수 없거나 모집 상태가 아닙니다.",
      });
    }

    // 3. 지원 데이터 존재여부 확인 - tb_tutor_apply.id and status === "accept"
    const tutorApply = await TutorApply.findOne({
      where: {
        id: applyId,
        tutor_job_id: jobId,
        apply_status: "accept",
      },
    });

    if (!tutorApply) {
      return res.status(404).json({
        success: false,
        message: "해당 신청내역을 찾을 수 없거나 수락 상태가 아닙니다.",
      });
    }

    // 4. 권한 확인
    // accept/reject: 공고 작성자만 가능
    // confirm: 신청자만 가능
    if (status === "confirm") {
      // 신청자의 member_id를 찾기 위해 Tutor 테이블 조회
      const tutor = await Tutor.findOne({
        where: { id: tutorApply.tutor_id },
      });

      if (!tutor || tutor.member_id !== loginId) {
        return res.status(403).json({
          success: false,
          message: "해당 신청의 신청자만 계약을 진행할 수 있습니다.",
        });
      }
    } else {
      if (tutorJob.requester_id !== loginId) {
        return res.status(403).json({
          success: false,
          message: "해당 공고의 작성자만 신청 상태를 변경할 수 있습니다.",
        });
      }
    }

    // 5. tb_tutor_apply status 변경
    await tutorApply.update({
      apply_status: status,
    });

    // 6. 만약 confirm인 경우, 공고 상태도 변경하고 계약 데이터 생성
    if (status === "confirm") {
      await TutorJob.update(
        {
          status: "matched",
          matched_tutor_id: tutorApply.tutor_id,
          matched_at: new Date(),
        },
        {
          where: { id: jobId },
        }
      );

      // 계약 데이터 생성
      await TutorContract.create({
        apply_id: tutorApply.id,
        job_id: jobId,
        member_id: tutorJob.requester_id,
        contract_title: `${tutorJob.title} 계약`,
        tutor_job_id: jobId,
        tutor_id: tutorApply.tutor_id,
        requester_id: tutorJob.requester_id,
        contract_status: "active",
        start_date: tutorJob.start_date,
        end_date: tutorJob.end_date,
        payment: tutorJob.payment,
        payment_cycle: tutorJob.payment_cycle,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    res.json({
      success: true,
      message: "신청 상태가 성공적으로 변경되었습니다.",
      data: {
        applyId: tutorApply.id,
        status: status,
        updatedAt: tutorApply.updated_at,
      },
    });
  } catch (err) {
    console.error("신청 상태 변경 오류:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// TUTOR 공고 매칭내역 조회
const getJobApplyMatch = async (req, res) => {
  try {
    const memberId = req.member.id;

    // tb_tutor.member_id 기준으로 id=tutor_id 조회
    const tutor = await Tutor.findOne({
      where: { member_id: memberId },
    });

    if (!tutor) {
      return res.status(403).json({
        success: false,
        message: "등록된 쌤이 아닙니다.",
      });
    }

    // tutor_id 기준으로 tb_tutor_apply.status = "accept" 인건 조회
    const acceptedApplications = await TutorApply.findAll({
      where: {
        tutor_id: tutor.id,
        apply_status: "accept",
      },
      include: [
        {
          model: TutorJob,
          as: "TutorJob",
          include: [
            {
              model: Member,
              as: "requester",
              attributes: ["name", "email", "cell_phone"],
            },
          ],
        },
        {
          model: Tutor,
          as: "Tutor",
          attributes: [
            "name",
            "birth_year",
            "gender",
            "school",
            "major",
            "is_graduate",
            "career_years",
            "introduction",
          ],
        },
      ],
      order: [["created_at", "DESC"]], // 최신순으로 정렬
    });

    // 응답 데이터 포맷팅
    const formattedApplications = acceptedApplications.map((application) => {
      return {
        id: application.id,
        jobId: application.tutor_job_id,
        tutorId: application.tutor_id,
        applyStatus: application.apply_status,
        message: application.message,
        createdAt: application.created_at,
        updatedAt: application.updated_at,

        // 공고 정보
        jobTitle: application.TutorJob.title,
        jobTarget: application.TutorJob.target,
        jobObjective: application.TutorJob.objective,
        jobWorkType: application.TutorJob.work_type,
        jobStartDate: application.TutorJob.start_date,
        jobEndDate: application.TutorJob.end_date,
        jobStartTime: application.TutorJob.start_time,
        jobEndTime: application.TutorJob.end_time,
        jobWorkDay: application.TutorJob.work_day,
        jobWorkPlace: application.TutorJob.work_place,
        jobWorkPlaceAddress: application.TutorJob.work_place_address,
        jobPayment: application.TutorJob.payment,
        jobNegotiable: application.TutorJob.negotiable,
        jobPaymentCycle: application.TutorJob.payment_cycle,
        jobDescription: application.TutorJob.description,
        jobEtc: application.TutorJob.etc,
        jobStatus: application.TutorJob.status,

        // 부모 정보
        parentName: application.TutorJob.requester.name,
        parentEmail: application.TutorJob.requester.email,
        parentPhone: application.TutorJob.requester.cell_phone,

        // 선생님 정보
        tutorName: application.Tutor.name,
        tutorBirthYear: application.Tutor.birth_year,
        tutorGender: application.Tutor.gender,
        tutorSchool: application.Tutor.school,
        tutorMajor: application.Tutor.major,
        tutorIsGraduate: application.Tutor.is_graduate,
        tutorCareerYears: application.Tutor.career_years,
        tutorIntroduction: application.Tutor.introduction,
      };
    });

    res.json({
      success: true,
      data: formattedApplications,
      totalCount: formattedApplications.length,
    });
  } catch (error) {
    console.error("신청내역 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "신청내역을 조회하는 중 오류가 발생했습니다.",
    });
  }
};

module.exports = {
  createJobApply,
  getJobApply,
  updateJobApply,
  createContract,
  getJobApplyMessage,
  updateApplyStatus,
  getJobApplyMatch,
};
