// src/components/ScraperUi.jsx
import React, { useState } from "react";
import axios from "axios";

function ScraperUi() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/scrape", {
        url,
        query,
      });
      const scrapedData = response.data.results;

      // 데이터 로컬 스토리지에 저장
      localStorage.setItem("scrapedData", JSON.stringify(scrapedData));
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
      <div>
        <input
          type="text"
          placeholder="URL 입력"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="검색할 텍스트 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button onClick={handleScrape} disabled={loading}>
        {loading ? "스크래핑 중..." : "데이터 가져오기"}
      </button>
      <div>
        <h2>스크래핑 결과:</h2>
        {data.length > 0 ? (
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ScraperUi;
