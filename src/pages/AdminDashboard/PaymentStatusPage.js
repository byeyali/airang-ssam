import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useMatching } from "../../contexts/MatchingContext";
import { useApplication } from "../../contexts/ApplicationContext";
import "./PaymentStatusPage.css";

function PaymentStatusPage() {
  const { user } = useUser();
  const { getAllMatchingRequests } = useMatching();
  const { getAllApplications } = useApplication();

  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest, highest, lowest
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, pending, unpaid
  const [expandedDetails, setExpandedDetails] = useState(new Set());

  useEffect(() => {
    if (user?.type === "admin") {
      loadPaymentData();
    }
  }, [user]);

  const loadPaymentData = () => {
    const allMatchings = getAllMatchingRequests();
    const allApplications = getAllApplications();

    // 계약 수락 완료된 매칭만 필터링
    const acceptedMatchings = allMatchings.filter(
      (m) => m.status === "accepted" && m.contractStatus
    );

    const paymentStatus = acceptedMatchings.map((matching) => {
      let application;
      if (matching.id === "matching_002") {
        application = allApplications.find((app) => app.id === "app_002");
      } else if (matching.id === "matching_003") {
        application = allApplications.find((app) => app.id === "app_003");
      } else if (matching.id === "matching_005") {
        // 박민수 쌤의 두 번째 매칭
        application = allApplications.find((app) => app.id === "app_007");
      } else {
        application = allApplications.find(
          (app) => app.id === matching.applicationId
        );
      }

      // 시급 파싱 개선
      let hourlyWage = 0;
      if (application?.payment) {
        // 쉼표가 있는 숫자 패턴 (예: 20,000)
        const commaMatch = application.payment.match(/\d{1,3}(?:,\d{3})*/);
        if (commaMatch) {
          hourlyWage = parseInt(commaMatch[0].replace(/,/g, ""));
        } else {
          // 일반 숫자 패턴 (예: 20000)
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
      const parentTotalPayment = teacherTotalEarnings * 1.05;
      const monthlyParentPayment = parentTotalPayment / contractMonths;

      const months = [];
      for (let i = 1; i <= contractMonths; i++) {
        const monthName = `${i}월`;
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i - 1);

        months.push({
          month: monthName,
          amount: monthlyParentPayment,
          dueDate: dueDate.toLocaleDateString("ko-KR"),
          status: i === 1 ? "입금완료" : i === 2 ? "입금예정" : "미입금",
        });
      }

      return {
        matchingId: matching.id,
        parentName: matching.parentName,
        teacherName: matching.teacherName,
        totalAmount: parentTotalPayment,
        monthlyAmount: monthlyParentPayment,
        contractStatus: matching.contractStatus,
        months: months,
        createdAt: matching.createdAt,
      };
    });

    setPaymentData(paymentStatus);
    setFilteredData(paymentStatus);
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

  const handleShowDetails = (index) => {
    const newExpanded = new Set(expandedDetails);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDetails(newExpanded);
  };

  const filterData = (search, sort, status) => {
    let filtered = paymentData.filter((item) => {
      const matchesSearch =
        item.parentName.toLowerCase().includes(search.toLowerCase()) ||
        item.teacherName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || item.months.some((m) => m.status === status);

      return matchesSearch && matchesStatus;
    });

    // 정렬
    switch (sort) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "highest":
        filtered.sort((a, b) => b.monthlyAmount - a.monthlyAmount);
        break;
      case "lowest":
        filtered.sort((a, b) => a.monthlyAmount - b.monthlyAmount);
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  };

  if (user?.type !== "admin") {
    return (
      <div className="payment-status-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status-page">
      <div className="page-container">
        <div className="page-header">
          <h1>부모 입금 현황</h1>
          <p>전체 부모님의 월별 입금 현황을 관리하세요</p>
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
                금액 높은순
              </button>
              <button
                className={`sort-button ${sortBy === "lowest" ? "active" : ""}`}
                onClick={() => handleSort("lowest")}
              >
                금액 낮은순
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
                  statusFilter === "입금완료" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("입금완료")}
              >
                입금완료
              </button>
              <button
                className={`status-button ${
                  statusFilter === "입금예정" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("입금예정")}
              >
                입금예정
              </button>
              <button
                className={`status-button ${
                  statusFilter === "미입금" ? "active" : ""
                }`}
                onClick={() => handleStatusFilter("미입금")}
              >
                미입금
              </button>
            </div>
          </div>
        </div>

        {/* 입금 통계 요약 */}
        <div className="payment-summary-cards">
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h4>총 입금액</h4>
              <p>
                {formatCurrency(
                  filteredData.reduce((sum, item) => sum + item.totalAmount, 0)
                )}
                원
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">✅</div>
            <div className="summary-content">
              <h4>입금완료</h4>
              <p>
                {filteredData.reduce(
                  (sum, item) =>
                    sum +
                    item.months.filter((m) => m.status === "입금완료").length,
                  0
                )}
                건
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⏰</div>
            <div className="summary-content">
              <h4>입금예정</h4>
              <p>
                {filteredData.reduce(
                  (sum, item) =>
                    sum +
                    item.months.filter((m) => m.status === "입금예정").length,
                  0
                )}
                건
              </p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚠️</div>
            <div className="summary-content">
              <h4>미입금</h4>
              <p>
                {filteredData.reduce(
                  (sum, item) =>
                    sum +
                    item.months.filter((m) => m.status === "미입금").length,
                  0
                )}
                건
              </p>
            </div>
          </div>
        </div>

        {/* 입금 현황 테이블 */}
        <div className="payment-table">
          <div className="table-header">
            <div className="table-cell">부모님</div>
            <div className="table-cell">쌤</div>
            <div className="table-cell">월별 입금액</div>
            <div className="table-cell">입금 현황</div>
            <div className="table-cell">계약 상태</div>
            <div className="table-cell">등록일</div>
            <div className="table-cell">상세</div>
          </div>

          {filteredData.map((payment, index) => (
            <div key={index}>
              <div className="table-row">
                <div className="table-cell">{payment.parentName}</div>
                <div className="table-cell">{payment.teacherName}</div>
                <div className="table-cell">
                  {formatCurrency(payment.monthlyAmount)}원/월
                  <br />
                  <small>총 {formatCurrency(payment.totalAmount)}원</small>
                </div>
                <div className="table-cell">
                  <div className="payment-months">
                    {payment.months.map((month, monthIndex) => (
                      <div
                        key={monthIndex}
                        className={`month-item ${month.status}`}
                      >
                        <span className="month-name">{month.month}</span>
                        <span className="month-status">{month.status}</span>
                        <span className="month-date">{month.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`contract-status ${payment.contractStatus}`}>
                    {payment.contractStatus === "progress" && "계약 진행중"}
                    {payment.contractStatus === "completed" && "계약 완료"}
                  </span>
                </div>
                <div className="table-cell">
                  {new Date(payment.createdAt).toLocaleDateString("ko-KR")}
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
                    <h4>입금 상세 정보</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">계약 기간:</span>
                        <span className="detail-value">
                          {payment.contractMonths}개월
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">월별 입금액:</span>
                        <span className="detail-value">
                          {formatCurrency(payment.monthlyAmount)}원
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">총 입금액:</span>
                        <span className="detail-value">
                          {formatCurrency(payment.totalAmount)}원
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">계약 상태:</span>
                        <span className="detail-value">
                          {payment.contractStatus === "progress" &&
                            "계약 진행중"}
                          {payment.contractStatus === "completed" &&
                            "계약 완료"}
                        </span>
                      </div>
                    </div>

                    <div className="monthly-details">
                      <h5>월별 입금 현황</h5>
                      <div className="monthly-grid">
                        {payment.months.map((month, monthIndex) => (
                          <div
                            key={monthIndex}
                            className={`monthly-card ${month.status}`}
                          >
                            <div className="monthly-header">
                              <span className="monthly-name">
                                {month.month}
                              </span>
                              <span
                                className={`monthly-status ${month.status}`}
                              >
                                {month.status}
                              </span>
                            </div>
                            <div className="monthly-info">
                              <div className="monthly-amount">
                                {formatCurrency(month.amount)}원
                              </div>
                              <div className="monthly-date">
                                입금 예정일: {month.dueDate}
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

export default PaymentStatusPage;
