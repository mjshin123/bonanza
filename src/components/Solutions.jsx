import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TransaferIcon from "./TransaferIcon.jsx";
import NetworkTraceIcon from "./icons/NetworkTraceIcon.jsx";
import CoopIcon from "./CoopIcon.jsx";

const cards = [
  {
    tag: "원화입출금 이상거래 탐지",
    desc: "고객 실명계좌를 바탕으로 이상 거래를 차단하는 원화 입출금 검증 솔루션입니다.",
    title: "TranSafer",
    Icon: TransaferIcon,
    borderLeft: false,
    swapEmphasis: true,
  },
  {
    tag: "가상자산 거래 추적 및 위험주소 탐지",
    desc: "온체인 거래 흐름을 시각화한 맵을 통해 자금 세탁 경로를 추적·분석합니다. 거래소는 API를 연동하여 위험 주소와의 자금 전송을 차단할 수 있습니다.",
    title: "TranSight",
    Icon: NetworkTraceIcon,
    borderLeft: true,
    swapEmphasis: true,
  },
  {
    tag: "수사기관 실시간 공조",
    desc: "수사기관과 거래소를 실시간으로 연결해 신속한 공조와 정보 중계를 지원합니다.",
    title: "TranSight",
    Icon: CoopIcon,
    borderLeft: true,
    swapEmphasis: true,
  },
];

const INACTIVE_COLOR = "var(--grey-400)";
const ACTIVE_COLOR = "var(--primary)";
const NAV_HEIGHT = 64;
const SEGMENT_VH = 10; // extra scroll (in vh), per card, dedicated to the fill animation while pinned

export default function Solutions() {
  const outerRef = useRef(null);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({ vh: 0, contentH: 0 });

  // Measure the card block's natural content height + viewport height, so we can
  // pin it exactly when it reaches the vertical center of the screen.
  useLayoutEffect(() => {
    function measureDims() {
      const content = contentRef.current;
      if (!content) return;
      setDims({ vh: window.innerHeight, contentH: content.offsetHeight });
    }

    measureDims();
    const ro = new ResizeObserver(measureDims);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", measureDims);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureDims);
    };
  }, []);

  const runwayPx = (dims.vh * cards.length * SEGMENT_VH) / 100;
  const centerTop = dims.vh && dims.contentH ? Math.max(NAV_HEIGHT, (dims.vh - dims.contentH) / 2) : NAV_HEIGHT;
  // The sticky box's own height always reaches the bottom of the viewport (not just
  // the content height) so there's no gap for the next section to bleed through
  // while pinned — it can only appear once the pin fully releases.
  const boxHeightPx = dims.vh && dims.contentH ? dims.vh - centerTop : 0;
  const outerHeightPx = boxHeightPx ? boxHeightPx + runwayPx : 0;

  useEffect(() => {
    if (!dims.vh) return;
    let ticking = false;

    function measure() {
      ticking = false;
      const outer = outerRef.current;
      if (!outer) return;
      const outerRect = outer.getBoundingClientRect();
      // progress starts as soon as the section begins entering the viewport (its
      // top crossing the bottom edge), ramps through the approach to center, then
      // continues filling through the pinned "runway" until it hits 1 exactly when
      // the section naturally un-sticks.
      const totalDistance = dims.vh - centerTop + runwayPx;
      const scrolled = dims.vh - outerRect.top;
      const p = totalDistance > 0 ? Math.min(1, Math.max(0, scrolled / totalDistance)) : 0;
      setProgress(p);
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
  }, [dims, centerTop, runwayPx]);

  return (
    <section
      ref={outerRef}
      id="solutions"
      style={{
        position: "relative",
        height: outerHeightPx ? `${outerHeightPx}px` : `${100 + cards.length * SEGMENT_VH}vh`,
        background: "#fff",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: centerTop,
          height: boxHeightPx ? `${boxHeightPx}px` : `calc(100vh - ${NAV_HEIGHT}px)`,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div ref={contentRef} className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", width: "100%", padding: "48px 40px 0" }}>
          <div className="bf-reveal" style={{ position: "relative", display: "inline-block", marginBottom: 64 }}>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "clamp(26px,3.2vw,36px)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: "var(--text-strong)",
              }}
            >
              가상자산이 이동하는 포인트마다,
              <br />
              자금 세탁 방지(AML)를 위한 장치를 마련하세요.
            </h2>
          </div>

          <div className="bf-sol" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid var(--border)", borderRadius: 4, overflow: "clip" }}>
            {cards.map((card, i) => {
              const cardProgress = Math.min(1, Math.max(0, progress * cards.length - i));
              const isActive = cardProgress > 0;
              const textColor = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

              return (
                <div
                  key={i}
                  className="bf-solcard bf-reveal"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 560,
                    padding: "34px 34px 40px",
                    borderLeft: card.borderLeft ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <div
                    className="bf-soltag"
                    style={
                      card.swapEmphasis
                        ? { fontSize: 24, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 26, color: textColor }
                        : { fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 26, color: textColor }
                    }
                  >
                    {card.tag}
                  </div>
                  <p
                    className="bf-soldesc"
                    style={{ margin: "0 0 32px", minHeight: 60, fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}
                  >
                    {card.desc}
                  </p>
                  <div
                    className="bf-bar"
                    style={{ marginBottom: 34, transform: `scaleX(${cardProgress})`, transition: "none" }}
                  />
                  <h3
                    className="bf-soltitle"
                    style={
                      card.swapEmphasis
                        ? { margin: "0 0 28px", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: textColor }
                        : { margin: "0 0 28px", fontWeight: 700, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.01em", color: textColor }
                    }
                  >
                    {card.title}
                  </h3>
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <card.Icon width={148} height={148} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
