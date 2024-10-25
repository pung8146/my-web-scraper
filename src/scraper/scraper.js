// src/scraper/scraper.js
import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors"; // CORS 추가

const app = express();
const PORT = 5000;

app.use(cors()); // CORS 미들웨어 추가

app.get("/api/scrape", async (req, res) => {
  try {
    const { data } = await axios.get("https://bkoz.gg/tournament-detail/408");
    const $ = cheerio.load(data);

    const result = $("h1").text();

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "스크래핑 실패" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
