// server/index.js
import express from "express";
import cors from "cors";
import { scrapeData } from "./src/scraper/scraper.js"; // 올바른 경로 확인

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// 스크래핑 요청 처리
app.post("/api/scrape", async (req, res) => {
  const { urls, searchTerm } = req.body; // urls와 searchTerm 수신
  console.log("서버로 요청 도착:", urls);

  try {
    const results = await Promise.allSettled(
      urls.map((url) => scrapeData(url, searchTerm))
    ); // searchTerm 전달
    const data = results.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : { error: result.reason.message }
    );
    res.json(data); // 각 URL의 스크래핑 결과를 응답
  } catch (error) {
    console.error("스크래핑 중 오류 발생:", error.message);
    res
      .status(500)
      .json({ message: "스크래핑 중 오류 발생", error: error.message });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
