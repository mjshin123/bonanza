import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, PlayCircle, Route, ScanSearch, Archive, WalletCards, ArrowLeftRight, ShieldCheck, FileText, Search, FileWarning } from "lucide-react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { subsidiaries } from "../data/subsidiaries.js";
import InquiryModal from "../components/InquiryModal.jsx";
import Orb from "../components/Orb/Orb.jsx";
import { accentNums } from "../lib/accentNums.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const PARENT_COMPANY = { name: "보난자팩토리", email: "contact@bonanza-factory.co.kr" };
const PARENT_DESC =
  "보난자팩토리는 고객이 가상자산 거래를 보다 안전하게 할 수 있도록 투명한 디지털자산 생태계를 만들어가는 컴플라이언스 기업입니다. 그룹의 자회사들과 함께 데이터·보안·인프라 기술 시너지를 이끌어갑니다.";

const solutionItems = [
  {
    company: "보난자랩",
    title: "Market Data",
    desc: "국내 및 글로벌 주요 디지털자산 거래소와의 라이선스를 기반으로 기관에 최적화된 통합 마켓데이터를 제공합니다.",
    preview: "market-data",
    link: "https://bonanzalab.io/products/market-data",
  },
  {
    company: "보난자랩",
    title: "Market Analytics",
    desc: "마켓데이터는 물론 디지털자산 관련 다양한 데이터를 기반으로 산출한 독자적인 시장분석 지표를 제공합니다.",
    preview: "market-analytics",
    link: "https://bonanzalab.io/products/analytics",
  },
  {
    company: "보난자랩",
    title: "Reference Rate",
    desc: "국내 5대 거래소 마켓데이터를 기반으로 원화 디지털자산 기준가격을 제공합니다.",
    preview: "reference-rate",
    link: "https://bonanzalab.io/products/reference-rate",
  },
  {
    company: "보난자랩",
    title: "Index Solutions",
    desc: "디지털자산 지수의 설계부터 산출까지 지수사업에 필요한 모든 것을 제공합니다.",
    preview: "index-solutions",
    link: "https://bonanzalab.io/products/index-solution",
  },
  {
    company: "트라버스",
    title: "디지털자산 지갑·송금 인프라 솔루션, took!",
    desc: "기업과 기관이 디지털자산 지갑 및 송금 서비스를 효율적으로 구축·운영할 수 있도록 지원하는 WaaS(Wallet-as-a-Service) 솔루션입니다. KYT 기능을 내재화하여 디지털자산 거래 위험을 실시간으로 모니터링하고, 규제 준수와 안전한 자산 관리를 지원하는 통합 인프라를 제공합니다.",
    link: "https://tookwallet.com",
    preview: "took",
  },
  {
    company: "트라버스",
    title: "AI 기반 온체인 보안 위협 추적 및 아카이브 솔루션, BlackPaper",
    desc: "블랙페이퍼는 지능형 알고리즘을 통해 가상자산 해킹 사고를 실시간으로 추적하고 아카이빙합니다. 주요 해킹 사고의 온체인 데이터를 정밀 분석하여 사건별 공격 기법, 자금 이동 경로, 피해 및 회수 현황을 다각도로 파악합니다. 검증된 사건 기록과 공격 패턴 분석을 통해 향후 발생할 보안 위협에 선제적으로 대응할 수 있도록 지원합니다.",
    preview: "blackpaper",
  },
  {
    company: "트라버스",
    title: "디지털자산 거래 조회·신고 플랫폼, SaferBlock",
    desc: "디지털자산 거래정보 조회와 의심거래 및 범죄 관련 정보 신고 기능을 제공하는 플랫폼입니다. 실시간 가상자산 뉴스와 전문 분석 리포트를 통해 주요 시장 동향 및 위험정보를 제공하며, 이용자의 거래 위험 식별과 범죄 피해 예방을 지원합니다.",
    link: "https://saferblock.io",
    preview: "saferblock",
  },
  {
    company: "바이스",
    title: "AI기반 비즈니스 프로필 서비스, Felore",
    desc: "펠로어는 링크 하나로 나를 소개하는 AI 비즈니스 프로필입니다. 경력과 학력 인증, 직접 만난 사람들이 남긴 평판 키워드와 피드백, 명함 네트워크를 한 화면에 담아 처음 만나는 상대에게도 신뢰를 빠르게 전달합니다. AI가 프로필을 분석해 한 줄 페르소나를 만들고, 상대와의 공통점과 케미를 알려줘 더 좋은 만남을 돕습니다.",
    link: "https://felore.me",
    video: "/videos/felore.mp4",
    poster: "/videos/felore-poster.jpg",
  },
  {
    company: "플러그앤엑스",
    title: "금융 거래를 위한 간편인증·전자문서 서비스",
    desc: "플러그앤엑스는 네이버·카카오 본인인증과 전자문서 서비스의 공식 대행사입니다. 금융사와 가상자산 거래소가 별도 개발 부담 없이 간편인증·전자서명·전자문서를 도입할 수 있도록, 도입 상담부터 연동과 운영까지 함께합니다. 금융권과 쌓아온 파트너십과 노하우를 바탕으로 프롭테크 영역까지 서비스를 넓혀가고 있습니다.",
    textOnly: true,
  },
];

function ReferenceRatePreview({ style, animate }) {
  const key = { color: "#7fa8ff" };
  const value = { color: "#7dd3a0" };
  const muted = { color: "#6b7280" };
  const [typingCycle, setTypingCycle] = useState(0);

  useEffect(() => {
    if (!animate) return undefined;
    const cycle = window.setInterval(() => setTypingCycle((current) => current + 1), 4200);
    return () => window.clearInterval(cycle);
  }, [animate]);

  return (
    <div className={`bf-reference-rate-preview${animate ? " is-typing" : ""}`} style={style}>
      <div className="bf-reference-rate-head">
        <span /><span /><span />
        <span className="bf-reference-rate-label">reference rate - daily</span>
      </div>
      <div key={animate ? typingCycle : "idle"} className="bf-reference-rate-body">
        <div><b style={{ color: "#2f6bff" }}>&gt; </b><strong style={{ color: "#fff" }}>POST </strong>/api/rate/reference</div>
        <div style={muted}>  &#123; <span style={key}>"marketCodes"</span>: <span style={value}>["KRW-BTC"]</span>, <span style={key}>"tranDtime"</span>: <span style={value}>"20260807093010"</span> &#125;</div>
        <div className="bf-reference-rate-gap" />
        <div><span className="bf-reference-rate-status"><i />200 - Result <em>⌄</em></span></div>
        <div className="bf-reference-rate-gap" />
        <div style={muted}>  &#123;</div>
        <div><span style={key}>  "rspCode":            </span><span style={value}>"A0000"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "rspMessage":         </span><span style={value}>"처리 성공"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "dataList":           </span><span style={muted}>[</span></div>
        <div style={muted}>    &#123;</div>
        <div><span style={key}>      "assetSymbol":        </span><span style={value}>"BTC"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "marketCode":         </span><span style={value}>"KRW-BTC"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "rateDate":           </span><span style={value}>"20260807"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "referenceRate":      </span><span style={value}>"91200990.49021043"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "realtimeIndex":      </span><span style={value}>"91192556.02491529"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "calcWindowStart":    </span><span style={value}>"20260807155500"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "calcWindowEnd":      </span><span style={value}>"20260807160000"</span><span style={muted}>,</span></div>
        <div><span style={key}>      "timestamp":          </span><span style={muted}>1793686707848</span></div>
        <div style={muted}>    &#125;</div>
        <div style={muted}>  ],</div>
        <div><span style={key}>  "dataListCnt":        </span><span style={muted}>1,</span></div>
        <div><span style={key}>  "tranDtime":          </span><span style={value}>"20260807093010"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "tranNo":             </span><span style={value}>"000000"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "rspDtime":           </span><span style={value}>"20260807160005"</span></div>
        <div style={muted}>  &#125;</div>
        <div><b style={{ color: "#2f6bff" }}>&gt; </b><i className="bf-reference-rate-cursor" /></div>
      </div>
    </div>
  );
}

function MarketDataPreview({ style, animate }) {
  const key = { color: "#7fa8ff" };
  const value = { color: "#7dd3a0" };
  const muted = { color: "#6b7280" };
  const [typingCycle, setTypingCycle] = useState(0);
  const rows = [
    ["assetSymbol", '"BTC"'], ["assetId", "13"], ["marketCode", '"KRW-BTC"'], ["tradePrice", '"91064260.14279658"'],
    ["open", '"91243051.94748475"'], ["high", '"91379658.13394713"'], ["low", '"90906300.52598871"'],
    ["change", '"-178791.8046881706"'], ["changeRate", '"-0.1959511446"'], ["flag", '"DOWN"'],
    ["accTradeValue", '"9737558857.2465"'], ["accTradeVol", '"106.87181832"'], ["tradeVol", '"0.00604628"'],
    ["accBuyVol", '"43.70866415"'], ["accSellVol", '"63.16315417"'], ["highest52WeekPrice", '"179986861.18961632"'],
    ["highest52WeekDate", '"20251005"'], ["lowest52WeekPrice", '"82091500.50799182"'], ["lowest52WeekDate", '"20260205"'],
    ["preClosedPrice", '"91243101.86591277"'], ["timestamp", "1793687806604"],
  ];

  useEffect(() => {
    if (!animate) return undefined;
    const cycle = window.setInterval(() => setTypingCycle((current) => current + 1), 6200);
    return () => window.clearInterval(cycle);
  }, [animate]);

  return (
    <div className={`bf-reference-rate-preview bf-market-data-preview${animate ? " is-typing" : ""}`} style={style}>
      <div className="bf-reference-rate-head">
        <span /><span /><span />
        <span className="bf-reference-rate-label">market data - ticker</span>
      </div>
      <div key={animate ? typingCycle : "idle"} className="bf-reference-rate-body">
        <div><b style={{ color: "#2f6bff" }}>&gt; </b><strong style={{ color: "#fff" }}>POST </strong>/api/trade/exchange</div>
        <div style={muted}>  &#123; <span style={key}>"marketCodes"</span>: <span style={value}>["KRW-BTC"]</span>, <span style={key}>"tranDtime"</span>: <span style={value}>"20260801093010"</span> &#125;</div>
        <div className="bf-reference-rate-gap" />
        <div><span className="bf-reference-rate-status"><i />200 - Result <em>⌄</em></span></div>
        <div className="bf-reference-rate-gap" />
        <div style={muted}>  &#123;</div>
        <div><span style={key}>  "rspCode":            </span><span style={value}>"A0000"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "rspMessage":         </span><span style={value}>"처리 성공"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "dataList":           </span><span style={muted}>[</span></div>
        <div style={muted}>    &#123;</div>
        {rows.map(([name, rowValue], index) => (
          <div key={name}>
            <span style={key}>{`      "${name}":`.padEnd(27, " ")}</span>
            <span style={name === "timestamp" ? muted : value}>{rowValue}</span>
            {index < rows.length - 1 && <span style={muted}>,</span>}
          </div>
        ))}
        <div style={muted}>    &#125;</div>
        <div style={muted}>  ],</div>
        <div><span style={key}>  "dataListCnt":        </span><span style={muted}>1,</span></div>
        <div><span style={key}>  "tranDtime":          </span><span style={value}>"20260801093010"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "tranNo":             </span><span style={value}>"000000"</span><span style={muted}>,</span></div>
        <div><span style={key}>  "rspDtime":           </span><span style={value}>"20260807111415"</span></div>
        <div style={muted}>  &#125;</div>
        <div><b style={{ color: "#2f6bff" }}>&gt; </b><i className="bf-reference-rate-cursor" /></div>
      </div>
    </div>
  );
}

function IndexSolutionsPreview({ style }) {
  const inputPaths = [
    "M 72 86 H 150 V 217 H 259", "M 72 166 H 174 V 229 H 259",
    "M 72 246 H 174 V 239 H 259", "M 72 326 H 150 V 251 H 259",
  ];
  const chart = "M 0 39 L 6 21 L 12 30 L 18 13 L 23 19 L 29 4 L 35 15 L 40 26 L 46 17 L 52 35 L 58 48 L 63 37 L 69 54 L 75 82 L 81 72 L 87 91 L 92 76 L 98 96 L 104 85 L 110 102 L 115 89 L 121 48 L 127 61 L 133 87 L 138 93 L 144 87 L 150 91 L 156 78 L 161 85 L 167 67 L 173 76 L 179 61 L 185 72 L 190 80 L 196 74";

  return (
    <div className="bf-index-solutions-preview" style={style}>
      <svg viewBox="0 0 660 460" role="img" aria-label="데이터셋이 산출 엔진을 거쳐 지수로 만들어지는 흐름 일러스트">
        <defs>
          <linearGradient id="bf-index-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity=".16" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></linearGradient>
          <radialGradient id="bf-index-base" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="var(--primary)" stopOpacity=".9" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></radialGradient>
        </defs>
        {inputPaths.map((path, index) => <g key={path}><path d={path} fill="none" stroke="var(--border)" strokeWidth="1.5" /><circle className="bf-index-dot" r="3" fill="var(--primary)" fillOpacity=".42" style={{ offsetPath: `path('${path}')`, animationDelay: `${index * .45}s` }} /></g>)}
        <path d="M341 236 H404" fill="none" stroke="var(--primary)" strokeOpacity=".6" strokeWidth="2.4" />
        {[63.6, 143.6, 223.6, 303.6].map((y, index) => <g key={y} transform={`translate(24 ${y}) scale(.7)`}><rect width="64" height="64" rx="18" fill="var(--primary-subtle-bg)" />{index === 0 && <><circle cx="14" cy="24" r="12" fill="var(--primary)" /><circle cx="14" cy="24" r="5" fill="#fff" /><rect x="30" y="13" width="18" height="6" rx="3" fill="var(--border)" /><rect x="30" y="25" width="18" height="6" rx="3" fill="var(--border)" /></>}{index === 1 && <><path d="M4 12h26l-8-8h12l12 10-12 10H22l8-8H4z" fill="var(--primary)" /><path d="M44 36H18l8 8H14L2 34l12-10h12l-8 8h26z" fill="var(--border-strong)" /></>}{index === 2 && <>{[48, 34, 42, 22].map((width, row) => <rect key={width} x="0" y={4 + row * 12} width={width} height="8" rx="2" fill={row === 1 ? "var(--primary)" : "var(--border-strong)"} />)}</>}{index === 3 && <>{[8, 20, 32].map((yPos, row) => <rect key={yPos} x="4" y={yPos} width="40" height="10" rx="5" fill={row === 1 ? "var(--primary)" : "var(--border-strong)"} />)}</>}</g>)}
        <g><ellipse className="bf-index-base" cx="300" cy="293" rx="74" ry="21" fill="url(#bf-index-base)" /><path d="M232 272 L300 303 L368 272 L368 280 L300 311 L232 280Z" fill="#0e2a8f" /><path d="M300 241 L368 272 L300 303 L232 272Z" fill="var(--primary)" /><path d="M300 188 L341 211 L300 234 L259 211Z" fill="#fff" stroke="var(--primary)" strokeOpacity=".45" strokeWidth="1.5" /><path d="M259 211 L300 234 L300 277 L259 254Z" fill="var(--primary)" fillOpacity=".14" /><path d="M341 211 L300 234 L300 277 L341 254Z" fill="var(--primary)" fillOpacity=".24" /><rect className="bf-index-beam" x="259" y="211" width="82" height="30" fill="var(--primary)" fillOpacity=".16" /></g>
        <g transform="translate(404 128)"><rect width="236" height="216" rx="16" fill="#fff" stroke="var(--border)" /><text x="20" y="32" fontSize="11" fontWeight="700" letterSpacing="1.6" fill="var(--text-muted)">INDEX</text><text x="20" y="66" fontSize="21" fontWeight="700" fill="var(--text-strong)">1,284.62</text><text x="106" y="66" fontSize="11" fontWeight="600" fill="#c4433d">▲ +2.41%</text><g transform="translate(20 92)"><path d={`${chart} L196 106 L0 106Z`} fill="url(#bf-index-area)" /><path d={chart} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g></g>
      </svg>
    </div>
  );
}

function MarketAnalyticsPreview({ style }) {
  const prices = [
    ["BTC", "84,120,000", "+2.41%", "#c4433d"],
    ["ETH", "4,382,500", "-0.87%", "#3d43c4"],
    ["XRP", "3,124", "+5.02%", "#c4433d"],
  ];

  return (
    <div className="bf-market-analytics-preview" style={{ ...style, display: "flex" }}>
      <div className="bf-market-dashboard-bg" aria-hidden="true">
        <div className="bf-market-dashboard-window">
          <span className="bf-market-dashboard-title" />
          <span className="bf-market-dashboard-rule" />
          <svg viewBox="0 0 150 96" preserveAspectRatio="none"><path d="M0 82 L22 73 L39 78 L61 57 L77 66 L98 39 L112 49 L145 9" fill="none" stroke="#8cadE2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="bf-market-dashboard-card"><i /><span /><b /></div>
      </div>
      <div className="bf-market-widget">
        <div className="bf-market-widget-title"><strong>투자정보 위젯</strong><span>KRW</span></div>
        <div className="bf-market-widget-tabs"><b>시세</b><span>차트</span><span>뉴스</span></div>
        <div className="bf-market-widget-prices">
          {prices.map(([asset, price, change, color]) => <div key={asset}><span>{asset}</span><strong>{price}</strong><b style={{ color }}>{change}</b></div>)}
        </div>
        <div className="bf-market-widget-foot">5대 원화마켓 통합 · 1초 갱신</div>
      </div>
    </div>
  );
}

function BlackPaperPreview({ style, animate }) {
  const cards = [
    { label: "TRACE", text: "온체인 자금 흐름 추적", Icon: Route },
    { label: "ANALYZE", text: "공격 패턴 정밀 분석", Icon: ScanSearch },
    { label: "ARCHIVE", text: "검증된 사건 기록 보관", Icon: Archive },
  ];

  return (
    <div className={`bf-blackpaper-preview${animate ? " is-active" : ""}`} style={{ ...style, display: "flex" }}>
      <div className="bf-blackpaper-head">
        <img src="/images/blackpaper-logo.png" alt="BLACK PAPER" />
        <span>ON-CHAIN THREAT INTELLIGENCE</span>
      </div>
      <div className="bf-blackpaper-cards">
        {cards.map(({ label, text, Icon }, index) => <div key={label} className="bf-blackpaper-card" style={{ animationDelay: `${index * .48}s` }}><Icon /><strong>{label}</strong><span>{text}</span></div>)}
      </div>
    </div>
  );
}

function TookPreview({ style, animate }) {
  const cards = [
    { label: "Wallet", text: "멀티체인 지갑 관리", Icon: WalletCards },
    { label: "Send & Pay", text: "간편 송금 · 결제", Icon: ArrowLeftRight },
    { label: "KYT", text: "위험 주소 확인", Icon: ShieldCheck },
  ];

  return (
    <div className={`bf-took-preview${animate ? " is-active" : ""}`} style={{ ...style, display: "flex" }}>
      <div className="bf-took-head"><img src="/images/took-icon.png" alt="" /><img src="/images/took-wordmark.png" alt="took!" /></div>
      <div className="bf-took-tagline">모든 지갑을 한 곳에 툭.</div>
      <div className="bf-took-subtitle">지갑 관리부터 송금 · 결제, 위험 주소 확인까지.</div>
      <div className="bf-took-cards">{cards.map(({ label, text, Icon }, index) => <div key={label} className="bf-took-card" style={{ animationDelay: `${index * .48}s` }}><Icon /><strong>{label}</strong><span>{text}</span></div>)}</div>
    </div>
  );
}

function SaferBlockPreview({ style, animate }) {
  const cards = [
    { label: "Block News", text: "실시간 글로벌 뉴스", Icon: FileText },
    { label: "SaferView", text: "블록체인 분석 콘텐츠", Icon: Search },
    { label: "Report", text: "가상자산 피해 신고 · 조회", Icon: FileWarning },
  ];

  return (
    <div className={`bf-saferblock-preview${animate ? " is-active" : ""}`} style={{ ...style, display: "flex" }}>
      <div className="bf-saferblock-head">
        <img src="/images/saferblock-logo.webp" alt="SaferBlock" />
        <span>Blockchain Security Intelligence</span>
      </div>
      <div className="bf-saferblock-cards">{cards.map(({ label, text, Icon }, index) => <div key={label} className="bf-saferblock-card" style={{ animationDelay: `${index * .48}s` }}><Icon /><strong>{label}</strong><span>{text}</span></div>)}</div>
    </div>
  );
}

// Match the default placeholder's area using the media's intrinsic aspect ratio,
// bounded by the available column width and with no forced media height.
function SolutionMedia({ item, iconSize, boxStyle, animate = true }) {
  const [sourceRatio, setSourceRatio] = useState(item.video ? 9 / 16 : 16 / 10);
  const mediaStyle = {
    display: "block",
    width: `${Math.min(1, Math.sqrt((10 / 16) * sourceRatio)) * 100}%`,
    maxWidth: "100%",
    height: "auto",
    marginTop: boxStyle.marginTop,
    marginBottom: boxStyle.marginBottom,
    marginLeft: "auto",
    marginRight: "auto",
    flex: "none",
    borderRadius: 16,
    overflow: "hidden",
  };
  if (item.textOnly) return null;
  if (item.preview === "reference-rate") {
    return <ReferenceRatePreview style={mediaStyle} animate={animate} />;
  }
  if (item.preview === "market-data") {
    return <MarketDataPreview style={mediaStyle} animate={animate} />;
  }
  if (item.preview === "index-solutions") {
    return <IndexSolutionsPreview style={mediaStyle} />;
  }
  if (item.preview === "market-analytics") {
    return <MarketAnalyticsPreview style={mediaStyle} />;
  }
  if (item.preview === "blackpaper") {
    return <BlackPaperPreview style={mediaStyle} animate={animate} />;
  }
  if (item.preview === "took") {
    return <TookPreview style={mediaStyle} animate={animate} />;
  }
  if (item.preview === "saferblock") {
    return <SaferBlockPreview style={mediaStyle} animate={animate} />;
  }
  if (item.video) {
    return (
      <video
        src={item.video}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={({ currentTarget }) => {
          if (currentTarget.videoWidth && currentTarget.videoHeight) {
            setSourceRatio(currentTarget.videoWidth / currentTarget.videoHeight);
          }
        }}
        style={mediaStyle}
      />
    );
  }
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.title}
        onLoad={({ currentTarget }) => {
          if (currentTarget.naturalWidth && currentTarget.naturalHeight) {
            setSourceRatio(currentTarget.naturalWidth / currentTarget.naturalHeight);
          }
        }}
        style={mediaStyle}
      />
    );
  }
  return (
    <div style={boxStyle}>
      <PlayCircle width={iconSize} height={iconSize} />
      <span style={{ fontSize: 12, fontWeight: 600 }}>이미지 / 영상 영역</span>
    </div>
  );
}

function AccordionRow({ item, index, open, onOpen }) {
  const num = String(index + 1).padStart(2, "0");
  const closedAlign = "center";

  return (
    <div
      id={`bf-acc-${index}`}
      className="bf-groupacc-row"
      onClick={() => onOpen(index)}
      style={{
        display: "grid",
        gridTemplateColumns: "56px 90px calc(46% + 72px) 1fr",
        columnGap: 28,
        alignItems: open ? "start" : closedAlign,
        padding: open ? "44px 0" : "0",
        minHeight: open ? "auto" : 104,
        borderTop: "1px solid var(--border)",
        cursor: "pointer",
        transition: "padding .32s cubic-bezier(.65,0,.35,1)",
      }}
    >
      <div style={{ paddingTop: open ? 4 : 0, transition: "padding .32s cubic-bezier(.65,0,.35,1)" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 13,
            fontWeight: 700,
            color: open ? "var(--primary)" : "var(--text-muted)",
            fontVariantNumeric: "tabular-nums",
            transition: "color .26s ease",
          }}
        >
          {num}
        </span>
      </div>

      <div style={{ paddingTop: open ? 4 : 0, transition: "padding .32s cubic-bezier(.65,0,.35,1)" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: open ? "var(--primary)" : "var(--text-muted)",
            transition: "color .26s ease",
          }}
        >
          {item.company}
        </div>
      </div>

      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: open ? "flex-start" : "center",
          minHeight: open ? 0 : 72,
        }}
      >
        <h2
          className="bf-accent"
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: open ? "clamp(22px,2.2vw,30px)" : "clamp(16px,1.5vw,18px)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: open ? "var(--text-strong)" : "var(--text-muted)",
            transition: "font-size .32s cubic-bezier(.65,0,.35,1), color .26s ease",
          }}
        >
          {accentNums(item.title)}
        </h2>
        <div
          style={{
            maxHeight: open ? 460 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "max-height .4s cubic-bezier(.65,0,.35,1), opacity .3s ease .05s",
          }}
        >
          <p
            style={{
              margin: "18px 0 0",
              maxWidth: 460,
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {item.desc}
          </p>
          {item.link && (
            <a
              href={item.link || "#"}
              {...(item.link.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 28,
                padding: "12px 20px",
                borderRadius: 4,
                background: "var(--grey-900)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              자세히 보기 <ArrowRight width={16} height={16} />
            </a>
          )}
        </div>
      </div>

      <div style={{ minWidth: 0, alignSelf: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "grid-template-rows .4s cubic-bezier(.65,0,.35,1), opacity .3s ease",
          }}
        >
          <div className="bf-groupacc-media-slot">
            <SolutionMedia
              item={item}
              animate={open}
              iconSize={46}
              boxStyle={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: 0,
                background: "linear-gradient(135deg,#eef1fc,#dbe2fb)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
                color: "var(--blue-400)",
                marginTop: 8,
                marginBottom: 8,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Must be >= the longest CSS transition duration driven by the `open` prop below
// (max-height .4s is the longest) so a row's expand/collapse animation always
// finishes before the next step is allowed to run, even if scrolling reverses mid-animation.
const STEP_DELAY = 420;

// Minimum vertical touch-drag distance (px) that counts as a deliberate swipe.
const SWIPE_THRESHOLD = 30;

// How much accumulated wheel movement (px) is required before a step fires —
// higher means the user has to scroll further/harder for each row to advance.
const WHEEL_THRESHOLD = 150;

const NAV_HEIGHT = 64;
// Mobile carousel: scroll distance (in vh) dedicated to each push transition
// between solution cards.
const CAROUSEL_STEP_VH = 60;

export default function GroupIntro() {
  const { isEnglish } = useLanguage();
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);
  const [inquiryTarget, setInquiryTarget] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const targetRef = useRef(0);
  const lockedRef = useRef(false);
  const stepTimeoutRef = useRef(null);
  const touchStartYRef = useRef(null);
  const wheelAccumRef = useRef(0);
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);

  // Mobile carousel: which solution card is currently pushed into view.
  const [mobileActive, setMobileActive] = useState(0);
  const mobileOuterRef = useRef(null);

  // The accordion's wheel/touch handlers are bound to `window` (see below), so
  // they'd otherwise fire while the user is still scrolling through the hero or
  // the affiliate cards above. Gating on whether the solutions section is
  // actually in view keeps those gestures from silently stepping the accordion
  // before the user ever reaches it.
  const solutionsRef = useRef(null);
  const sectionActiveRef = useRef(false);

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

  // Mobile carousel: derives which card is "active" directly from scroll
  // position (not swipe events), so a small scroll immediately triggers the
  // full push transition — the card slides fully off, the next one fully in —
  // and it can never land half-transitioned no matter how the user scrolls.
  useEffect(() => {
    if (!isMobile) return undefined;
    let ticking = false;

    function measure() {
      ticking = false;
      const el = mobileOuterRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const runwayPx = (window.innerHeight * (solutionItems.length - 1) * CAROUSEL_STEP_VH) / 100;
      const scrolled = Math.min(Math.max(NAV_HEIGHT - rect.top, 0), runwayPx);
      const stepPx = runwayPx / (solutionItems.length - 1);
      const idx = stepPx > 0 ? Math.round(scrolled / stepPx) : 0;
      setMobileActive(Math.min(solutionItems.length - 1, Math.max(0, idx)));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    const el = solutionsRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      sectionActiveRef.current = entry.isIntersecting;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setListHeight((prev) => Math.max(prev, entry.contentRect.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A fresh downward pass starts at the first solution. Reset only after the
  // user has actually scrolled back above the accordion, so reading a card or
  // making a small upward correction does not unexpectedly change it.
  useEffect(() => {
    if (isMobile) return undefined;
    function resetAfterLeavingSolutions() {
      const list = listRef.current;
      // Do this only once the entire accordion is below the viewport. Changing
      // an open row's height while it is visible can otherwise make the browser
      // preserve its scroll anchor and pull the next opened row upward.
      if (!list || list.getBoundingClientRect().top < window.innerHeight) return;
      if (activeRef.current === 0 && targetRef.current === 0) return;

      if (stepTimeoutRef.current) {
        window.clearTimeout(stepTimeoutRef.current);
        stepTimeoutRef.current = null;
      }
      lockedRef.current = false;
      wheelAccumRef.current = 0;
      activeRef.current = 0;
      targetRef.current = 0;
      setActive(0);
    }

    window.addEventListener("scroll", resetAfterLeavingSolutions, { passive: true });
    window.addEventListener("resize", resetAfterLeavingSolutions);
    return () => {
      window.removeEventListener("scroll", resetAfterLeavingSolutions);
      window.removeEventListener("resize", resetAfterLeavingSolutions);
    };
  }, [isMobile]);

  // Steps `active` by exactly one row toward targetRef.current, then locks for
  // STEP_DELAY so that row's animation always finishes before anything else can
  // happen. While locked, any further scroll input is ignored outright — so one
  // scroll (big or small) opens exactly one row and stops, and only a later,
  // separate scroll (after the lock lifts) advances to the next one.
  function attemptStep() {
    if (lockedRef.current || activeRef.current === targetRef.current) return;
    const next = activeRef.current + (targetRef.current > activeRef.current ? 1 : -1);
    activeRef.current = next;
    setActive(next);
    lockedRef.current = true;
    stepTimeoutRef.current = window.setTimeout(() => {
      lockedRef.current = false;
    }, STEP_DELAY);
  }

  function step(direction) {
    if (lockedRef.current) return;
    targetRef.current = Math.min(solutionItems.length - 1, Math.max(0, activeRef.current + direction));
    attemptStep();
  }

  useEffect(() => {
    // Mobile uses a native scroll-snap list instead (see the render below) — one
    // row pinned full-screen at a time, snapping cleanly to the next on swipe.
    // This wheel/touch-delta system is a desktop-only substitute for that (mice
    // have no scroll-snap-driving momentum the way touch scrolling does).
    if (isMobile) return undefined;
    function onWheel(e) {
      if (!sectionActiveRef.current) return;
      if (lockedRef.current) {
        wheelAccumRef.current = 0;
        return;
      }
      if ((e.deltaY > 0 && wheelAccumRef.current < 0) || (e.deltaY < 0 && wheelAccumRef.current > 0)) {
        wheelAccumRef.current = 0;
      }
      wheelAccumRef.current += e.deltaY;
      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        step(wheelAccumRef.current > 0 ? 1 : -1);
        wheelAccumRef.current = 0;
      }
    }
    function onTouchStart(e) {
      if (!sectionActiveRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
    }
    function onTouchEnd(e) {
      if (touchStartYRef.current === null) return;
      const dy = touchStartYRef.current - e.changedTouches[0].clientY;
      touchStartYRef.current = null;
      if (Math.abs(dy) >= SWIPE_THRESHOLD) step(dy > 0 ? 1 : -1);
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (stepTimeoutRef.current) window.clearTimeout(stepTimeoutRef.current);
    };
  }, [isMobile]);

  function openRow(index) {
    if (stepTimeoutRef.current) {
      window.clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    lockedRef.current = false;
    activeRef.current = index;
    targetRef.current = index;
    setActive(index);
    const el = document.getElementById(`bf-acc-${index}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.38;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <section
        ref={darkZoneRef}
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#000000",
          padding: "72px 48px 120px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: 1400,
            height: 1400,
            transform: "translate(-50%, calc(50% + 130px))",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Orb hue={360} hoverIntensity={0.2} rotateOnHover={false} forceHoverState={false} backgroundColor="#000000" />
        </div>

        <div className="bf-pad" style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto" }}>
          <div
            className="bf-reveal"
            style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,.45)", fontSize: 13, fontWeight: 600, marginBottom: 40 }}
          >
            <Link to="/" style={{ color: "rgba(255,255,255,.45)" }}>홈</Link>
            <ChevronRight width={15} height={15} />
            <span style={{ color: "#fff" }}>보난자 그룹</span>
          </div>

          <div
            className="bf-reveal"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#5E8EFF", marginBottom: 20 }}
          >
            BONANZA GROUP
          </div>
          <h1
            className="bf-accent bf-reveal"
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: "clamp(24px,3.1vw,38px)",
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              color: "#fff",
              maxWidth: 720,
            }}
          >
            {isEnglish ? "Specialized subsidiaries, united by Bonanza Group." : <>
              보난자 그룹은 각 영역의 전문 자회사와<br />함께 시너지를 만들어 갑니다.
            </>}
          </h1>
          <p
            className="bf-reveal"
            style={{ margin: "24px 0 0", maxWidth: 620, fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,.7)" }}
          >
            보난자 그룹은 모회사 보난자팩토리를 중심으로 온체인 데이터 분석, R&D, 디지털자산 보안, 결제·정산 인프라 전문 자회사들이
            유기적으로 연결되어 있습니다. 각 분야의 전문성이 모여 하나의 신뢰할 수 있는 디지털자산 생태계를 완성합니다.
          </p>
        </div>
      </section>

      <main className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 48px 0" }}>
        <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 20 }}>
          모회사
        </div>

        <div
          className="bf-reveal bf-affcard bf-parentcard"
          onClick={() => setInquiryTarget(PARENT_COMPANY)}
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            padding: "56px",
            background: "linear-gradient(90deg,rgba(20,20,20,1) 0%,rgba(20,20,20,0) 70%), url(/images/bonanzafactory.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            marginBottom: 64,
          }}
        >
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <h2 className="bf-accent" style={{ margin: 0, fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em" }}>보난자팩토리</h2>
            <p style={{ margin: "20px 0 0", maxWidth: 500, fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,.85)" }}>
              {PARENT_DESC}
            </p>
          </div>
          <div className="bf-affcard-overlay">
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", color: "#fff" }}>
              사업 문의하기
            </span>
          </div>
        </div>

        <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 20 }}>
          계열사
        </div>

        <div
          className="bf-reveal bf-affgrid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(580px, 1fr))", gap: 24 }}
        >
          {subsidiaries.map((sub) => (
            <div
              key={sub.key}
              className="bf-affcard bf-affcarditem"
              onClick={() => setInquiryTarget(sub)}
              style={{
                position: "relative",
                minHeight: 280,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: sub.background,
                backgroundSize: sub.backgroundSize,
                backgroundPosition: sub.backgroundPosition,
                color: sub.color,
              }}
            >
              <div>
                <div className="bf-accent" style={{ fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em", marginBottom: 12 }}>{accentNums(sub.name)}</div>
                <p style={{ margin: 0, maxWidth: 500, fontSize: 14, lineHeight: 1.7, color: sub.descColor, wordBreak: "keep-all" }}>
                  {sub.descLong}
                </p>
              </div>
              <div className="bf-affcard-overlay">
                <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", color: "#fff" }}>
                  사업 문의하기
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section ref={solutionsRef} className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "140px 48px 0" }}>
        <div className="bf-reveal" style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14 }}>
            SOLUTIONS
          </div>
          <h2 className="bf-accent" style={{ margin: 0, fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
            계열사 솔루션
          </h2>
          <p style={{ margin: "16px 0 0", maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)" }}>
            스크롤을 내리며 보난자 그룹 계열사들의 솔루션을 하나씩 살펴보세요.
          </p>
        </div>

        {isMobile ? (
          // A pinned "viewport window" the size of one screen; every card sits
          // absolutely stacked inside it and is translated in/out based on how
          // far its index is from `mobileActive` — the active card sits at 0%,
          // ones before it are pushed to -100% (off the top), ones after sit at
          // +100% (waiting below). Scrolling changes `mobileActive`, and every
          // card's transform transitions together, so the active card visibly
          // slides fully off while the next one slides fully into place.
          <div ref={mobileOuterRef} style={{ position: "relative", height: `calc(100dvh - ${NAV_HEIGHT}px + ${(solutionItems.length - 1) * CAROUSEL_STEP_VH}vh)` }}>
            <div
              style={{
                position: "sticky",
                top: NAV_HEIGHT,
                height: `calc(100dvh - ${NAV_HEIGHT}px)`,
                overflow: "hidden",
                background: "#fff",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {solutionItems.map((item, i) => (
                <div
                  key={`${item.company}-${item.title}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateY(${(i - mobileActive) * 100}%)`,
                    transition: "transform .5s cubic-bezier(.65,0,.35,1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    overflowY: "auto",
                    padding: "36px 24px",
                    background: "#fff",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>{item.company}</div>
                  <h2 className="bf-accent" style={{ margin: "10px 0 0", fontWeight: 700, fontSize: "clamp(22px,7vw,28px)", lineHeight: 1.3, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
                    {accentNums(item.title)}
                  </h2>
                  <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)", fontWeight: 500 }}>
                    {item.desc}
                  </p>
                  {item.link && (
                    <a
                      href={item.link || "#"}
                      {...(item.link.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                      style={{
                        alignSelf: "flex-start",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 24,
                        padding: "12px 20px",
                        borderRadius: 4,
                        background: "var(--grey-900)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      자세히 보기 <ArrowRight width={16} height={16} />
                    </a>
                  )}
                  <SolutionMedia
                    item={item}
                    animate={i === mobileActive}
                    iconSize={40}
                    boxStyle={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 10",
                      background: "linear-gradient(135deg,#eef1fc,#dbe2fb)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 10,
                      color: "var(--blue-400)",
                      marginTop: 24,
                      flex: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ height: listHeight || undefined, overflow: "hidden" }}>
              <div ref={listRef} style={{ borderBottom: "1px solid var(--border)" }}>
                {solutionItems.map((item, i) => (
                  <AccordionRow key={`${item.company}-${item.title}`} item={item} index={i} open={i === active} onOpen={openRow} />
                ))}
              </div>
            </div>
            <div style={{ paddingBottom: "22vh" }} />
          </>
        )}
      </section>

      <InquiryModal
        open={inquiryTarget !== null}
        company={inquiryTarget?.name}
        email={inquiryTarget?.email}
        onClose={() => setInquiryTarget(null)}
      />
    </div>
  );
}
