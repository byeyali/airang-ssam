import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import { teacherAPI } from "../../services/api";
import "./TeacherPaymentStatus.css";

// 차트 라이브러리 (실제/예상 데이터 구분)
const createBarChart = (data, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  // 실제 값과 예상 값 중 최대값 찾기
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.actualValue || 0, d.expectedValue || 0))
  );

  const barHeight = 350;
  const barWidth = 50;
  const spacing = 20;
  const totalWidth = data.length * (barWidth + spacing) - spacing;
  const startX = (container.offsetWidth - totalWidth) / 2; // 중앙 정렬

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", barHeight + 100);
  svg.style.overflow = "visible";
  svg.style.maxWidth = "100%";

  // 범례 추가
  const legend = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // 실제 데이터 범례
  const actualLegend = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  actualLegend.setAttribute("x", startX);
  actualLegend.setAttribute("y", barHeight + 50);
  actualLegend.setAttribute("width", "15");
  actualLegend.setAttribute("height", "15");
  actualLegend.setAttribute("fill", "#4a90e2");
  actualLegend.setAttribute("rx", "2");

  const actualLegendText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  actualLegendText.setAttribute("x", startX + 25);
  actualLegendText.setAttribute("y", barHeight + 62);
  actualLegendText.setAttribute("font-size", "12");
  actualLegendText.setAttribute("fill", "#333");
  actualLegendText.textContent = "실제 수당";

  // 예상 데이터 범례
  const expectedLegend = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  expectedLegend.setAttribute("x", startX + 120);
  expectedLegend.setAttribute("y", barHeight + 50);
  expectedLegend.setAttribute("width", "15");
  expectedLegend.setAttribute("height", "15");
  expectedLegend.setAttribute("fill", "#ffd700");
  expectedLegend.setAttribute("rx", "2");

  const expectedLegendText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  expectedLegendText.setAttribute("x", startX + 145);
  expectedLegendText.setAttribute("y", barHeight + 62);
  expectedLegendText.setAttribute("font-size", "12");
  expectedLegendText.setAttribute("fill", "#333");
  expectedLegendText.textContent = "예상 수당";

  legend.appendChild(actualLegend);
  legend.appendChild(actualLegendText);
  legend.appendChild(expectedLegend);
  legend.appendChild(expectedLegendText);

  data.forEach((item, index) => {
    const x = startX + index * (barWidth + spacing);

    // 예상 수당 바 (9월~12월) - 먼저 그리기
    console.log(
      `${item.label}: 예상값 = ${item.expectedValue}, 실제값 = ${item.actualValue}`
    );
    if (item.expectedValue > 0) {
      const expectedHeight =
        maxValue > 0 ? (item.expectedValue / maxValue) * barHeight : 0;
      const expectedY = barHeight - expectedHeight;

      const expectedRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      expectedRect.setAttribute("x", x);
      expectedRect.setAttribute("y", expectedY);
      expectedRect.setAttribute("width", barWidth);
      expectedRect.setAttribute("height", expectedHeight);
      expectedRect.setAttribute("fill", "#ffd700");
      expectedRect.setAttribute("rx", "3");
      expectedRect.setAttribute("opacity", "1.0");

      // 예상 수당 값
      const expectedValueText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      expectedValueText.setAttribute("x", x + barWidth / 2);
      expectedValueText.setAttribute("y", expectedY - 8);
      expectedValueText.setAttribute("text-anchor", "middle");
      expectedValueText.setAttribute("font-size", "11");
      expectedValueText.setAttribute("fill", "#b8860b");
      expectedValueText.setAttribute("font-weight", "600");
      expectedValueText.textContent = `${item.expectedValue.toLocaleString()}원`;

      svg.appendChild(expectedRect);
      svg.appendChild(expectedValueText);
    }

    // 실제 수당 바 (1월~8월) - 나중에 그리기 (위에 표시)
    if (item.actualValue > 0) {
      const actualHeight =
        maxValue > 0 ? (item.actualValue / maxValue) * barHeight : 0;
      const actualY = barHeight - actualHeight;

      const actualRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      actualRect.setAttribute("x", x);
      actualRect.setAttribute("y", actualY);
      actualRect.setAttribute("width", barWidth);
      actualRect.setAttribute("height", actualHeight);
      actualRect.setAttribute("fill", "#4a90e2");
      actualRect.setAttribute("rx", "3");

      // 실제 수당 값
      const actualValueText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      actualValueText.setAttribute("x", x + barWidth / 2);
      actualValueText.setAttribute("y", actualY - 8);
      actualValueText.setAttribute("text-anchor", "middle");
      actualValueText.setAttribute("font-size", "11");
      actualValueText.setAttribute("fill", "#4a90e2");
      actualValueText.setAttribute("font-weight", "600");
      actualValueText.textContent = `${item.actualValue.toLocaleString()}원`;

      svg.appendChild(actualRect);
      svg.appendChild(actualValueText);
    }

    // 월 라벨
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + barWidth / 2);
    text.setAttribute("y", barHeight + 30);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14");
    text.setAttribute("fill", "#333");
    text.setAttribute("font-weight", "600");
    text.textContent = item.label;

    svg.appendChild(text);
  });

  svg.appendChild(legend);
  container.appendChild(svg);
};

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

  // 차트 데이터 생성 및 렌더링
  useEffect(() => {
    if (paymentData.length > 0) {
      // 월별 수입 차트 데이터
      const monthlyData = generateMonthlyChartData();
      createBarChart(monthlyData, "monthly-chart");
    }
  }, [paymentData]);

  const loadTeacherPaymentData = async () => {
    try {
      // 실제 API 호출 (현재는 주석 처리)
      // const startDate = "2023-01-01";
      // const endDate = "2024-12-31";
      // const apiData = await teacherAPI.getTeacherPaymentData(user.id, startDate, endDate);
      // setPaymentData(apiData);

      // 현재는 하드코딩된 데이터 사용
      const allMatchings = getAllMatchingRequests();
      const allApplications = getAllApplications();

      // 현재 쌤의 수락된 매칭 중 계약 완료 상태만 필터링
      const teacherMatchings = allMatchings.filter(
        (m) =>
          m.teacherId === user.id &&
          m.status === "accepted" &&
          m.contractStatus === "completed"
      );

      // 쌤별로 다른 수당 데이터 생성
      const teacherSpecificData = generateTeacherSpecificData(user.email);

      // allApplications를 전역으로 사용할 수 있도록 설정
      window.allApplications = allApplications;

      // 쌤별 실제 데이터 사용
      const teacherLessons = teacherSpecificData;
      const paymentDataArray = [];

      if (teacherLessons.length > 0) {
        const totalEarnings = teacherLessons.reduce(
          (sum, lesson) => sum + lesson.earnings,
          0
        );

        // 쌤별로 다른 부모 정보 설정
        const parentInfo = {
          "g@abc.com": {
            name: "박영희",
            child: "박지우 (9세, 초등학교 3학년)",
          },
          "b@abc.com": {
            name: "김가정",
            child: "김민수 (8세, 초등학교 2학년)",
          },
          "f@abc.com": {
            name: "정지영",
            child: "정현우 (10세, 초등학교 4학년)",
          },
          "h@abc.com": {
            name: "한지민",
            child: "한소희 (8세, 초등학교 2학년)",
          },
          "teacher2@abc.com": {
            name: "최민수",
            child: "최서연 (7세, 초등학교 1학년)",
          },
        };

        const currentParent = parentInfo[user.email] || {
          name: "부모님",
          child: "아이",
        };

        paymentDataArray.push({
          id: "teacher_specific_data",
          parentName: currentParent.name,
          childName: currentParent.child,
          contractStartDate: "2023-01-15",
          contractMonths: 12,
          sessionsPerWeek: 4,
          hoursPerSession: teacherLessons[0]?.hours || 4,
          hourlyWage: teacherLessons[0]?.hourlyWage || 22000,
          expectedTotalAmount: totalEarnings * 1.1, // 예상 금액
          actualTotalAmount: totalEarnings,
          completedLessons: teacherLessons,
          status: "completed",
          monthlyAmount: totalEarnings / 12,
          teacherCommission: totalEarnings * 0.05,
        });
      }

      setPaymentData(paymentDataArray);
    } catch (error) {
      console.error("수당 데이터 로드 실패:", error);
      // 에러 발생 시 기본 데이터 사용
      setPaymentData([]);
    }
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
    // 박민수 쌤과 박영희님의 1년간 매칭인 경우 특별 처리
    if (matchingId === "matching_park_1year") {
      return generateParkMinSuData();
    }
    const lessons = [];
    const startDate = new Date(contractStartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + contractMonths);

    const today = new Date();
    let currentDate = new Date(startDate);

    // 박민수 쌤의 경우 실제 1년치 수업 데이터 생성
    if (matchingId === "matching_003") {
      // 2024년 1월 15일부터 12월 31일까지, 주3회(월 12회, 총 144회)
      const lessons = [];
      const startDate = new Date(2024, 0, 15); // 1월 15일
      let lessonCount = 0;
      for (let month = 0; month < 12; month++) {
        for (let week = 0; week < 4; week++) {
          for (let day = 0; day < 3; day++) {
            // 월,수,금: 0,2,4 (요일)
            const lessonDate = new Date(startDate);
            lessonDate.setMonth(startDate.getMonth() + month);
            // 1주차: 15, 17, 19 / 2주차: 22, 24, 26 ...
            lessonDate.setDate(startDate.getDate() + week * 7 + day * 2);
            if (lessonDate.getMonth() !== (startDate.getMonth() + month) % 12)
              continue; // 월 넘어가면 skip
            const lessonAmount = hoursPerSession * hourlyWage * 0.95; // 수수료 5% 차감
            lessons.push({
              id: `lesson_${lessonDate.getTime()}`,
              date: lessonDate.toLocaleDateString("ko-KR"),
              time: `${14 + (lessonCount % 3)}:00-${17 + (lessonCount % 3)}:00`,
              hours: hoursPerSession,
              amount: lessonAmount,
              status: "완료",
              paymentDate: new Date(
                lessonDate.getTime() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("ko-KR"),
            });
            lessonCount++;
          }
        }
      }
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
    if (isNaN(amount) || amount === undefined || amount === null) {
      console.log("Invalid amount for formatting:", amount);
      return "0";
    }
    // 숫자가 너무 클 때 발생하는 문제 방지
    const safeAmount = Math.min(amount, Number.MAX_SAFE_INTEGER);
    return new Intl.NumberFormat("ko-KR").format(safeAmount);
  };

  // 박민수 쌤과 박영희님의 1년간 매칭 데이터 생성
  // 쌤별로 다른 수당 데이터 생성
  const generateTeacherSpecificData = (teacherEmail) => {
    switch (teacherEmail) {
      case "g@abc.com": // 박민수 쌤
        return generateParkMinSuData();
      case "b@abc.com": // 양연희 쌤
        return generateYangYeonHeeData();
      case "teacher2@abc.com": // 박민수 쌤 (다른 계정)
        return generateParkMinSuData2();
      case "f@abc.com": // 김지영 쌤
        return generateKimJiYoungData();
      case "h@abc.com": // 이수진 쌤
        return generateLeeSuJinData();
      default:
        return generateDefaultTeacherData();
    }
  };

  // 박민수 쌤 데이터 (g@abc.com)
  const generateParkMinSuData = () => {
    const lessons = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-08-31");

    let currentDate = new Date(startDate);
    let lessonCount = 0;

    while (currentDate <= endDate) {
      // 월,화,목,금만 수업 (주4회)
      const dayOfWeek = currentDate.getDay();
      if ([1, 2, 4, 5].includes(dayOfWeek)) {
        lessonCount++;

        // 실제 수업 완료율 (95% 완료율 시뮬레이션)
        const isCompleted = Math.random() > 0.05;

        if (isCompleted) {
          const lessonDate = new Date(currentDate);
          const hoursPerSession = 4; // 오후 2시~6시
          const hourlyWage = 22000;
          const lessonEarnings = hoursPerSession * hourlyWage;

          lessons.push({
            id: `lesson_${lessonCount}`,
            date: lessonDate.toISOString(),
            hours: hoursPerSession,
            hourlyWage: hourlyWage,
            earnings: lessonEarnings,
            status: "completed",
            notes: "정상 수업 완료",
            parentName: "박영희",
            childName: "박지우 (9세, 초등학교 3학년)",
            activities: ["숙제 도움", "영어 학습", "독서 지도", "놀이 활동"],
            location: "서울특별시 관악구 봉천동",
            rating: 5,
            feedback:
              "아이가 매우 만족해하고 있습니다. 체계적인 학습 지도에 감사합니다.",
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  };

  // 양연희 쌤 데이터 (b@abc.com)
  const generateYangYeonHeeData = () => {
    const lessons = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-08-31");

    let currentDate = new Date(startDate);
    let lessonCount = 0;

    while (currentDate <= endDate) {
      // 화,수,금,토만 수업 (주4회)
      const dayOfWeek = currentDate.getDay();
      if ([2, 3, 5, 6].includes(dayOfWeek)) {
        lessonCount++;

        const isCompleted = Math.random() > 0.08; // 92% 완료율

        if (isCompleted) {
          const lessonDate = new Date(currentDate);
          const hoursPerSession = 3; // 오후 3시~6시
          const hourlyWage = 25000;
          const lessonEarnings = hoursPerSession * hourlyWage;

          lessons.push({
            id: `lesson_${lessonCount}`,
            date: lessonDate.toISOString(),
            hours: hoursPerSession,
            hourlyWage: hourlyWage,
            earnings: lessonEarnings,
            status: "completed",
            notes: "정상 수업 완료",
            parentName: "김가정",
            childName: "김민수 (8세, 초등학교 2학년)",
            activities: [
              "피아노 지도",
              "미술 활동",
              "독서 지도",
              "창의적 놀이",
            ],
            location: "서울특별시 관악구 신림동",
            rating: 5,
            feedback: "아이가 피아노를 정말 좋아하게 되었어요. 감사합니다!",
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  };

  // 김지영 쌤 데이터 (f@abc.com)
  const generateKimJiYoungData = () => {
    const lessons = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-08-31");

    let currentDate = new Date(startDate);
    let lessonCount = 0;

    while (currentDate <= endDate) {
      // 월,수,금만 수업 (주3회)
      const dayOfWeek = currentDate.getDay();
      if ([1, 3, 5].includes(dayOfWeek)) {
        lessonCount++;

        const isCompleted = Math.random() > 0.1; // 90% 완료율

        if (isCompleted) {
          const lessonDate = new Date(currentDate);
          const hoursPerSession = 2.5; // 오후 3시~5시30분
          const hourlyWage = 20000;
          const lessonEarnings = hoursPerSession * hourlyWage;

          lessons.push({
            id: `lesson_${lessonCount}`,
            date: lessonDate.toISOString(),
            hours: hoursPerSession,
            hourlyWage: hourlyWage,
            earnings: lessonEarnings,
            status: "completed",
            notes: "정상 수업 완료",
            parentName: "정지영",
            childName: "정현우 (10세, 초등학교 4학년)",
            activities: ["과학 실험", "보드게임", "음악 활동", "미술 활동"],
            location: "서울특별시 마포구 합정동",
            rating: 4,
            feedback:
              "아이가 과학에 관심을 많이 보이게 되었어요. 좋은 경험이었습니다.",
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  };

  // 이수진 쌤 데이터 (h@abc.com)
  const generateLeeSuJinData = () => {
    const lessons = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-08-31");

    let currentDate = new Date(startDate);
    let lessonCount = 0;

    while (currentDate <= endDate) {
      // 화,목,토만 수업 (주3회)
      const dayOfWeek = currentDate.getDay();
      if ([2, 4, 6].includes(dayOfWeek)) {
        lessonCount++;

        const isCompleted = Math.random() > 0.03; // 97% 완료율

        if (isCompleted) {
          const lessonDate = new Date(currentDate);
          const hoursPerSession = 3.5; // 오후 2시~5시30분
          const hourlyWage = 30000;
          const lessonEarnings = hoursPerSession * hourlyWage;

          lessons.push({
            id: `lesson_${lessonCount}`,
            date: lessonDate.toISOString(),
            hours: hoursPerSession,
            hourlyWage: hourlyWage,
            earnings: lessonEarnings,
            status: "completed",
            notes: "정상 수업 완료",
            parentName: "한지민",
            childName: "한소희 (8세, 초등학교 2학년)",
            activities: ["영어 학습", "수학 지도", "독서 토론", "창의적 놀이"],
            location: "서울특별시 서초구 서초동",
            rating: 5,
            feedback:
              "영어 실력이 많이 향상되었어요. 체계적인 지도에 감사합니다.",
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  };

  // 박민수 쌤 데이터 2 (teacher2@abc.com)
  const generateParkMinSuData2 = () => {
    const lessons = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-08-31");

    let currentDate = new Date(startDate);
    let lessonCount = 0;

    while (currentDate <= endDate) {
      // 월,화,목만 수업 (주3회)
      const dayOfWeek = currentDate.getDay();
      if ([1, 2, 4].includes(dayOfWeek)) {
        lessonCount++;

        const isCompleted = Math.random() > 0.06; // 94% 완료율

        if (isCompleted) {
          const lessonDate = new Date(currentDate);
          const hoursPerSession = 2; // 오후 4시~6시
          const hourlyWage = 18000;
          const lessonEarnings = hoursPerSession * hourlyWage;

          lessons.push({
            id: `lesson_${lessonCount}`,
            date: lessonDate.toISOString(),
            hours: hoursPerSession,
            hourlyWage: hourlyWage,
            earnings: lessonEarnings,
            status: "completed",
            notes: "정상 수업 완료",
            parentName: "최민수",
            childName: "최서연 (7세, 초등학교 1학년)",
            activities: ["영어 학습", "수학 지도", "미술 활동"],
            location: "서울특별시 강남구 역삼동",
            rating: 4,
            feedback: "아이가 영어에 관심을 보이기 시작했어요. 감사합니다.",
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  };

  // 기본 쌤 데이터
  const generateDefaultTeacherData = () => {
    const lessons = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-08-31");

    let currentDate = new Date(startDate);
    let lessonCount = 0;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if ([1, 2, 4, 5].includes(dayOfWeek)) {
        lessonCount++;

        const isCompleted = Math.random() > 0.05;

        if (isCompleted) {
          const lessonDate = new Date(currentDate);
          const hoursPerSession = 4;
          const hourlyWage = 22000;
          const lessonEarnings = hoursPerSession * hourlyWage;

          lessons.push({
            id: `lesson_${lessonCount}`,
            date: lessonDate.toISOString(),
            hours: hoursPerSession,
            hourlyWage: hourlyWage,
            earnings: lessonEarnings,
            status: "completed",
            notes: "정상 수업 완료",
            parentName: "기본 부모",
            childName: "기본 아이",
            activities: ["기본 활동"],
            location: "서울특별시",
            rating: 4,
            feedback: "기본 피드백",
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  };

  // 월별 수입 차트 데이터 생성 (실제 + 예상)
  const generateMonthlyChartData = () => {
    const monthlyData = [];
    const currentDate = new Date();
    // 테스트를 위해 8월로 설정 (실제 배포 시에는 주석 처리)
    const currentMonth = 7; // 8월 (0부터 시작)
    const currentYear = currentDate.getFullYear();

    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];

    months.forEach((month, index) => {
      const monthNumber = index + 1;
      let actualEarnings = 0;
      let expectedEarnings = 0;

      paymentData.forEach((payment) => {
        if (payment.completedLessons) {
          payment.completedLessons.forEach((lesson) => {
            const lessonDate = new Date(lesson.date);

            if (
              lessonDate.getMonth() === index &&
              lessonDate.getFullYear() === 2025
            ) {
              // 실제 수업 완료 데이터
              const hours = lesson.hours || 0;
              const hourlyWage = payment.hourlyWage || 22000;
              actualEarnings += hours * hourlyWage * 0.95; // 5% 수수료 차감
            }
          });
        }
      });

      // 예상 수당 계산 (현재 월 이후)
      if (index >= currentMonth) {
        paymentData.forEach((payment) => {
          const sessionsPerWeek = payment.sessionsPerWeek || 4;
          const hoursPerSession = payment.hoursPerSession || 4;
          const hourlyWage = payment.hourlyWage || 22000;

          // 해당 월의 주 수 계산
          const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
          const weeksInMonth = Math.ceil(daysInMonth / 7);

          // 예상 수업 횟수
          const expectedLessons = sessionsPerWeek * weeksInMonth;
          expectedEarnings +=
            expectedLessons * hoursPerSession * hourlyWage * 0.95;
        });
      }

      monthlyData.push({
        label: month,
        actualValue: actualEarnings,
        expectedValue: expectedEarnings,
        isActual: index < currentMonth, // 현재 월 이전은 실제 데이터
        isCurrent: index === currentMonth, // 현재 월
        isExpected: index > currentMonth, // 현재 월 이후는 예상
      });

      // 디버깅 로그
      console.log(
        `${month}: 실제 수당 = ${actualEarnings.toLocaleString()}원, 예상 수당 = ${expectedEarnings.toLocaleString()}원`
      );

      // 실제 데이터 개수 확인
      const actualLessonsCount = paymentData.reduce((sum, payment) => {
        if (payment.completedLessons) {
          return (
            sum +
            payment.completedLessons.filter((lesson) => {
              const lessonDate = new Date(lesson.date);
              return (
                lessonDate.getMonth() === index &&
                lessonDate.getFullYear() === 2025
              );
            }).length
          );
        }
        return sum;
      }, 0);

      console.log(`${month}: 실제 수업 개수 = ${actualLessonsCount}개`);

      if (index >= currentMonth) {
        console.log(
          `${month}: 예상 수당 = ${expectedEarnings.toLocaleString()}원`
        );
      }
    });

    return monthlyData;
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
                  paymentData.reduce((sum, item) => {
                    console.log("Payment item:", item); // 디버깅 로그

                    if (
                      !item.completedLessons ||
                      item.completedLessons.length === 0
                    ) {
                      console.log("No completed lessons for item:", item.id);
                      return sum;
                    }

                    const totalHours = item.completedLessons.reduce(
                      (lessonSum, lesson) => {
                        let hours = 0;
                        if (lesson.hours) {
                          hours = lesson.hours;
                        } else if (lesson.earnings && lesson.hourlyWage) {
                          hours = lesson.earnings / lesson.hourlyWage;
                        }
                        console.log("Lesson:", lesson, "Hours:", hours); // 디버깅 로그
                        return lessonSum + hours;
                      },
                      0
                    );

                    const hourlyWage = item.hourlyWage || 22000;
                    const totalEarnings = totalHours * hourlyWage * 0.95; // 5% 수수료 차감

                    console.log(
                      "Total hours:",
                      totalHours,
                      "Hourly wage:",
                      hourlyWage,
                      "Total earnings:",
                      totalEarnings
                    ); // 디버깅 로그

                    return sum + totalEarnings;
                  }, 0)
                )}
                원
              </p>
            </div>
          </div>
        </div>

        {/* 통계 카드 섹션 */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">
              {paymentData.reduce((sum, item) => {
                if (item.completedLessons) {
                  return sum + item.completedLessons.length;
                }
                return sum;
              }, 0)}
            </div>
            <div className="stat-label">총 수업 건수</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">4.9</div>
            <div className="stat-label">평균 평점</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍👩‍👧‍👦</div>
            <div className="stat-value">
              {
                new Set(
                  paymentData.flatMap(
                    (item) =>
                      item.completedLessons?.map(
                        (lesson) => lesson.parentName
                      ) || []
                  )
                ).size
              }
            </div>
            <div className="stat-label">담당 가정 수</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">95%</div>
            <div className="stat-label">수업 완료율</div>
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className="charts-section">
          <div className="chart-container">
            <h3 className="chart-title">월별 수당 현황 (실제 + 예상)</h3>
            <p className="chart-description">
              파란색: 실제 받은 수당, 노란색: 예상 수당
            </p>
            <div className="chart-content" id="monthly-chart"></div>
          </div>
        </div>

        {/* 수당 현황 테이블 */}
        <div className="payment-table">
          <div className="table-header">
            <div className="table-cell">부모님</div>
            <div className="table-cell">예상 총수당</div>
            <div className="table-cell">완료된 수업</div>
            <div className="table-cell">시간당 수당</div>
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
                  {formatCurrency(payment.hourlyWage)}원/시간
                  <br />
                  <small>
                    실제: {formatCurrency(payment.hourlyWage * 0.95)}원/시간
                  </small>
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
