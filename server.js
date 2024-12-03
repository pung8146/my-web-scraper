// src/server.js
import express from "express";
import cors from "cors";
import { scrapePage } from "./src/scraper/scraper.js";
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // JSON 요청 파싱

app.post("/api/scrape", async (req, res) => {
  const { url, query } = req.body;
  if (!url || !query) {
    return res
      .status(400)
      .json({ message: "URL과 검색어를 모두 입력해주세요." });
  }

  try {
    const results = await scrapePage(url, query);
    res.json({ results });
  } catch (error) {
    console.error("스크래핑 실패:", error);
    res.status(500).json({ message: "스크래핑 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
