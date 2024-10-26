// src/client.js
import { useEffect, useState } from "react";

function ScrapingResult() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/scrape");
        const result = await response.json();
        setData(result.result);
      } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>스크래핑 결과</h1>
      <p>{data}</p>
    </div>
  );
}

export default ScrapingResult;
