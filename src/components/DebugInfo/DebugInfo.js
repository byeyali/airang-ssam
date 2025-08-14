import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import "./DebugInfo.css";

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [apiTestResult, setApiTestResult] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 환경 정보 수집
    const info = {
      nodeEnv: process.env.NODE_ENV,
      backendUrl: process.env.REACT_APP_BACKEND_URL,
      apiUrl: process.env.REACT_APP_API_URL,
      baseUrl: process.env.REACT_APP_BASEURL,
      userAgent: navigator.userAgent,
      location: window.location.href,
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
  }, []);

  const testApiConnection = async () => {
    try {
      setApiTestResult({ status: "testing", message: "API 연결 테스트 중..." });

      const response = await axiosInstance.get("/health");
      setApiTestResult({
        status: "success",
        message: "API 연결 성공",
        data: response.data,
      });
    } catch (error) {
      setApiTestResult({
        status: "error",
        message: "API 연결 실패",
        error: error.message,
        details: error.response?.data || error.response?.status,
      });
    }
  };

  const copyDebugInfo = () => {
    const infoText = JSON.stringify(debugInfo, null, 2);
    navigator.clipboard.writeText(infoText);
    alert("디버그 정보가 클립보드에 복사되었습니다.");
  };

  if (!isVisible) {
    return (
      <button
        className="debug-toggle-button"
        onClick={() => setIsVisible(true)}
        title="디버그 정보 보기"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="debug-info-container">
      <div className="debug-header">
        <h3>🔧 디버그 정보</h3>
        <button onClick={() => setIsVisible(false)}>✕</button>
      </div>

      <div className="debug-section">
        <h4>환경 변수</h4>
        <div className="debug-item">
          <strong>NODE_ENV:</strong> {debugInfo.nodeEnv || "undefined"}
        </div>
        <div className="debug-item">
          <strong>REACT_APP_BACKEND_URL:</strong>{" "}
          {debugInfo.backendUrl || "undefined"}
        </div>
        <div className="debug-item">
          <strong>REACT_APP_API_URL:</strong> {debugInfo.apiUrl || "undefined"}
        </div>
        <div className="debug-item">
          <strong>REACT_APP_BASEURL:</strong> {debugInfo.baseUrl || "undefined"}
        </div>
      </div>

      <div className="debug-section">
        <h4>브라우저 정보</h4>
        <div className="debug-item">
          <strong>URL:</strong> {debugInfo.location}
        </div>
        <div className="debug-item">
          <strong>User Agent:</strong> {debugInfo.userAgent}
        </div>
        <div className="debug-item">
          <strong>Timestamp:</strong> {debugInfo.timestamp}
        </div>
      </div>

      <div className="debug-section">
        <h4>API 연결 테스트</h4>
        <button onClick={testApiConnection} className="test-api-button">
          API 연결 테스트
        </button>
        {apiTestResult && (
          <div className={`api-test-result ${apiTestResult.status}`}>
            <strong>{apiTestResult.message}</strong>
            {apiTestResult.error && <div>오류: {apiTestResult.error}</div>}
            {apiTestResult.details && (
              <div>상세: {JSON.stringify(apiTestResult.details)}</div>
            )}
          </div>
        )}
      </div>

      <div className="debug-actions">
        <button onClick={copyDebugInfo} className="copy-button">
          디버그 정보 복사
        </button>
      </div>
    </div>
  );
};

export default DebugInfo;
