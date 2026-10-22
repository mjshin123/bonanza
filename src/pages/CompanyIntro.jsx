import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import Aurora from "../components/Aurora/Aurora.jsx";
import FinanceChart from "../components/FinanceChart.jsx";
import { accentNums } from "../lib/accentNums.jsx";

const revenueData = [
  { year: "2020", value: 4 },
  { year: "2021", value: 311 },
  { year: "2022", value: 153 },
  { year: "2023", value: 129 },
  { year: "2024", value: 229 },
];

const assetsData = [
  { year: "2020", value: 6 },
  { year: "2021", value: 165 },
  { year: "2022", value: 195 },
  { year: "2023", value: 250 },
  { year: "2024", value: 381 },
];

const achievementSections = [
  {
    key: "transafer",
    title: "원화 입출금 검증 시장 점유율 업계 1위",
    stats: [
      { label: "누적 입출금 검증 금액", value: "1,026", unit: "조" },
      { label: "이상거래 탐지 건수", value: "671", unit: "만" },
    ],
  },
  {
    key: "kyt",
    title: "데이터 수집부터 분석 기술까지 자체 구축한 소버린 KYT 솔루션",
    stats: [
      { label: "주소 식별 정보", value: "1", unit: "억+" },
      { label: "KYT 검증 건수", value: "9", unit: "억+" },
    ],
  },
  {
    key: "network",
    title: "국내 유일 수사기관-거래소 공조 네트워크로 응답 시간 단축",
    stats: [
      { label: "평균 공조 응답 시간", value: "48", unit: "분" },
      { label: "총 요청 건수", value: "120", unit: "건" },
    ],
  },
];

// 날짜 내림차순(최신순)이되, 가로스크롤 시작 시 가장 최신 카드가 2번째로 보이도록
// 맨 앞 카드 한 장을 뒤로 돌려 배치한다.
const awards = [
  { org: "중소벤처기업부", title: "벤처창업진흥 유공\n중기부 장관상 수상", date: "2024.12" },
  { org: "중소벤처기업부", title: "'아기유니콘 육성사업\n수익성장형 트랙 기업' 선정", date: "2025.09" },
  { org: "EURO CERT", title: "국제표준인증획득\nISO9001·14001", date: "2024.11" },
  { org: "한국인터넷진흥원", title: "ISMS 인증획득\n통합입출금 서비스 외", date: "2024.01" },
  { org: "중소벤처기업부", title: "기술혁신형 중소기업\n인증 획득 AA등급", date: "2022.05" },
  { org: "서울핀테크랩", title: "핀테크기업 매출부문\n최우수상 수상", date: "2021.12" },
  { org: "과학기술정보통신부", title: "혁신성장형\n벤처기업 인증 획득", date: "2021.10" },
  { org: "경찰청", title: "행사발전 기여\n감사장 수상", date: "2021.10" },
  { org: "금융위원회", title: "규제샌드박스\n위탁테스트 선정", date: "2019.08" },
];

function AwardCard({ org, title, date, tinted }) {
  return (
    <div
      className="bf-award-card"
      style={{
        background: tinted ? "#E7ECFB" : "#FAFAFB",
        border: "1px solid " + (tinted ? "#DAE2F8" : "var(--border)"),
        boxShadow: "0 1px 3px rgba(16,24,64,.05)",
      }}
    >
      <div className="bf-award-title" style={{ color: "var(--text-strong)" }}>
        {title}
      </div>
      <div className="bf-award-divider" style={{ background: tinted ? "#B7C4EE" : "var(--border-strong)" }} />
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>{org}</div>
      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 500, color: "var(--text-subtle)" }}>{date}</div>
    </div>
  );
}

const REVEAL_STAGGER = 0.12;

export default function CompanyIntro() {
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);
  const madeHeadingRef = useRef(null);
  const [descWidth, setDescWidth] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:860px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Below the mobile breakpoint the headline wraps instead of forcing a fixed
  // nowrap width, so the description block just flows full-width instead of
  // matching this measured pixel value (see the width:descWidth wrapper below).
  useLayoutEffect(() => {
    if (isMobile) return;
    function measure() {
      if (madeHeadingRef.current) setDescWidth(madeHeadingRef.current.offsetWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <section
        ref={darkZoneRef}
        style={{ position: "relative", overflow: "hidden", background: "#000" }}
      >
        <div className="bf-pad" style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "72px 48px 0" }}>
          <div
            className="bf-reveal"
            style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,.45)", fontSize: 13, fontWeight: 600, marginBottom: 40 }}
          >
            <Link to="/" style={{ color: "rgba(255,255,255,.45)" }}>홈</Link>
            <ChevronRight width={15} height={15} />
            <span style={{ color: "#fff" }}>회사 소개</span>
          </div>

          <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#5E8EFF", marginBottom: 20 }}>
            ABOUT US
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 64, flexWrap: "wrap" }}>
            <h1
              className="bf-accent bf-reveal"
              style={{
                margin: 0,
                flex: "1 1 480px",
                minWidth: 0,
                fontWeight: 500,
                fontSize: "clamp(26px,3.4vw,42px)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: "#fff",
              }}
            >
              Digital Asset Compliance
              <br />
              Leading Company
            </h1>

            <p
              className="bf-revealF"
              style={{
                flex: "1 1 320px",
                minWidth: 0,
                maxWidth: 400,
                margin: 0,
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.65)",
                fontWeight: 400,
              }}
            >
              보난자팩토리는 고객이 가상자산 거래를 보다 안전하게 할 수 있도록 투명한 디지털자산 생태계를 만들어가는 컴플라이언스 기업입니다.
            </p>
          </div>
        </div>

        <div style={{ position: "relative", marginTop: 120, height: 220 }}>
          <Aurora colorStops={["#1640DB", "#7B5CF0", "#5E8EFF"]} amplitude={1.2} blend={0.55} />
        </div>
      </section>

      <section className="bf-pad" style={{ background: "#000", padding: "0px 48px 160px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="bf-reveal" style={{ width: isMobile ? "100%" : "max-content", maxWidth: "100%", margin: "0 auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, height: isMobile ? "auto" : 62 }}>
              <div
                className="bf-accent"
                style={{
                  flex: "none",
                  whiteSpace: isMobile ? "normal" : "nowrap",
                  fontWeight: 500,
                  fontSize: isMobile ? "clamp(22px,7vw,32px)" : 48,
                  lineHeight: "130%",
                  display: "flex",
                  alignItems: "center",
                  color: "#5E8EFF",
                }}
              >
                불가능을 가능으로
              </div>
              <div style={{ width: isMobile ? undefined : 334.76, flex: isMobile ? "1 1 auto" : "none", borderTop: "1.5px solid #5E8EFF" }} />
            </div>
            <div
              ref={madeHeadingRef}
              className="bf-accent"
              style={{
                alignSelf: "flex-start",
                height: isMobile ? "auto" : 62,
                whiteSpace: isMobile ? "normal" : "nowrap",
                fontWeight: 500,
                fontSize: isMobile ? "clamp(22px,7vw,32px)" : 48,
                lineHeight: "130%",
                display: "flex",
                alignItems: "center",
                color: "#FFFFFF",
              }}
            >
              컴플라이언스의 새로운 표준을 만들다.
            </div>
            <div style={{ width: isMobile ? "100%" : descWidth ?? undefined }}>
            <p
              style={{
                margin: "50px 0 0",
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.6)",
                fontWeight: 400,
              }}
            >
              보난자팩토리는 전통 금융과 새로운 가상자산 시장을 안전하고 효율적으로 연결하는 레그테크(RegTech) 기반의
              컴플라이언스 기업입니다.
              <br />
              가상자산 시장의 여명기, 보난자팩토리는 아무도 시도하지 않은 기술적 돌파구를 찾아내며 성장을 시작했습니다.
            </p>

            <div style={{ margin: "28px 0 0", fontSize: 18, fontWeight: 700, lineHeight: 1.5, color: "#fff" }}>
              보난자팩토리의 시작: 거래소 원화입출금의 표준이 되다
            </div>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.6)",
                fontWeight: 400,
              }}
            >
              기존 가상자산 거래소와 은행 간의 원화 송금은 주로 가상계좌 방식에 의존해 왔습니다. 당행 실명 계좌 개설이
              필수적인 가상계좌 방식은 은행에는 계좌 발급·관리 부담을, 사용자에게는 번거로운 인증 절차를 안겨주었습니다.
            </p>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.6)",
                fontWeight: 400,
              }}
            >
              보난자팩토리는 이 문제를 해결하기 위해 거래소와 은행 시스템을 직접 연동하는 '펌뱅킹(Firm-Banking) 기반
              원화 송금 시스템'을 최초로 고안하였습니다. 이렇게 탄생한 'TranSafer'는 전자서명 인증 기반의 특허를
              획득했으며, 위험 고객 확인과 지급정지 연계 구조를 갖춰 금융위원회 규제 샌드박스를 통과했습니다. 2020년
              정식으로 상용화되어, 현재 국내 주요 거래소가 채택한 원화입출금 검증 솔루션으로 자리매김했습니다.
            </p>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.6)",
                fontWeight: 400,
              }}
            >
              규제가 없던 자리에 기준을 세우고, 불편했던 방식을 다시 설계하는 것이 지금의 보난자팩토리를 만든
              시작이었습니다.
            </p>

            <div style={{ margin: "28px 0 0", fontSize: 18, fontWeight: 700, lineHeight: 1.5, color: "#fff" }}>
              오늘날의 보난자팩토리: 대한민국 대표 컴플라이언스 파트너
            </div>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.6)",
                fontWeight: 400,
              }}
            >
              펌뱅킹 혁신으로 다져진 기술력과 보안 노하우를 바탕으로, 2023년 가상자산 지갑주소에 대한 온체인 KYT
              검증 솔루션인 TranSight를 출시했습니다. 자체 구축한 위험 지갑주소 데이터베이스를 기반으로, 클릭 한
              번으로 자금 흐름을 추적하는 독창적인 시각화 맵을 설계하였습니다. 2025년 법집행기관과 가상자산 거래소 간 공조 요청을 중계하는
              IAAN Protocol(*Institutional AML Alliance Network) 기능을 출시하며 독보적인 AML 솔루션으로 발전하고
              있습니다.
            </p>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,.6)",
                fontWeight: 400,
              }}
            >
              보난자팩토리는 가상자산, 기술, 규제에 대한 전문성을 바탕으로 성장해왔습니다. 기술이 규제를 앞서나갈 때
              발생하는 불안을 해소하며, 가장 안전한 디지털 자산 환경을 만들어갑니다.
            </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bf-pad" style={{ background: "#fff", padding: "96px 48px 120px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14, transitionDelay: `${0 * REVEAL_STAGGER}s` }}>
            주요 성과
          </div>
          {achievementSections.map((section, i) => (
            <div key={section.key} className="bf-reveal" style={{ marginBottom: 72, transitionDelay: `${(i + 1) * REVEAL_STAGGER}s` }}>
              <h2 className="bf-accent" style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: "#171717" }}>
                {accentNums(section.title)}
              </h2>
              <div className="bf-achstats" style={{ display: "grid", gridTemplateColumns: `repeat(${section.stats.length},1fr)`, gap: 72 }}>
                {section.stats.map((stat) => (
                  <div key={stat.label} style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
                    <div style={{ fontSize: 15, color: "var(--text-subtle)", marginBottom: 6 }}>
                      {stat.label}
                    </div>
                    <div className="bf-accent bf-accent-num" style={{ fontWeight: 500, fontSize: "clamp(32px,8vw,48px)", letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
                      {stat.value}
                      <span style={{ fontSize: 22, marginLeft: 4 }}>{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginTop: 120, marginBottom: 14, transitionDelay: `${(achievementSections.length + 1) * REVEAL_STAGGER}s` }}>
            재무 구조
          </div>
          <h2 className="bf-accent bf-reveal" style={{ margin: "0 0 32px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: "#171717", transitionDelay: `${(achievementSections.length + 2) * REVEAL_STAGGER}s` }}>
            건실한 재무 구조와 고성장 자회사의 시너지를 바탕으로 안정적인 성장 곡선을 만들어내고 있습니다.
          </h2>
          <div className="bf-reveal bf-finance" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, transitionDelay: `${(achievementSections.length + 3) * REVEAL_STAGGER}s` }}>
            <FinanceChart title="매출" unit="억원" data={revenueData} />
            <FinanceChart title="자산총계" unit="억원" data={assetsData} />
          </div>
        </div>
      </section>

      <section className="bf-pad" style={{ background: "#fff", padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14 }}>
            주요 인증 및 수상
          </div>
          <h2 className="bf-accent" style={{ margin: "0 0 48px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: "#171717" }}>
            공신력 있는 기관으로부터 기술력과 성장성을 인정받았습니다.
          </h2>
        </div>

        <div className="bf-reveal" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
          <div className="bf-marquee-viewport">
            <div className="bf-marquee-row bf-marquee-left">
              {[...awards, ...awards].map((award, i) => (
                <AwardCard key={i} {...award} tinted={i % 2 === 1} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
