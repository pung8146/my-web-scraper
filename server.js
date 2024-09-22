import express from "express";
import cors from "cors";
import { scrapeComments } from "./src/scraper/scraper.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { urls, searchTerm } = req.body;
  console.log("서버로 요청 도착:", req.body);

  // urls가 배열인지 확인하고, 배열이 아닌 경우 배열로 변환
  if (!Array.isArray(urls)) {
    return res.status(400).json({ message: "올바른 URL 배열을 제공하세요." });
  }

  try {
    const comments = await scrapeComments(urls, searchTerm);
    res.json(comments);
  } catch (error) {
    console.error("스크래핑 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "스크래핑 중 오류 발생", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
