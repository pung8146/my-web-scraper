// src/scraper/server.js
import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/scrape", async (req, res) => {
  try {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 브라우저 콘솔 로그를 서버 콘솔에 출력
    page.on("console", (msg) => {
      console.log("BROWSER LOG:", msg.text());
    });

    console.log("Navigating to page...");
    await page.goto("https://bkoz.gg/tournament-detail/408", {
      waitUntil: "networkidle2",
    });

    console.log("Waiting for the selector...");
    await page.waitForSelector("p.room--title", { timeout: 5000 }).catch(() => {
      console.log("Selector not found within the timeout.");
    });

    // `setTimeout`을 사용하여 3초 대기
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Extracting text...");
    const result = await page.evaluate(() => {
      const element = document.querySelector("p.room--title");
      if (element) {
        console.log("Element found:", element.innerText); // 브라우저 콘솔에 출력
        return element.innerText;
      } else {
        console.log("Element not found"); // 브라우저 콘솔에 출력
        return "Element not found";
      }
    });

    console.log("Closing browser...");
    await browser.close();

    console.log("Scraping result:", result);
    res.json({ result });
  } catch (error) {
    console.error("스크래핑 실패:", error);
    res.status(500).json({ message: "스크래핑 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
