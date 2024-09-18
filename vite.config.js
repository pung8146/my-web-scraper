import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Express 서버가 동작하는 곳
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // /api 경로로 시작하는 요청을 Express로 전달
      },
    },
  },
});
