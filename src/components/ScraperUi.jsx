// src/components/ScraperUi.jsx
import React, { useState } from "react";
import axios from "axios";

function ScraperUi() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/scrape");
      const scrapedData = response.data.result;

      // 데이터 로컬 스토리지에 저장
      localStorage.setItem("scrapedData", scrapedData);
      setData(scrapedData);
      console.log("스크래핑 결과 :", scrapedData);
    } catch (error) {
      console.error("스크래핑 실패", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleScrape} disabled={loading}>
        {loading ? "스크래핑 중..." : "데이터 가져오기"}
      </button>
      <div>
        <h2>스크래핑 결과:</h2>
        <p>{data || "데이터가 없습니다."}</p>
      </div>
    </div>
  );
}

export default ScraperUi;
