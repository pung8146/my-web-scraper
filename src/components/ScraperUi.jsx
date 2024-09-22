import { useState } from "react";
import "./ScraperUi.css";

const ScraperUI = () => {
  const [urlInput, setUrlInput] = useState(""); // 여러 URL을 입력할 수 있도록 문자열 상태로 저장
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(""); // 에러 상태 추가

  const handleSearch = async () => {
    setError(""); // 에러 상태 초기화
    try {
      // urlInput을 줄바꿈으로 구분된 문자열에서 배열로 변환
      const urls = urlInput
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      if (urls.length === 0) {
        setError("URL을 하나 이상 입력해 주세요.");
        return;
      }

      console.log("클라이언트에서 서버로 전송:", { urls, searchTerm });

      const response = await fetch("http://localhost:5000/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, searchTerm }), // URL 배열과 검색어를 서버로 전달
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError(`API 호출 중 에러 발생: ${error.message}`);
      console.error("API 호출 중 에러 발생:", error);
    }
  };

  return (
    <div className="scraper-container">
      <h1>웹 스크래핑 검색</h1>
      <div className="input-container">
        {/* URL 입력 필드 (여러 줄) */}
        <textarea
          rows="5"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
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
      {error && <div className="error-message">{error}</div>}{" "}
      {/* 에러 메시지 출력 */}
      <div className="results-container">
        {results.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <ul>
            {results.map((result, index) => (
              <li key={index}>{JSON.stringify(result)}</li> // 결과를 JSON 형식으로 출력
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScraperUI;
