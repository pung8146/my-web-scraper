import { useState } from "react";
import "./ScraperUi.css";

const ScraperUI = () => {
  const [urls, setUrls] = useState(""); // URL 리스트 상태 추가
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      // 사용자가 입력한 URL 리스트를 배열로 변환
      const urlArray = urls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlArray, searchTerm }), // URL 배열과 검색어를 서버로 전송
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("API 호출 중 에러 발생:", error);
    }
  };

  return (
    <div className="scraper-container">
      <h1>웹 스크래핑 검색</h1>
      <div className="input-container">
        {/* URL 리스트 입력 필드 */}
        <textarea
          rows="5"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="스크래핑할 URL을 줄 단위로 입력하세요 (예: https://example.com\nhttps://example.com/page)"
        />
        {/* 검색어 입력 필드 */}
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
