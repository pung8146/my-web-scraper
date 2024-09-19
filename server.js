import express from "express";
import { scrapeComments } from "./src/scraper/scraper.js";
const app = express();
const port = 5000;

// JSON 형식의 요청 본문을 파싱하는 미들웨어
app.use(express.json());

// POST 요청으로 스크래핑 작업 처리
app.post("/api/scrape", async (req, res) => {
  console.log("서버로 요청 도착:", req.body); // 요청이 도착했을 때 로그 출력
  const { url, searchTerm } = req.body; // 클라이언트로부터 URL과 검색어를 받음

  try {
    // scraper.js의 scrapeComments 함수에 URL과 검색어를 전달하여 스크래핑 수행
    const comments = await scrapeComments(url, searchTerm);
    // 스크래핑된 결과를 클라이언트에 반환
    res.json(comments);
  } catch (error) {
    console.error("스크래핑 중 오류 발생:", error);
    res.status(500).json({ message: "스크래핑 중 오류 발생" });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
