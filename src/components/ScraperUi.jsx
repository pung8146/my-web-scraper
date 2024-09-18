// src/components/ScraperUI.jsx
import { useState } from "react";
import "./ScraperUi.css"; // 별도의 CSS 파일을 사용해 스타일링

const ScraperUI = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchTerm }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="scraper-container">
      <h1>웹 스크래핑 검색</h1>
      <div className="input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div className="results-container">
        {results.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScraperUI;
