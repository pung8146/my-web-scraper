// src/App.jsx
import React from "react";
import "./App.css"; // 스타일을 적용하기 위한 CSS 파일
import ScraperUI from "./components/ScraperUI"; // ScraperUI 컴포넌트 가져오기

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>웹 스크래핑 애플리케이션</h1>
      </header>
      <main className="app-main">
        <ScraperUI /> {/* ScraperUI 컴포넌트를 메인에 추가 */}
      </main>
      <footer className="app-footer">
        <p>© 2024 My Web Scraper App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
