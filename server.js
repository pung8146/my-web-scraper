import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://bkoz.gg/tournament-detail/408", {
      waitUntil: "networkidle2",
    });

    const result = await page.evaluate(() => {
      const element = document.querySelector("p.room--title");
      return element ? element.innerText : "Element not found";
    });

    await browser.close();
    res.json({ result });
  } catch (error) {
    console.error("스크래핑 실패:", error);
    res.status(500).json({ message: "스크래핑 실패" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
