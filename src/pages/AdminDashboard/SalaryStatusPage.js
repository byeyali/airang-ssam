import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import "./SalaryStatusPage.css";

function SalaryStatusPage() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getAllApplications } = useApplication();

  const [salaryData, setSalaryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest, highest, lowest
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, pending, unpaid

  useEffect(() => {
    if (user?.type === "admin") {
      loadSalaryData();
    }
  }, [user]);

  const loadSalaryData = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();

    // 계약 수락 완료된 매칭만 필터링
    const acceptedMatchings = allMatchings.filter(
      (m) => m.status === "accepted" && m.contractStatus
    );

    const salaryStatus = acceptedMatchings
      .map((matching) => {
        let application;

        // 매칭 ID에 따른 application 매핑
        const matchingToApplicationMap = {
          matching_001: "app_001",
          matching_002: "app_002",
          matching_003: "app_003",
          matching_004: "app_004",
          matching_005: "app_005",
          matching_006: "app_006",
          matching_007: "app_007",
          matching_008: "app_008",
          matching_009: "app_009",
        };

        const applicationId = matchingToApplicationMap[matching.id];
        application = allApplications.find((app) => app.id === applicationId);

        // 디버깅을 위한 로그
        console.log(
          `Matching ${matching.id}: looking for application ${applicationId}, found:`,
          application?.id
        );

        // 시급 파싱 개선
        let hourlyWage = 0;
        if (application?.payment) {
          // "시간 당 15,000" 형식에서 숫자 추출
          const paymentText = application.payment;

          // "시간 당" 다음에 오는 숫자 추출 (쉼표 포함)
          const timeWageMatch = paymentText.match(/시간\s*당\s*([\d,]+)/);
          if (timeWageMatch) {
            hourlyWage = parseInt(timeWageMatch[1].replace(/,/g, ""));
          } else {
            // 일반 숫자 패턴 (예: 15000)
            const numberMatch = paymentText.match(/(\d{1,3}(?:,\d{3})*)/);
            if (numberMatch) {
              hourlyWage = parseInt(numberMatch[1].replace(/,/g, ""));
            }
          }

          // 디버깅을 위한 로그
          console.log(
            `Application ${application?.id}: payment="${application?.payment}", parsed hourlyWage=${hourlyWage}`
          );
        }

        // application이 없는 경우 기본값 설정
        if (!application) {
          console.warn(`No application found for matching ${matching.id}`);
          return null;
        }

        const workingHours = application?.workingHours || "";
        const hoursPerSession = calculateHoursFromWorkingHours(workingHours);
        const sessionsPerWeek = calculateSessionsPerWeek(
          application?.type || ""
        );
        const dailyWage = hourlyWage * hoursPerSession;
        const monthlySalary = dailyWage * sessionsPerWeek * 4;
        const contractMonths = 5;
        const totalSalary = monthlySalary * contractMonths;
        const totalSessions = sessionsPerWeek * contractMonths * 4;

        const sessions = [];
        for (let i = 1; i <= totalSessions; i++) {
          const sessionDate = new Date();
          sessionDate.setDate(sessionDate.getDate() + (i - 1) * 2); // 2일마다 수업

          sessions.push({
            sessionNumber: i,
            date: sessionDate.toLocaleDateString("ko-KR"),
            dailyWage: dailyWage,
            status: i <= 8 ? "지급완료" : i <= 12 ? "지급예정" : "미지급",
          });
        }

        return {
          matchingId: matching.id,
          parentName: matching.parentName,
          teacherName: matching.teacherName,
          dailyWage: dailyWage,
          monthlySalary: monthlySalary,
          totalSalary: totalSalary,
          contractStatus: matching.contractStatus,
          sessions: sessions,
          createdAt: matching.createdAt,
        };
      })
      .filter(Boolean); // null 값 제거

    setSalaryData(salaryStatus);
    setFilteredData(salaryStatus);
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

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterData(term, sortBy, statusFilter);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    filterData(searchTerm, sortType, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterData(searchTerm, sortBy, status);
  };

  const filterData = (search, sort, status) => {
    let filtered = salaryData.filter((item) => {
      const matchesSearch =
        item.parentName.toLowerCase().includes(search.toLowerCase()) ||
        item.teacherName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || item.sessions.some((s) => s.status === status);

      return matchesSearch && matchesStatus;
    });

    // 정렬
    switch (sort) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "highest":
        filtered.sort((a, b) => b.dailyWage - a.dailyWage);
        break;
      case "lowest":
        filtered.sort((a, b) => a.dailyWage - b.dailyWage);
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  };

  if (user?.type !== "admin") {
    return (
      <div className="salary-status-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="salary-status-page">
      <div className="page-container">
        <div className="page-header">
          <h1>선생 일당 지급 현황</h1>
          <p>전체 선생님의 일당 지급 현황을 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="부모님 이름 또는 쌤 이름으로 검색..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="sort-controls">
              <span>정렬:</span>
              <button
                className={`sort-button ${sortBy === "latest" ? "active" : ""}`}
                onClick={() => handleSort("latest")}
              >
                최신순
              </button>
              <button
                className={`sort-button ${
                  sortBy === "highest" ? "active" : ""
                }`}
                onClick={() => handleSort("highest")}
              >
                일당 높은순
              </button>
              <button
                className={`sort-button ${sortBy === "lowest" ? "active" : ""}`}
                onClick={() => handleSort("lowest")}
              >
                일당 낮은순
              </button>
            </div>

            <div className="status-controls">
              <span>상태:</span>
              <button
                className={`status-button ${
                  statusFilter === "all" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("all")}
              >
                전체
              </button>
              <button
                className={`status-button ${
                  statusFilter === "지급완료" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("지급완료")}
              >
                지급완료
              </button>
              <button
                className={`status-button ${
                  statusFilter === "지급예정" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("지급예정")}
              >
                지급예정
              </button>
              <button
                className={`status-button ${
                  statusFilter === "미지급" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("미지급")}
              >
                미지급
              </button>
            </div>
          </div>
        </div>

        {/* 결과 통계 */}
        <div className="results-summary">
          <div className="summary-item">
            <span>총 {filteredData.length}건</span>
          </div>
        </div>

        {/* 일당 지급 현황 테이블 */}
        <div className="salary-table">
          <div className="table-header">
            <div className="table-cell">쌤</div>
            <div className="table-cell">부모님</div>
            <div className="table-cell">일당</div>
            <div className="table-cell">지급 현황</div>
            <div className="table-cell">계약 상태</div>
            <div className="table-cell">등록일</div>
          </div>

          {filteredData.map((salary, index) => (
            <div key={index} className="table-row">
              <div className="table-cell" data-label="쌤">
                {salary.teacherName}
              </div>
              <div className="table-cell" data-label="부모님">
                {salary.parentName}
              </div>
              <div className="table-cell" data-label="일당">
                {formatCurrency(salary.dailyWage)}원/일
              </div>
              <div className="table-cell" data-label="지급 현황">
                <div className="salary-sessions">
                  <div className="session-summary">
                    <span className="completed-sessions">
                      지급완료:{" "}
                      {
                        salary.sessions.filter((s) => s.status === "지급완료")
                          .length
                      }
                      회
                    </span>
                    <span className="pending-sessions">
                      지급예정:{" "}
                      {
                        salary.sessions.filter((s) => s.status === "지급예정")
                          .length
                      }
                      회
                    </span>
                    <span className="unpaid-sessions">
                      미지급:{" "}
                      {
                        salary.sessions.filter((s) => s.status === "미지급")
                          .length
                      }
                      회
                    </span>
                  </div>
                  <div className="session-details">
                    {salary.sessions
                      .slice(0, 5)
                      .map((session, sessionIndex) => (
                        <div
                          key={sessionIndex}
                          className={`session-item ${session.status}`}
                        >
                          <span className="session-number">
                            {session.sessionNumber}회
                          </span>
                          <span className="session-date">{session.date}</span>
                          <span className="session-status">
                            {session.status}
                          </span>
                        </div>
                      ))}
                    {salary.sessions.length > 5 && (
                      <div className="more-sessions">
                        +{salary.sessions.length - 5}회 더...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="table-cell" data-label="계약 상태">
                <span className={`contract-status ${salary.contractStatus}`}>
                  {salary.contractStatus === "progress" && "계약 진행중"}
                  {salary.contractStatus === "completed" && "계약 완료"}
                </span>
              </div>
              <div className="table-cell" data-label="등록일">
                {new Date(salary.createdAt).toLocaleDateString("ko-KR")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SalaryStatusPage;
