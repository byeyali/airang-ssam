import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import "./TeacherPaymentStatus.css";

function TeacherPaymentStatus() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getAllApplications } = useApplication();

  const [paymentData, setPaymentData] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState(new Set());

  useEffect(() => {
    if (user?.type === "teacher") {
      loadTeacherPaymentData();
    }
  }, [user]);

  const loadTeacherPaymentData = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();

    // 현재 쌤의 수락된 매칭 중 계약 완료 상태만 필터링
    const teacherMatchings = allMatchings.filter(
      (m) =>
        m.teacherId === user.id &&
        m.status === "accepted" &&
        m.contractStatus === "completed"
    );

    // allApplications를 전역으로 사용할 수 있도록 설정
    window.allApplications = allApplications;

    const teacherPaymentStatus = teacherMatchings.map((matching) => {
      let application;
      if (matching.id === "matching_002") {
        application = allApplications.find((app) => app.id === "app_002");
      } else if (matching.id === "matching_003") {
        // 박민수 쌤과 박영희 부모님의 매칭을 위한 가상 application
        application = {
          id: "app_003",
          payment: "시간 당 22,000 (협의가능)",
          workingHours: "오후 2시~5시",
          type: "정기 매주 화,목,금 (주3회)",
        };
      } else if (matching.id === "matching_005") {
        // 박민수 쌤의 두 번째 매칭을 위한 가상 application
        application = {
          id: "app_005",
          payment: "시간 당 25,000 (협의가능)",
          workingHours: "오후 2시~5시",
          type: "정기 매주 화,목,금 (주3회)",
        };
      } else {
        application = allApplications.find(
          (app) => app.id === matching.applicationId
        );
      }

      // 시급 파싱 개선
      let hourlyWage = 0;
      if (application?.payment) {
        const commaMatch = application.payment.match(/\d{1,3}(?:,\d{3})*/);
        if (commaMatch) {
          hourlyWage = parseInt(commaMatch[0].replace(/,/g, ""));
        } else {
          const numberMatch = application.payment.match(/\d+/);
          if (numberMatch) {
            hourlyWage = parseInt(numberMatch[0]);
          }
        }
      }

      const workingHours = application?.workingHours || "";
      const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
      const sessionsPerWeek = calculateSessionsPerWeek(application?.type || "");
      const totalHours = hoursPerSession * sessionsPerWeek * 4;
      const monthlyEarnings = hourlyWage * totalHours;
      const contractMonths = 5;
      const teacherTotalEarnings = monthlyEarnings * contractMonths;

      // 새로운 수수료 시스템 적용
      const baseAmount = teacherTotalEarnings;
      const teacherCommission = baseAmount * 0.05;
      const teacherActualEarnings = baseAmount - teacherCommission;

      // 실제 수업 완료 데이터 생성 (시뮬레이션)
      const completedLessons = generateCompletedLessons(
        matching.createdAt,
        contractMonths,
        sessionsPerWeek,
        hoursPerSession,
        hourlyWage,
        matching.id
      );

      return {
        matchingId: matching.id,
        parentName: matching.parentName,
        teacherName: matching.teacherName,
        expectedTotalAmount: teacherActualEarnings, // 예상 총수당
        monthlyAmount: teacherActualEarnings / contractMonths,
        contractStatus: matching.contractStatus,
        completedLessons: completedLessons,
        createdAt: matching.createdAt,
        contractMonths,
        hourlyWage,
        workingHours,
        hoursPerSession,
        sessionsPerWeek,
        totalHours,
        monthlyEarnings,
        teacherCommission,
      };
    });

    setPaymentData(teacherPaymentStatus);
  };

  // 실제 수업 완료 데이터 생성 함수
  const generateCompletedLessons = (
    contractStartDate,
    contractMonths,
    sessionsPerWeek,
    hoursPerSession,
    hourlyWage,
    matchingId
  ) => {
    const lessons = [];
    const startDate = new Date(contractStartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + contractMonths);

    const today = new Date();
    let currentDate = new Date(startDate);

    // 박민수 쌤의 경우 실제 4일치 수업 데이터 생성
    if (matchingId === "matching_003") {
      const completedDates = [
        new Date(2024, 0, 15), // 1월 15일
        new Date(2024, 0, 17), // 1월 17일
        new Date(2024, 0, 19), // 1월 19일
        new Date(2024, 0, 22), // 1월 22일
      ];

      completedDates.forEach((lessonDate, index) => {
        if (lessonDate <= today) {
          const lessonAmount = hoursPerSession * hourlyWage * 0.95; // 수수료 5% 차감
          const lessonTimes = [
            "14:00-17:00",
            "15:00-18:00",
            "14:30-17:30",
            "16:00-19:00",
          ];

          lessons.push({
            id: `lesson_${lessonDate.getTime()}`,
            date: lessonDate.toLocaleDateString("ko-KR"),
            time: lessonTimes[index],
            hours: hoursPerSession,
            amount: lessonAmount,
            status: "완료",
            paymentDate: new Date(
              lessonDate.getTime() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("ko-KR"), // 수업 후 1주일 후 지급
          });
        }
      });

      return lessons.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // 다른 쌤들의 경우 기존 로직 사용
    while (currentDate <= today && currentDate <= endDate) {
      // 주간 수업 횟수에 따라 수업 완료 여부 결정
      const weekNumber = Math.floor(
        (currentDate - startDate) / (7 * 24 * 60 * 60 * 1000)
      );
      const lessonsThisWeek = Math.min(
        sessionsPerWeek,
        Math.floor(Math.random() * sessionsPerWeek) + 1
      );

      for (let i = 0; i < lessonsThisWeek; i++) {
        const lessonDate = new Date(currentDate);
        lessonDate.setDate(
          lessonDate.getDate() + i * Math.floor(7 / sessionsPerWeek)
        );

        if (lessonDate <= today && lessonDate <= endDate) {
          const lessonAmount = hoursPerSession * hourlyWage * 0.95; // 수수료 5% 차감

          lessons.push({
            id: `lesson_${lessonDate.getTime()}`,
            date: lessonDate.toLocaleDateString("ko-KR"),
            time: `${Math.floor(Math.random() * 12) + 9}:00-${
              Math.floor(Math.random() * 12) + 9 + hoursPerSession
            }:00`,
            hours: hoursPerSession,
            amount: lessonAmount,
            status: "완료",
            paymentDate: new Date(
              lessonDate.getTime() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("ko-KR"), // 수업 후 1주일 후 지급
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return lessons.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculateHoursFromWorkingHours = (workingHours) => {
    if (!workingHours) return 0;
    const match = workingHours.match(/(\d+)시~(\d+)시/);
    if (match) {
      const startHour = parseInt(match[1]);
      const endHour = parseInt(match[2]);
      return endHour - startHour;
    }
    return 3;
  };

  const calculateSessionsPerWeek = (type) => {
    if (!type) return 0;
    if (type.includes("주5회")) return 5;
    if (type.includes("주3회")) return 3;
    if (type.includes("주2회")) return 2;
    if (type.includes("주1회")) return 1;
    return 2;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const handleShowDetails = (index) => {
    const newExpanded = new Set(expandedDetails);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDetails(newExpanded);
  };

  if (user?.type !== "teacher") {
    return (
      <div className="teacher-payment-status-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>선생님만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-payment-status-page">
      <div className="page-container">
        <div className="page-header">
          <h1>내 수당 현황</h1>
          <p>{user.name} 쌤의 실제 수업 완료 수당을 확인하세요</p>
        </div>

        {/* 수당 통계 요약 */}
        <div className="payment-summary-cards">
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h4>예상 총수당</h4>
              <p>
                {formatCurrency(
                  paymentData.reduce(
                    (sum, item) => sum + item.expectedTotalAmount,
                    0
                  )
                )}
                원
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">✅</div>
            <div className="summary-content">
              <h4>완료된 수업</h4>
              <p>
                {paymentData.reduce(
                  (sum, item) => sum + item.completedLessons.length,
                  0
                )}
                건
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💵</div>
            <div className="summary-content">
              <h4>실제 받은 수당</h4>
              <p>
                {formatCurrency(
                  paymentData.reduce(
                    (sum, item) =>
                      sum +
                      item.completedLessons.reduce(
                        (lessonSum, lesson) => lessonSum + lesson.amount,
                        0
                      ),
                    0
                  )
                )}
                원
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⏰</div>
            <div className="summary-content">
              <h4>이번 달 예상 수당</h4>
              <p>
                {formatCurrency(
                  paymentData.reduce((sum, item) => {
                    const thisMonth = new Date().getMonth();
                    const thisYear = new Date().getFullYear();

                    // 매칭 ID에 따른 application 정보 가져오기
                    let application;
                    if (item.matchingId === "matching_002") {
                      application = window.allApplications.find(
                        (app) => app.id === "app_002"
                      );
                    } else if (item.matchingId === "matching_003") {
                      application = {
                        id: "app_003",
                        payment: "시간 당 22,000 (협의가능)",
                        workingHours: "오후 2시~5시",
                        type: "정기 매주 화,목,금 (주3회)",
                      };
                    } else if (item.matchingId === "matching_005") {
                      application = {
                        id: "app_005",
                        payment: "시간 당 25,000 (협의가능)",
                        workingHours: "오후 2시~5시",
                        type: "정기 매주 화,목,금 (주3회)",
                      };
                    }

                    if (!application) return sum;

                    const sessionsPerWeek = calculateSessionsPerWeek(
                      application.type || ""
                    );
                    const hoursPerSession = calculateHoursFromWorkingHours(
                      application.workingHours || ""
                    );

                    // 시급 파싱
                    let hourlyWage = 0;
                    if (application?.payment) {
                      const commaMatch =
                        application.payment.match(/\d{1,3}(?:,\d{3})*/);
                      if (commaMatch) {
                        hourlyWage = parseInt(commaMatch[0].replace(/,/g, ""));
                      } else {
                        const numberMatch = application.payment.match(/\d+/);
                        if (numberMatch) {
                          hourlyWage = parseInt(numberMatch[0]);
                        }
                      }
                    }

                    // 이번 달의 주 수 계산
                    const daysInMonth = new Date(
                      thisYear,
                      thisMonth + 1,
                      0
                    ).getDate();
                    const weeksInMonth = Math.ceil(daysInMonth / 7);

                    // 이번 달 예상 수업 횟수 (주당 수업 횟수 × 이번 달 주 수)
                    const expectedLessonsThisMonth =
                      sessionsPerWeek * weeksInMonth;

                    // 이번 달 예상 수당 (수업당 수당 × 예상 수업 횟수)
                    const lessonAmount = hoursPerSession * hourlyWage * 0.95; // 수수료 5% 차감
                    const expectedMonthlyEarnings =
                      lessonAmount * expectedLessonsThisMonth;

                    return sum + expectedMonthlyEarnings;
                  }, 0)
                )}
                원
              </p>
            </div>
          </div>
        </div>

        {/* 수당 현황 테이블 */}
        <div className="payment-table">
          <div className="table-header">
            <div className="table-cell">부모님</div>
            <div className="table-cell">예상 총수당</div>
            <div className="table-cell">완료된 수업</div>
            <div className="table-cell">실제 받은 수당</div>
            <div className="table-cell">계약 상태</div>
            <div className="table-cell">상세</div>
          </div>

          {paymentData.map((payment, index) => (
            <div key={index}>
              <div className="table-row">
                <div className="table-cell">{payment.parentName}</div>
                <div className="table-cell">
                  {formatCurrency(payment.expectedTotalAmount)}원
                  <br />
                  <small>계약 기간: {payment.contractMonths}개월</small>
                </div>
                <div className="table-cell">
                  {payment.completedLessons.length}건
                  <br />
                  <small>
                    총{" "}
                    {payment.completedLessons.reduce(
                      (sum, lesson) => sum + lesson.hours,
                      0
                    )}
                    시간
                  </small>
                </div>
                <div className="table-cell">
                  {formatCurrency(
                    payment.completedLessons.reduce(
                      (sum, lesson) => sum + lesson.amount,
                      0
                    )
                  )}
                  원
                </div>
                <div className="table-cell">
                  <span className={`contract-status ${payment.contractStatus}`}>
                    {payment.contractStatus === "progress" && "계약 진행중"}
                    {payment.contractStatus === "completed" && "계약 완료"}
                  </span>
                </div>
                <div className="table-cell">
                  <button
                    className="detail-button"
                    onClick={() => handleShowDetails(index)}
                  >
                    {expandedDetails.has(index) ? "접기" : "상세보기"}
                  </button>
                </div>
              </div>

              {/* 상세 정보 */}
              {expandedDetails.has(index) && (
                <div className="detail-row">
                  <div className="detail-content">
                    <h4>수업 상세 정보</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">시급:</span>
                        <span className="detail-value">
                          {formatCurrency(payment.hourlyWage)}원/시간
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">수업 시간:</span>
                        <span className="detail-value">
                          {payment.hoursPerSession}시간/회
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">주간 수업:</span>
                        <span className="detail-value">
                          {payment.sessionsPerWeek}회/주
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">수수료:</span>
                        <span className="detail-value">
                          5% (수업료에서 차감)
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">실제 시급:</span>
                        <span className="detail-value">
                          {formatCurrency(payment.hourlyWage * 0.95)}원/시간
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">계약 기간:</span>
                        <span className="detail-value">
                          {payment.contractMonths}개월
                        </span>
                      </div>
                    </div>

                    <div className="completed-lessons">
                      <h5>완료된 수업 내역</h5>
                      <div className="lessons-grid">
                        {payment.completedLessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="lesson-card">
                            <div className="lesson-header">
                              <span className="lesson-date">{lesson.date}</span>
                              <span className="lesson-status">
                                {lesson.status}
                              </span>
                            </div>
                            <div className="lesson-info">
                              <div className="lesson-time">{lesson.time}</div>
                              <div className="lesson-hours">
                                {lesson.hours}시간
                              </div>
                              <div className="lesson-amount">
                                {formatCurrency(lesson.amount)}원
                              </div>
                              <div className="lesson-payment-date">
                                지급일: {lesson.paymentDate}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherPaymentStatus;
