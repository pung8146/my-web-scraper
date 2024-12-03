// src/scraper/scraper.js
import puppeteer from "puppeteer";

export const scrapePage = async (url, query) => {
  let browser;
  try {
    console.log("Launching Puppeteer...");
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log("Navigating to page...");
    await page.goto(url, { waitUntil: "networkidle2" });

    console.log("Searching for text...");
    const results = await page.evaluate((searchQuery) => {
      const elements = Array.from(document.querySelectorAll("*"));
      return elements
        .filter((element) => element.textContent.includes(searchQuery))
        .map((element) => element.textContent.trim());
    }, query);

    console.log("Scraping result:", results);
    return results;
  } catch (error) {
    console.error("스크래핑 실패:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
