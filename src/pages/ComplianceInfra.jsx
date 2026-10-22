import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight, ArrowRight } from "lucide-react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import InquiryModal from "../components/InquiryModal.jsx";
import useStepProgress from "../hooks/useStepProgress.js";
import { accentNums } from "../lib/accentNums.jsx";

const PARENT_COMPANY = { name: "보난자팩토리", email: "contact@bonanza-factory.co.kr" };

const HERO = {
  tagline: "기관 맞춤형 가상자산 컴플라이언스 인프라",
  title: "Compliance Infra",
  desc: "비수탁지갑 솔루션, KYT 검증, 가상자산 KRW 시세, 원화 입출금 검증까지. 보난자 그룹의 솔루션을 기관별 사업 모델에 맞게 조합해 스테이블코인·가상자산 서비스를 규제에 맞게 운영할 수 있도록 지원합니다.",
};

const OVERVIEW = {
  label: "Overview",
  heading: "보난자 그룹의 검증된 솔루션을, 각 기관의 사용 환경에 맞춰 조합해 제공합니다.",
};

// 구성 모듈: 계열사별 솔루션. href가 있으면 상세 페이지로 연결
const MODULES = [
  {
    key: "took",
    name: "TOOK",
    owner: "트라버스",
    category: "비수탁 통합 지갑",
    desc: "여러 비수탁 지갑을 한 화면에서 관리하는 통합 지갑 솔루션입니다. 금융기관 앱에 그대로 탑재해 고객에게 지갑 기능을 제공할 수 있습니다.",
  },
  {
    key: "krw",
    name: "KRW 시세 API",
    owner: "보난자랩",
    category: "원화 시세 데이터",
    desc: "가상자산·스테이블코인의 원화 환산가를 API로 제공합니다. 고객 화면 표시부터 자산 평가와 리포팅까지 활용할 수 있습니다.",
  },
  {
    key: "transafer",
    name: "TranSafer API",
    owner: "보난자팩토리",
    category: "원화 입출금 검증",
    desc: "고객 실명계좌를 바탕으로 거래소와 은행 사이의 원화 입출금을 검증하고 이상 거래를 차단합니다.",
    href: "/TranSafer",
  },
  {
    key: "transight-api",
    name: "TranSight API",
    owner: "보난자팩토리",
    category: "위험 주소 데이터 · KYT 검증",
    desc: "국내 최대 규모 가상자산 범죄 라벨링 데이터와 실시간 KYT API로 입출금 거래의 위험을 즉시 감지하고 차단합니다.",
    href: "/TranSight",
  },
  {
    key: "transight-web",
    name: "TranSight Web",
    owner: "보난자팩토리",
    category: "트랜잭션 맵 · 민관 공조",
    desc: "멀티체인 자금 흐름을 시각화해 핵심 경로를 추적하고, IAAN Protocol로 기관 간 실시간 동결 요청을 중계합니다.",
    href: "/TranSight",
  },
  {
    key: "transight-expert",
    name: "Expert Analysis",
    owner: "보난자팩토리",
    category: "전문 분석 · 리포트",
    desc: "가상자산 범죄 전문가가 온체인 분석과 긴급 대응 컨설팅을 수행하고 정기 인텔리전스 리포트를 발간합니다.",
    href: "/TranSight",
  },
];

// 기관 유형별 맞춤 조합
const INSTITUTIONS = [
  {
    key: "bank",
    label: "은행·금융기관",
    heading: "자사 앱에 디지털자산 지갑을 넣고, 규제 대응까지 갖추고 싶은 금융기관",
    needs: [
      "고객 자산을 직접 수탁하지 않고 지갑 서비스를 제공하고 싶습니다",
      "고객 자산을 원화 기준으로 보여 주고 평가해야 합니다",
      "입출금 계좌의 이상 거래와 자금세탁 위험을 관리해야 합니다",
    ],
    modules: ["took", "krw", "transafer", "transight-api", "transight-web"],
    outcome: "자사 앱 안에서 비수탁 지갑·원화 시세·AML이 연결된 디지털자산 서비스를 제공합니다.",
  },
  {
    key: "vasp",
    label: "가상자산사업자",
    heading: "거래소·수탁사 등 디지털자산 거래를 직접 다루는 사업자",
    needs: [
      "위험 주소와 의심 거래를 빠르게 식별하고 대응해야 합니다",
      "은행과의 원화 입출금 검증 절차를 갖춰야 합니다",
      "의심 거래의 자금 흐름을 추적하고 수사기관 요청에 대응해야 합니다",
    ],
    modules: ["transight-api", "transight-web", "transafer"],
    outcome: "KYT 검증과 자금 흐름 추적부터 원화 입출금 검증까지 하나의 체계로 운영합니다.",
  },
  {
    key: "public",
    label: "공공·수사기관",
    heading: "가상자산 관련 수사·감독·행정 업무를 수행하는 공공기관",
    needs: [
      "업무와 연관된 가상자산 주소와 자금 흐름을 추적해야 합니다",
      "위험 주소를 여러 사업자와 공유하고 동결을 요청해야 합니다",
      "기관 업무 시스템에서 주소 위험도를 바로 조회해야 합니다",
    ],
    modules: ["transight-api", "transight-web", "transight-expert"],
    outcome: "업무 시스템 API 연동부터 자금 흐름 추적, 사업자 공조, 전문 분석까지 한 번에 처리합니다.",
  },
];

const PROCESS = [
  { title: "도입 상담", text: "사업 모델과 규제 요건 확인" },
  { title: "요구사항 진단", text: "필요 기능과 현재 체계 점검" },
  { title: "맞춤 조합 설계", text: "모듈 구성과 연동 방식 확정" },
  { title: "연동·구축", text: "API·SDK 연동과 운영 환경 구성" },
  { title: "운영 지원", text: "모니터링과 규제 변화 대응" },
];

function renderHeading(text) {
  const idx = text.indexOf(",");
  if (idx === -1) return accentNums(text);
  return (
    <>
      {accentNums(text.slice(0, idx + 1))}
      <br />
      {accentNums(text.slice(idx + 1).trim())}
    </>
  );
}

const headingStyle = {
  wordBreak: "keep-all",
  fontWeight: 500,
  fontSize: "clamp(20px,2.1vw,30px)",
  lineHeight: 1.35,
  color: "#000",
};

const labelStyle = {
  textAlign: "center",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: "var(--primary)",
  marginBottom: 20,
};

// 히어로 우측: 기관 하나를 중심으로 모듈이 연결되는 구성도
function HubDiagram() {
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 12,
        padding: 20,
        border: "1px solid rgba(94,142,255,.25)",
        borderRadius: 16,
        background: "rgba(94,142,255,.14)",
      }}
    >
      <div
        style={{
          gridColumn: "1 / -1",
          marginBottom: 8,
          color: "#5E8EFF",
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        기관 맞춤 컴플라이언스 인프라
      </div>
      {MODULES.map((m) => (
        <div
          key={m.key}
          style={{
            padding: "16px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.12)",
            background: "rgba(255,255,255,.03)",
            minWidth: 0,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.45)", marginBottom: 6 }}>{m.category}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", wordBreak: "keep-all" }}>{m.name}</div>
        </div>
      ))}
    </div>
  );
}

// 선택된 모듈은 파란 테두리 + 연한 파란 배경, 선택 안 된 모듈은 회색 테두리만
function ModuleChip({ module, on }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "9px 14px",
        borderRadius: 6,
        border: `1px solid ${on ? "#1640DB" : "var(--border)"}`,
        background: on ? "rgba(22,64,219,.06)" : "#fff",
        color: on ? "#1640DB" : "#B4BACB",
        transition: "background .3s ease, color .3s ease, border-color .3s ease",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600 }}>{module.name}</span>
      <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.8 }}>{module.category}</span>
    </div>
  );
}

const TAB_INTERVAL_MS = 4000;

// 화면에 보이는 동안 일정 시간마다 다음 기관으로 넘기고, 마우스를 올리거나 누르고 있는 동안은 멈춤
function InstitutionTabs() {
  const ref = useRef(null);
  const [activeKey, setActiveKey] = useState(INSTITUTIONS[0].key);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = INSTITUTIONS.find((inst) => inst.key === activeKey);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused) return undefined;
    const timer = setTimeout(() => {
      const i = INSTITUTIONS.findIndex((inst) => inst.key === activeKey);
      setActiveKey(INSTITUTIONS[(i + 1) % INSTITUTIONS.length].key);
    }, TAB_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [visible, paused, activeKey]);

  return (
    <div
      ref={ref}
      onMouseLeave={() => setPaused(false)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        role="tablist"
        aria-label="기관 유형"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 48 }}
      >
        {INSTITUTIONS.map((inst) => {
          const selected = inst.key === activeKey;
          return (
            <button
              key={inst.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onMouseEnter={() => {
                setPaused(true);
                setActiveKey(inst.key);
              }}
              onClick={() => {
                setPaused(true);
                setActiveKey(inst.key);
              }}
              // TranSight·TranSafer 상세의 API 태그와 같은 크기, 선택 전에는 연한 배경
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6.5px 16px",
                borderRadius: 30,
                border: "none",
                background: selected ? "#1640DB" : "#F4F5FB",
                color: selected ? "#fff" : "#7A8299",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background .2s ease, color .2s ease",
              }}
            >
              {inst.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="bf-split"
        onMouseEnter={() => setPaused(true)}
        style={{ display: "grid", gridTemplateColumns: "minmax(0,607px) minmax(0,380px)", justifyContent: "center", gap: 64, alignItems: "start", margin: "0 auto" }}
      >
        <div>
          <h3
            style={{ margin: 0, fontSize: "clamp(18px,1.6vw,22px)", fontWeight: 700, lineHeight: 1.45, color: "#000", wordBreak: "keep-all" }}
          >
            {active.heading}
          </h3>
          <ul style={{ listStyle: "none", margin: "28px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {active.needs.map((need, i) => (
              <li
                key={need}
                style={{ display: "flex", gap: 14, fontSize: 15, lineHeight: 1.6, color: "#2F2F2F", wordBreak: "keep-all" }}
              >
                <span style={{ flex: "none", fontWeight: 600, color: "#2A5BFF" }}>{String(i + 1).padStart(2, "0")}</span>
                {need}
              </li>
            ))}
          </ul>
          <div
            style={{
              marginTop: 32,
              padding: "20px 24px",
              borderLeft: "3px solid #1640DB",
              background: "#F4F5FB",
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1.6,
              color: "#1640DB",
              wordBreak: "keep-all",
            }}
          >
            {active.outcome}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {MODULES.map((m) => (
              <ModuleChip key={m.key} module={m} on={active.modules.includes(m.key)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 6개를 한 줄에 두는 세로형 카드: 분류·이름·설명은 위, 계열사는 아래에 고정
function ModuleCard({ module }) {
  const body = (
    <>
      <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5, color: "#2A5BFF", wordBreak: "keep-all" }}>{module.category}</span>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 14, fontSize: 19, fontWeight: 700, lineHeight: 1.35, color: "#000", wordBreak: "keep-all" }}>
        {module.name}
        {module.href && <ArrowUpRight width={18} height={18} color="#1640DB" style={{ flex: "none", marginTop: 3 }} />}
      </div>
      <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.7, color: "#5A6178", wordBreak: "keep-all" }}>{module.desc}</p>
      <span className="bf-moduleowner" style={{ marginTop: "auto", paddingTop: 24, fontSize: 12, fontWeight: 600, color: "#9AA1B5", transition: "color .2s ease" }}>{module.owner}</span>
    </>
  );

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: 320,
    padding: "28px 22px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "#fff",
    minWidth: 0,
    transition: "border-color .2s ease",
  };

  if (module.href) {
    return (
      <Link to={module.href} className="bf-modulecard" style={cardStyle}>
        {body}
      </Link>
    );
  }
  return <div className="bf-modulecard" style={cardStyle}>{body}</div>;
}

function ProcessSteps() {
  const count = PROCESS.length;
  const [ref, active] = useStepProgress(count);
  return (
    <div
      ref={ref}
      className="bf-flowsteps"
      style={{ display: "grid", gridTemplateColumns: `repeat(${count},1fr)`, columnGap: 16, maxWidth: 1040, margin: "0 auto" }}
    >
      {PROCESS.map((step, i) => {
        const on = i <= active;
        return (
        <div key={step.title} style={{ minWidth: 0, textAlign: "center" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span
              style={{
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: on ? "#1640DB" : "#fff",
                border: "1.5px solid #1640DB",
                color: on ? "#fff" : "#1640DB",
                fontSize: 12,
                fontWeight: 700,
                // 앞 연결선이 다 채워진 뒤 원이 켜지도록 지연 (TranSafer 프로세스와 동일)
                transition: `background .3s ease ${on && i > 0 ? ".4s" : "0s"}, color .3s ease ${on && i > 0 ? ".4s" : "0s"}`,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < count - 1 && (
              <span
                className="bf-flowline"
                style={{
                  position: "absolute",
                  left: "calc(50% + 16px)",
                  width: "calc(100% - 16px)",
                  top: "50%",
                  height: 1,
                  background: "#C9D3F5",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#1640DB",
                    transform: `scaleX(${i < active ? 1 : 0})`,
                    transformOrigin: "left",
                    transition: i < active ? "transform .4s linear" : "none",
                  }}
                />
              </span>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#2F2F2F", marginBottom: 6 }}>{step.title}</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#7A8299", padding: "0 4px", wordBreak: "keep-all" }}>{step.text}</div>
        </div>
        );
      })}
    </div>
  );
}

export default function ComplianceInfra() {
  const heroRef = useRef(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  useNavDarkZone(heroRef);

  useEffect(() => {
    document.title = `${HERO.title} | Bonanza Factory`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <section
        ref={heroRef}
        className="bf-pad"
        style={{ position: "relative", overflow: "hidden", background: "#0A0A0A", padding: "72px 48px 120px" }}
      >
        <div
          style={{ position: "relative", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 60, maxWidth: 1400, margin: "0 auto" }}
        >
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <div
              className="bf-reveal"
              style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,.45)", fontSize: 13, fontWeight: 600, marginBottom: 40 }}
            >
              <Link to="/" style={{ color: "rgba(255,255,255,.45)" }}>홈</Link>
              <ChevronRight width={15} height={15} />
              <span style={{ color: "#fff" }}>{HERO.title}</span>
            </div>

            <div
              className="bf-reveal"
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#5E8EFF", marginBottom: 20 }}
            >
              {HERO.tagline}
            </div>
            <h1
              className="bf-accent bf-reveal"
              style={{
                margin: 0,
                fontWeight: 500,
                fontSize: "clamp(26px,3.4vw,42px)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: "#fff",
                maxWidth: 720,
              }}
            >
              {accentNums(HERO.title)}
            </h1>
            <p
              className="bf-revealF"
              style={{ margin: "28px 0 0", maxWidth: 560, fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,.65)", wordBreak: "keep-all" }}
            >
              {HERO.desc}
            </p>
          </div>

          <div className="bf-reveal" style={{ flex: "1 1 420px", maxWidth: 640, minWidth: 0 }}>
            <HubDiagram />
          </div>
        </div>
      </section>

      <section className="bf-pad" style={{ background: "#fff", padding: "110px 40px 130px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 160 }}>
          <div className="bf-reveal">
            <div style={labelStyle}>{OVERVIEW.label}</div>
            <h2 className="bf-accent" style={{ ...headingStyle, margin: "0 auto 56px", maxWidth: 1200, textAlign: "center" }}>
              {renderHeading(OVERVIEW.heading)}
            </h2>
            <div className="bf-modulegrid" style={{ display: "grid", gridTemplateColumns: `repeat(${MODULES.length},1fr)`, gap: 14 }}>
              {MODULES.map((m) => (
                <ModuleCard key={m.key} module={m} />
              ))}
            </div>
          </div>

          <div className="bf-reveal">
            <div style={labelStyle}>Modules</div>
            <h2 className="bf-accent" style={{ ...headingStyle, margin: "0 auto 28px", maxWidth: 1200, textAlign: "center" }}>
              {renderHeading("기관마다 필요한 컴플라이언스는 다릅니다, 필요한 솔루션만 골라 하나의 인프라로 연결합니다.")}
            </h2>
            <InstitutionTabs />
          </div>

          <div className="bf-reveal">
            <div style={labelStyle}>Process</div>
            <h2 className="bf-accent" style={{ ...headingStyle, margin: "0 auto 56px", maxWidth: 1200, textAlign: "center" }}>
              {renderHeading("기관의 사업 모델과 규제 요건에 맞춘 구성을 제안하고, 모듈 단위 도입부터 전체 구축까지 함께 진행합니다.")}
            </h2>
            <ProcessSteps />
          </div>

          <div className="bf-reveal" style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                border: "none",
                borderRadius: 4,
                background: "#1640DB",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              도입 상담 문의 <ArrowRight width={16} height={16} />
            </button>
          </div>
        </div>
      </section>

      <InquiryModal
        open={inquiryOpen}
        company={PARENT_COMPANY.name}
        email={PARENT_COMPANY.email}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
