const express = require("express");
const cors = require("cors");
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 등록
const tutorJobRoutes = require("./tutor_job_routes");

// API 라우트
app.use("/api/tutor-jobs", tutorJobRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "아이랑쌤이랑 API 서버가 실행 중입니다." });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "서버 내부 오류가 발생했습니다.",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: "요청한 리소스를 찾을 수 없습니다." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;
