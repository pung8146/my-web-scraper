// server/src/scraper/scraper.js
import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { parse } from "json2csv";
import path from "path";

// HTTP 요청 시 사용할 헤더 설정
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
};

// 여러 게시글을 스크래핑하고 데이터를 CSV로 저장하는 함수
// 여러 게시글을 스크래핑하고 데이터를 CSV로 저장하는 함수
export async function scrapeData(pageUrl, searchTerm) {
  // searchTerm 추가
  try {
    // 1. 목록 페이지에서 게시글 링크 수집
    const postLinks = await getPostLinks(pageUrl);
    console.log(`수집된 게시글 링크: ${postLinks.length}개`);

    // 2. 게시글 상세 페이지에서 ID 및 코멘트 링크 수집
    const data = [];
    for (let i = 0; i < postLinks.length; i += 4) {
      const batch = postLinks.slice(i, i + 4);
      const results = await Promise.allSettled(
        batch.map((link) => scrapePost(link, searchTerm))
      ); // searchTerm 전달
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          data.push(result.value);
        } else {
          console.error(`스크래핑 실패: ${result.reason.message}`);
        }
      });

      // 딜레이 추가
      // await sleep(3000); // 3초 대기
    }

    // 3. 수집한 데이터를 CSV 파일로 저장
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join("root", "list", `scraped_data_${timestamp}.csv`);
    saveToCSV(data, filePath);

    console.log(`데이터가 ${filePath}에 저장되었습니다.`);
    return data;
  } catch (error) {
    console.error("스크래핑 중 오류 발생:", error.message);
    throw error;
  }
}

// 목록 페이지에서 게시글 링크 수집 함수
async function getPostLinks(pageUrl) {
  const postLinks = [];

  try {
    const { data } = await axios.get(pageUrl, { headers }); // headers 추가
    const $ = cheerio.load(data);

    // 'class="video"'인 게시글의 링크 수집
    $(".video > a").each((index, element) => {
      const postLink = "https://www.example.com" + $(element).attr("href");
      postLinks.push(postLink);
    });
  } catch (error) {
    console.error(`게시글 링크 수집 중 오류 발생: ${error.message}`);
    throw error;
  }

  return postLinks;
}

// 게시글 상세 페이지에서 ID와 코멘트 수집 함수
async function scrapePost(postUrl, searchTerm) {
  try {
    const { data } = await axios.get(postUrl, { headers });
    const $ = cheerio.load(data);

    // 게시글 ID 수집
    const id =
      $("#video_id > table > tbody > tr > td.text").text().trim() || "ID 없음";

    // searchTerm을 포함하는 링크 수집 (처음 하나만)
    let searchTermLink = "없음";
    $(".comment").each((index, element) => {
      const commentText = $(element).text();
      const commentLink = $(element).find("a").attr("href");

      if (commentText.includes(searchTerm)) {
        // 입력한 검색어를 포함하는지 확인
        searchTermLink = commentLink || "링크 없음"; // 링크가 없으면 '링크 없음' 저장
        return false; // 첫 번째로 매칭되는 검색어만 수집 후 반복 종료
      }
    });

    return { id, postUrl, searchTermLink };
  } catch (error) {
    console.error(
      `상세 페이지 스크래핑 중 오류 발생 (URL: ${postUrl}): ${error.message}`
    );
    return { id: "오류", postUrl, searchTermLink: "오류" };
  }
}

// 수집된 데이터를 CSV 파일로 저장하는 함수
function saveToCSV(data, filePath) {
  const csv = parse(data, { fields: ["id", "postUrl", "getLink"] });

  // root/list 폴더가 없으면 생성
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // CSV 파일로 저장
  fs.writeFileSync(filePath, csv);
}
