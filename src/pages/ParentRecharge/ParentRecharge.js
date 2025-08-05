import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./ParentRecharge.css";

function ParentRecharge() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleBackToPaymentHistory = () => {
    navigate("/parent/payment-history");
  };

  const handleCopyAccountInfo = (accountInfo) => {
    navigator.clipboard.writeText(accountInfo);
    alert("계좌 정보가 복사되었습니다!");
  };

  if (!user || user.type !== "parent") {
    return (
      <div className="parent-recharge-page">
        <div className="access-denied">
          <h2>접근 권한이 없습니다</h2>
          <p>부모 회원만 이용할 수 있는 서비스입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-recharge-page">
      <div className="recharge-container">
        <div className="recharge-header">
          <button className="back-button" onClick={handleBackToPaymentHistory}>
            ← 뒤로가기
          </button>
          <h1>💰 충전하기</h1>
          <p>새로운 매칭을 위해 충전해주세요</p>
        </div>

        <div className="recharge-methods">
          {/* 계좌 입금 방법 */}
          <div className="recharge-method-card">
            <div className="method-icon">🏦</div>
            <h3>계좌 입금</h3>
            <div className="account-info">
              <div className="account-item">
                <span className="label">은행:</span>
                <span className="value">신한은행</span>
              </div>
              <div className="account-item">
                <span className="label">계좌번호:</span>
                <span className="value">123-456-789012</span>
                <button
                  className="copy-button"
                  onClick={() => handleCopyAccountInfo("123-456-789012")}
                >
                  복사
                </button>
              </div>
              <div className="account-item">
                <span className="label">예금주:</span>
                <span className="value">(주)아이랑쌤</span>
              </div>
            </div>
            <div className="method-note">
              <p>💡 입금 시 반드시 부모님 성함을 입금자명으로 기재해주세요.</p>
              <p>💡 입금 후 1-2시간 내에 충전이 반영됩니다.</p>
            </div>
          </div>

          {/* 카드 결제 방법 */}
          <div className="recharge-method-card">
            <div className="method-icon">💳</div>
            <h3>카드 결제</h3>
            <div className="card-info">
              <p>안전하고 빠른 카드 결제</p>
              <div className="card-brands">
                <span>VISA</span>
                <span>MASTER</span>
                <span>JCB</span>
              </div>
            </div>
            <button className="card-payment-button">카드로 충전하기</button>
            <div className="method-note">
              <p>💡 카드 결제는 즉시 충전이 반영됩니다.</p>
              <p>💡 결제 수수료는 없습니다.</p>
            </div>
          </div>
        </div>

        {/* 충전 금액 선택 */}
        <div className="recharge-amount-section">
          <h3>충전 금액 선택</h3>
          <div className="amount-options">
            <button className="amount-option">50,000원</button>
            <button className="amount-option">100,000원</button>
            <button className="amount-option">200,000원</button>
            <button className="amount-option">500,000원</button>
          </div>
          <div className="custom-amount">
            <input
              type="number"
              placeholder="직접 입력"
              className="custom-amount-input"
            />
            <span className="currency">원</span>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="recharge-notice">
          <h3>📋 주의사항</h3>
          <ul>
            <li>충전된 금액은 환불이 불가능합니다.</li>
            <li>충전 금액은 매칭 서비스 이용에만 사용됩니다.</li>
            <li>미사용 금액은 1년 후 자동으로 만료됩니다.</li>
            <li>문의사항은 고객센터로 연락해주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ParentRecharge;
