import axios from "axios";
import * as cheerio from "cheerio";

// 여러 URL에서 댓글 스크래핑을 수행하는 함수
export async function scrapeComments(urls, searchTerm) {
  const comments = [];

  // urls가 배열인지 확인하고, 배열이 아닌 경우 배열로 변환
  if (!Array.isArray(urls)) {
    throw new Error("urls는 배열이어야 합니다."); // urls가 배열이 아닌 경우 오류 발생
  }

  // 각 URL에 대해 스크래핑 수행
  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      $(".comment").each((index, element) => {
        const comment = $(element).text();
        if (comment.includes(searchTerm)) {
          comments.push(comment);
        }
      });
    } catch (error) {
      console.error(`스크래핑 중 오류 발생 (URL: ${url}):`, error);
    }
  }

  return comments;
}
