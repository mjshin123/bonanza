import { newsItems } from "./news.js";
import { noticeItems } from "./notices.js";

// 페이지별 제목·설명. 화면 이동 시 SeoManager가 적용하고, 빌드 시 vite.config.js가
// 같은 값으로 경로별 HTML을 만들어 링크 미리보기(카카오톡·슬랙 등)에도 반영한다.
// 도메인이 바뀌면 SITE_URL과 index.html의 og 주소를 함께 수정한다.
export const SITE_URL = "https://bonanza-beta-two.vercel.app";

const SITE_NAME = "보난자팩토리";

export const DEFAULT_SEO = {
  title: "보난자팩토리 | Bonanza Factory",
  description: "신뢰할 수 있는 디지털자산의 기반을 만듭니다. 국내 최초 가상자산 컴플라이언스 솔루션 전문 기업, 보난자팩토리.",
};

const PAGES = {
  "/": DEFAULT_SEO,
  "/about": {
    title: `회사 소개 | ${SITE_NAME}`,
    description: "국내 최초 가상자산 컴플라이언스 솔루션 전문 기업 보난자팩토리의 비전과 사업 분야, 핵심 기술과 성과를 소개합니다.",
  },
  "/group": {
    title: `보난자 그룹 | ${SITE_NAME}`,
    description: "보난자팩토리와 보난자랩, 트라버스, 바이스, 플러그앤엑스로 이어지는 보난자 그룹의 계열사와 솔루션을 소개합니다.",
  },
  "/history": {
    title: `연혁 | ${SITE_NAME}`,
    description: "가상자산 컴플라이언스의 기준을 만들어 온 보난자팩토리의 주요 연혁과 성과를 확인하세요.",
  },
  "/ci": {
    title: `CI 소개 | ${SITE_NAME}`,
    description: "보난자팩토리의 공식 CI 로고 파일과 브랜드 전용 색상 가이드를 확인하고 다운로드하세요.",
  },
  "/transight": {
    title: `TranSight - 가상자산 통합 AML 솔루션 | ${SITE_NAME}`,
    description: "위험 주소 데이터를 기반으로 KYT 검증부터 추적, 공조, 차단까지. 온체인 범죄 대응을 하나의 솔루션으로 완성하는 TranSight입니다.",
  },
  "/transafer": {
    title: `TranSafer - 원화 입출금 검증 솔루션 | ${SITE_NAME}`,
    description: "고객 실명계좌를 바탕으로 거래소와 은행 사이의 원화 입출금을 검증하고 이상 거래를 차단하는 TranSafer입니다.",
  },
  "/compliance-suite": {
    title: `Compliance Suite - 기관 맞춤형 가상자산 컴플라이언스 인프라 | ${SITE_NAME}`,
    description: "비수탁지갑 솔루션, KYT 검증, 가상자산 KRW 시세, 원화 입출금 검증까지. 보난자 그룹의 솔루션을 기관별 사업 모델에 맞게 조합해 제공합니다.",
  },
  "/press": {
    title: `보도자료 | ${SITE_NAME}`,
    description: "보난자팩토리와 보난자 그룹의 최신 보도자료를 확인하세요.",
  },
  "/notice": {
    title: `공지사항 | ${SITE_NAME}`,
    description: "보난자팩토리의 서비스 및 정책 관련 공지사항을 안내합니다.",
  },
};

const DETAIL_LISTS = [
  { base: "/press", items: newsItems },
  { base: "/notice", items: noticeItems },
];

function detailSeo(item) {
  return { title: `${item.title} | ${SITE_NAME}`, description: item.excerpt || DEFAULT_SEO.description };
}

// 경로에 맞는 SEO 값. 등록되지 않은 경로는 기본값
export function getSeo(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "").toLowerCase() : "/";
  if (PAGES[path]) return PAGES[path];
  for (const { base, items } of DETAIL_LISTS) {
    if (path.startsWith(`${base}/`)) {
      const item = items.find((n) => String(n.id) === path.slice(base.length + 1));
      if (item) return detailSeo(item);
    }
  }
  return DEFAULT_SEO;
}

// 빌드 시 미리 HTML을 만들 전체 경로 (상세 페이지 포함)
export function getPrerenderPaths() {
  const details = DETAIL_LISTS.flatMap(({ base, items }) => items.map((item) => `${base}/${item.id}`));
  return [...Object.keys(PAGES).filter((p) => p !== "/"), ...details];
}
