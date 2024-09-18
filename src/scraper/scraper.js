// axios와 cheerio를 ES6 방식으로 불러옴
import axios from "axios";
import * as cheerio from "cheerio";

// 댓글 스크래핑 함수 정의 (searchTerm을 매개변수로 받아 특정 단어가 포함된 댓글을 찾음)
export async function scrapeComments(searchTerm) {
  try {
    // 1. 스크래핑할 웹사이트 URL 설정
    const url =
      "https://gall.dcinside.com/mgallery/board/view/?id=pebble&no=6351141&page=1"; // 스크래핑할 웹사이트 URL 입력

    // 2. axios를 사용하여 해당 URL에서 HTML 가져오기
    const { data } = await axios.get(url);

    // 3. 가져온 HTML을 cheerio로 파싱하여 DOM처럼 다룰 수 있게 함
    const $ = cheerio.load(data);

    // 4. 댓글을 저장할 배열 선언
    const comments = [];

    // 5. cheerio를 이용해 특정 클래스의 요소에서 텍스트를 추출하고, 검색어와 일치하는지 확인
    $(".comment_li_").each((index, element) => {
      const comment = $(element).text(); // 각 댓글의 텍스트를 추출

      // 검색어가 댓글에 포함되어 있는지 확인
      if (comment.includes(searchTerm)) {
        comments.push(comment); // 검색어가 포함된 댓글만 배열에 추가
      }
    });

    // 6. 수집된 댓글 배열을 반환
    return comments;
  } catch (error) {
    // 스크래핑 중 오류 발생 시 콘솔에 로그 출력
    console.error("스크래핑 중 오류 발생:", error);
    return [];
  }
}
