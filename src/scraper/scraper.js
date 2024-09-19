import axios from "axios";
import * as cheerio from "cheerio";

// 여러 URL에서 댓글 스크래핑을 수행하는 함수
export async function scrapeComments(urls, searchTerm) {
  const comments = [];

  // 각 URL에 대해 스크래핑 수행
  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // 각 URL에서 댓글을 수집
      $(".comment_li_").each((index, element) => {
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
