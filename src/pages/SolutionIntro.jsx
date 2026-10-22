import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import TransightRing from "../components/TransightRing.jsx";
import TransightSolutions from "../components/TransightSolutions.jsx";
import TransightDetails from "../components/TransightDetails.jsx";
import TransaferFlow from "../components/TransaferFlow.jsx";
import TransaferDetails from "../components/TransaferDetails.jsx";
import { accentNums } from "../lib/accentNums.jsx";

const SOLUTIONS = {
  transight: {
    name: "TranSight",
    tagline: "가상자산 통합 AML 솔루션",
    desc: "위험 주소 식별부터 추적, 공조, 차단까지 하나로 연결합니다.",
  },
  transafer: {
    name: "TranSafer",
    tagline: "원화입출금 검증 솔루션",
    desc: "고객 실명계좌를 바탕으로 이상 거래를 차단하는 원화 입출금 검증 솔루션입니다.",
  },
};

export default function SolutionIntro({ slug }) {
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);
  const solution = SOLUTIONS[slug];

  useEffect(() => {
    document.title = `${solution.name} | Bonanza Factory`;
    window.scrollTo(0, 0);
  }, [solution.name]);

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <section
        ref={darkZoneRef}
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
              <span style={{ color: "#fff" }}>{solution.name}</span>
            </div>

            <div
              className="bf-reveal"
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#5E8EFF", marginBottom: 20 }}
            >
              {solution.tagline}
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
              {accentNums(solution.name)}
            </h1>
            <p
              className="bf-revealF"
              style={{ margin: "28px 0 0", maxWidth: 560, fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,.65)" }}
            >
              {solution.desc}
            </p>
          </div>

          {slug === "transight" && (
            <div className="bf-reveal" style={{ flex: "1 1 420px", maxWidth: 640, minWidth: 0 }}>
              <TransightRing />
            </div>
          )}

          {slug === "transafer" && (
            <div className="bf-reveal" style={{ flex: "1 1 420px", maxWidth: 640, minWidth: 0 }}>
              <TransaferFlow />
            </div>
          )}
        </div>
      </section>

      {slug === "transight" && (
        <>
          <TransightSolutions />
          <TransightDetails />
        </>
      )}

      {slug === "transafer" && (
        <>
          <TransaferDetails />
        </>
      )}
    </div>
  );
}
