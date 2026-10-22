// 홈 화면 스택 호버(Tech.jsx)에 노출하는 주요 이력. 상세 설명·이미지 포함.
// showOnHome: 홈 화면 스택에 노출할지 여부.
export const homeMilestones = [
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

// 연혁 페이지(History.jsx) 전체 목록. 같은 달의 이력은 items에 순서대로 담는다.
// items 항목은 문자열(제목만) 또는 { title, detail, image } — detail이 있으면 + 버튼으로 펼쳐 본다.
// 연도 내림차순 → 월 내림차순으로 정렬해 둔다.
export const historyEntries = [
  { id: "2026-06", year: "2026", month: "06", items: ["경찰청에 가상자산 분석 지원 용역 제공"] },
  {
    id: "2026-05",
    year: "2026",
    month: "05",
    items: ["국세청에 가상자산 탈세대응 거래추적 소프트웨어 제공"],
  },
  {
    id: "2026-04",
    year: "2026",
    month: "04",
    items: [
      "한국금융연구원·한국금융범죄예방협회 주관 '제3회 금융범죄예방을 위한 정책세미나'에서 '가상자산 거래의 불법 지갑 주소 추적과 효과' 발표",
      "베트남 MB Bank와 전략적 제휴 체결",
      "TranSight - 서비스 전체 리뉴얼 및 Auto Trace 기능 출시",
    ],
  },
  { id: "2026-01", year: "2026", month: "01", items: ["가상자산 범죄 및 자금세탁 보고서 최초 발간"] },
  { id: "2025-11", year: "2025", month: "11", items: ["TranSight - 수사기관 및 거래소 간 공조 요청 중계 기능 출시 (IAAN)"] },
  { id: "2025-09", year: "2025", month: "09", items: [
      {
        title: "중기부 '아기유니콘 육성사업 수익성장형 트랙 기업' 선정",
        detail:
          "중소벤처기업부 '아기유니콘 육성사업(수익성장형)'에 최종 선정되어, 성장 잠재력과 기술 경쟁력을 공식적으로 인정받았습니다.",
        image: true,
      },
    ] },
  {
    id: "2025-04",
    year: "2025",
    month: "04",
    items: [
      '가상자산 투자자 플랫폼 "세이퍼블록(SaferBlock)" 출시',
      "한국금융연구원 주관, '제2회 금융범죄예방을 위한 정책세미나'에서 '가상자산 활용 범죄 추적 및 사례' 발표",
    ],
  },

  {
    id: "2024-12",
    year: "2024",
    month: "12",
    items: ["중소벤처기업부 주관, 성과공유기업 지정", "벤처창업진흥 유공 중기부 장관상 수상"],
  },
  { id: "2024-08", year: "2024", month: "08", items: [
      {
        title: "'디지털자산 거래 추적 기술 개발' 정부 국책 과제 수주",
        detail:
          "과학기술정보통신부·정보통신기획평가원(IITP) 정보보호 핵심원천기술 개발사업을 수주하여, 디지털자산 위험거래 추적 기술 개발을 수행합니다.",
      },
    ] },
  { id: "2024-06", year: "2024", month: "06", items: ["가상자산 사기 피해 신고·조회 서비스 체인락 출시"] },
  { id: "2024-04", year: "2024", month: "04", items: ["디지털자산 투자정보 데이터 솔루션 데이핀 출시"] },
  { id: "2024-01", year: "2024", month: "01", items: ["TranSafer & TranSight 솔루션 정보보호관리체계(ISMS) 인증 획득"] },

  {
    id: "2023-11",
    year: "2023",
    month: "11",
    items: ["경찰청 주관, '제1회 사기방지 국제 컨퍼런스'에서 수사기관 맞춤형 솔루션(TranSight) 공개"],
  },
  { id: "2023-09", year: "2023", month: "09", items: ["국제표준인증획득(ISO9001·14001)", "경찰청, '사기방지 자문 위원 위촉'"] },
  { id: "2023-06", year: "2023", month: "06", items: ["KYT 솔루션 - TranSight 출시"] },
  { id: "2023-04", year: "2023", month: "04", items: ["실명인증 가상계좌 출시"] },
  {
    id: "2023-02",
    year: "2023",
    month: "02",
    items: ["삼정KPMG 전략적 업무 제휴", "TranSafer 솔루션 정보보호관리체계(ISMS) 인증 획득"],
  },

  { id: "2022-12", year: "2022", month: "12", items: ["네이버 전략적 업무 제휴"] },
  { id: "2022-11", year: "2022", month: "11", items: ["카카오뱅크-코인원 TranSafer 서비스 런칭"] },
  { id: "2022-06", year: "2022", month: "06", items: ["지급결제 서비스 제휴 (쿠콘, 삼성SDS, LG CNS)"] },
  { id: "2022-05", year: "2022", month: "05", items: ["기술혁신형중소기업 인증획득"] },
  { id: "2022-03", year: "2022", month: "03", items: ["카카오, 네이버 인증사업 제휴"] },

  { id: "2021-12", year: "2021", month: "12", items: ["서울 핀테크랩 매출부문 최우수상 수상"] },
  { id: "2021-10", year: "2021", month: "10", items: [
      "혁신성장형 벤처기업인증 획득",
      {
        title: "경찰청장 행정발전 기여 감사장 수상",
        detail: "금융범죄 예방 및 수사 공조에 기여한 공로로 경찰청장 행정발전 기여 감사장을 수상했습니다.",
      },
    ] },

  {
    id: "2020-06",
    year: "2020",
    month: "06",
    items: [
      {
        title: "케이뱅크-업비트 TranSafer 서비스 런칭",
        detail:
          "케이뱅크-업비트 실명계좌 연계를 기반으로 국내 최초의 원화 입출금 이상거래탐지 서비스 TranSafer를 런칭했습니다.",
        image: true,
      },
      "금융위원회 코리아핀테크위크 2020 선정",
    ],
  },

  { id: "2019-08", year: "2019", month: "08", items: ["금융위원회 규제 샌드박스 위탁테스트 기업 선정"] },

  { id: "2018-12", year: "2018", month: "12", items: ["기술보증기금 4차 산업 혁명 특화, 전문화 기업 선정"] },
  { id: "2018-05", year: "2018", month: "05", items: ["TranSafer 출시"] },

  { id: "2017-01", year: "2017", month: "01", items: ["보난자팩토리 설립"] },
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
