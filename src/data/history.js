// 연혁 데이터 단일 소스. 연혁 페이지(History.jsx)와 홈 화면 스택 호버(Tech.jsx)가 함께 사용한다.
// showOnHome: 홈 화면 스택에 노출할지 여부 (연혁 페이지에는 항상 전부 노출).
export const historyEntries = [
  {
    id: "2025-1",
    year: "2025",
    month: "03",
    title: "아기유니콘 200 선정",
    detail:
      "중소벤처기업부 '아기유니콘 육성사업(수익성장형)'에 최종 선정되어, 성장 잠재력과 기술 경쟁력을 공식적으로 인정받았습니다.",
    image: true,
    showOnHome: true,
  },
  {
    id: "2024-2",
    year: "2024",
    month: "11",
    title: "국책과제 수주",
    detail:
      "과학기술정보통신부·정보통신기획평가원(IITP) 정보보호 핵심원천기술 개발사업을 수주하여, 디지털자산 위험거래 추적 기술 개발을 수행합니다.",
    showOnHome: true,
  },
  {
    id: "2024-1",
    year: "2024",
    month: "01",
    title: "국제표준 인증 획득",
    detail: "통합입출금서비스의 블록체인 고위험거래 검증 관련 국제 인증을 획득했습니다. (유효기간 2024.01 ~ 2027.01)",
    image: true,
    showOnHome: true,
  },
  {
    id: "2022-1",
    year: "2022",
    month: "06",
    title: "업계 최초 외부감사 대상 법인 선정",
    detail: "",
    showOnHome: true,
  },
  {
    id: "2021-2",
    year: "2021",
    month: "09",
    title: "혁신성장형 벤처기업 인증 획득",
    detail: "",
    showOnHome: true,
  },
  {
    id: "2021-1",
    year: "2021",
    month: "04",
    title: "경찰청장 감사장 수상",
    detail: "금융범죄 예방 및 수사 공조에 기여한 공로로 경찰청장 행정발전 기여 감사장을 수상했습니다.",
    showOnHome: true,
  },
  {
    id: "2020-2",
    year: "2020",
    month: "08",
    title: "실명계좌 연계 TranSafer 서비스 런칭",
    detail:
      "케이뱅크-업비트 실명계좌 연계를 기반으로 국내 최초의 원화 입출금 이상거래탐지 서비스 TranSafer를 런칭했습니다.",
    image: true,
    showOnHome: true,
  },
  {
    id: "2020-1",
    year: "2020",
    month: "05",
    title: "코리아 핀테크위크 2020 선정",
    detail: "",
    showOnHome: true,
  },
  {
    id: "2019-1",
    year: "2019",
    month: "12",
    title: "금융위 규제 샌드박스 위탁테스트 기업 선정",
    detail: "",
    showOnHome: true,
  },
];

// 연혁 페이지의 "연도별 그룹" 레이아웃을 위한 헬퍼. historyEntries가 이미
// 연도 내림차순 → 월 내림차순으로 정렬되어 있으므로 순서를 그대로 유지한다.
export function groupHistoryByYear(entries) {
  const groups = [];
  const indexByYear = new Map();
  for (const entry of entries) {
    if (!indexByYear.has(entry.year)) {
      indexByYear.set(entry.year, groups.length);
      groups.push({ year: entry.year, rows: [] });
    }
    groups[indexByYear.get(entry.year)].rows.push(entry);
  }
  return groups;
}
