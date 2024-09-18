// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Express 서버가 동작하는 곳
        changeOrigin: true, // 원본 호스트 헤더를 대상 URL로 변경
        rewrite: (path) => path.replace(/^\/api/, ""), // /api 경로 제거
      },
    },
  },
});
