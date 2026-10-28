import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TransaferIcon from "./TransaferIcon.jsx";
import NetworkTraceIcon from "./icons/NetworkTraceIcon.jsx";
import CoopIcon from "./CoopIcon.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const cards = [
  {
    tag: "가상자산 거래 추적 및 위험주소 탐지",
    desc: "가상자산 주소에 대한 자체 수집 데이터를 기반으로 거래 흐름을 시각화한 맵을 통해 자금 세탁 경로를 추적·분석합니다. 거래소는 API를 연동하여 위험 지갑주소로의 입출금을 선제적으로 차단하는 모니터링 시스템을 구축할 수 있습니다.",
    title: "TranSight",
    Icon: NetworkTraceIcon,
    borderLeft: false,
    swapEmphasis: true,
  },
  {
    tag: "법집행기관-거래소 실시간 공조 중계",
    desc: "수사기관과 거래소를 실시간으로 연결해 공조 요청을 중계합니다. 현금화 지점인 거래소에 고객 정보를 확인하고 동결을 요청하는 법집행기관 전용 솔루션입니다.",
    title: "TranSight",
    Icon: CoopIcon,
    borderLeft: true,
    swapEmphasis: true,
  },
  {
    tag: "은행-거래소 원화입출금 검증 인프라",
    desc: "고객의 실명계좌를 기반으로 초고위험 고객을 확인하고, 은행과 연계해 지급정지 등의 조치를 지원하는 원화 입출금 검증 솔루션입니다. 자체 특허 기술 기반의 인증 프로세스를 통해, 은행과 거래소의 이상거래탐지(FDS) 및 자금세탁방지(AML) 업무를 뒷받침합니다.",
    title: "TranSafer",
    Icon: TransaferIcon,
    borderLeft: true,
    swapEmphasis: true,
  },
];

const INACTIVE_COLOR = "var(--grey-400)";
const ACTIVE_COLOR = "var(--primary)";
const NAV_HEIGHT = 64;
const SEGMENT_VH = 10; // extra scroll (in vh), per card, dedicated to the fill animation while pinned
const OC_ANIM_MS = 900; // on-chain/off-chain divider reveal duration (line + arrows + labels), see page.css .bf-oc-*
const CATCHUP_MS = 500; // transition applied only for the reveal catch-up, so bars ease in instead of snapping to whatever scroll already advanced past
const MOBILE_QUERY = "(max-width:860px)"; // same breakpoint the rest of the site stacks on

export default function Solutions() {
  const { isEnglish } = useLanguage();
  const outerRef = useRef(null);
  const contentRef = useRef(null);
  const hasSettledRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({ vh: 0, contentH: 0 });
  const [barsReady, setBarsReady] = useState(false);
  const [catchingUp, setCatchingUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Below the stack breakpoint the cards render in normal document flow instead
  // of the pinned/scroll-fill layout — a fixed-height sticky box with overflow
  // hidden would otherwise clip most of the 3 stacked cards on a phone screen.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

    // On a hard refresh the web font (Geist/Pretendard) can still be loading at
    // this point, so this first pass measures against fallback-font metrics —
    // slightly off from the final layout. Re-measure once the real font is in,
    // otherwise centerTop/pinPoint stay based on the wrong content height and
    // the very first scroll-through fills the bars almost immediately.
    document.fonts?.ready?.then(measureDims);

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
  const totalDistance = dims.vh - centerTop + runwayPx;
  // The pinned/sticky box can only ever show `boxHeightPx` worth of content before
  // the viewport edge cuts it off — if the cards' natural height doesn't fit within
  // that (short window, zoomed-in browser, etc.), pinning would clip their bottom.
  // Fall back to normal document flow instead, same as the narrow-width case below,
  // so the full card is always reachable by scrolling rather than hidden by overflow.
  const contentFits = !dims.vh || !dims.contentH || dims.contentH <= dims.vh - NAV_HEIGHT;
  const usePin = !isMobile && contentFits;
  // Fraction of `progress` spent just approaching the section before it actually
  // settles into its pinned position — the card bars must stay empty for all of it,
  // otherwise the first card reads as already filled the instant the section appears.
  const pinPoint = totalDistance > 0 ? Math.min(1, Math.max(0, (dims.vh - centerTop) / totalDistance)) : 0;

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
      const scrolled = dims.vh - outerRect.top;
      const p = totalDistance > 0 ? Math.min(1, Math.max(0, scrolled / totalDistance)) : 0;
      setProgress(p);

      // Only once the section has actually settled into its pinned position do we
      // start the clock on the on-chain/off-chain divider's entrance animation —
      // the card bars stay empty until that animation has had time to finish.
      if (!hasSettledRef.current && p >= pinPoint) {
        hasSettledRef.current = true;
        setTimeout(() => {
          setBarsReady(true);
          setCatchingUp(true);
          setTimeout(() => setCatchingUp(false), CATCHUP_MS);
        }, OC_ANIM_MS);
      }
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
  }, [dims, centerTop, runwayPx, totalDistance, pinPoint]);

  return (
    <section
      ref={outerRef}
      id="solutions"
      style={{
        position: "relative",
        background: "#fff",
        ...(usePin
          ? { height: outerHeightPx ? `${outerHeightPx}px` : `${100 + cards.length * SEGMENT_VH}vh` }
          : {}),
      }}
    >
      <div
        className="bf-pad"
        style={{
          background: "#fff",
          padding: "0 40px",
          ...(usePin
            ? {
                position: "sticky",
                top: centerTop,
                height: boxHeightPx ? `${boxHeightPx}px` : `calc(100vh - ${NAV_HEIGHT}px)`,
                overflow: "hidden",
              }
            : {}),
        }}
      >
        <div ref={contentRef} style={{ maxWidth: 1400, margin: "0 auto", width: "100%", padding: "48px 0 120px" }}>
          <div className="bf-reveal" style={{ position: "relative", display: "inline-block", marginBottom: 64 }}>
            <h2
              className="bf-accent"
              style={{
                margin: 0,
                fontWeight: 300,
                fontSize: "clamp(26px,3.2vw,36px)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: "var(--text-strong)",
                whiteSpace: isEnglish ? "nowrap" : undefined,
              }}
            >
              {isEnglish ? "Complete Visibility Across On-Chain and Off-Chain Risks" : <>
                온체인과 오프체인을 통합적으로 모니터링하는<br />리스크 관리 시스템을 구축하세요.
              </>}
            </h2>
          </div>

          <div
            className="bf-revealF"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              marginBottom: 40,
            }}
          >
            <span className="bf-oc-label" style={{ flex: "none", fontFamily: "'Pretendard'", fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#1640DB" }}>
              온체인
            </span>
            <div style={{ flex: "1 1 auto", minWidth: 0, position: "relative", display: "flex", alignItems: "center" }}>
              <div className="bf-oc-line" style={{ width: "100%", height: 0, borderTop: "1.5px solid #1640DB" }} />
              <svg
                className="bf-oc-arrow"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                style={{ position: "absolute", left: 0, top: "50%", transform: "translate(-50%, -50%)" }}
              >
                <path d="M7 1L2 6L7 11" stroke="#1640DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg
                className="bf-oc-arrow"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                style={{ position: "absolute", right: 0, top: "50%", transform: "translate(50%, -50%)" }}
              >
                <path d="M1 1L6 6L1 11" stroke="#1640DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="bf-oc-label" style={{ flex: "none", fontFamily: "'Pretendard'", fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#1640DB" }}>
              오프체인
            </span>
          </div>

          <div className="bf-sol" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid var(--border)", borderRadius: 4, overflow: "clip" }}>
            {cards.map((card, i) => {
              const fillProgress = pinPoint < 1 ? Math.max(0, Math.min(1, (progress - pinPoint) / (1 - pinPoint))) : 0;
              const cardProgress = barsReady ? Math.min(1, Math.max(0, fillProgress * cards.length - i)) : 0;
              const isActive = cardProgress > 0;
              const textColor = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

              return (
                <div
                  key={i}
                  className="bf-solcard bf-reveal"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: isMobile ? undefined : 560,
                    padding: "34px 34px 40px",
                    borderTop: isMobile && i > 0 ? "1px solid var(--border)" : undefined,
                    borderLeft: !isMobile && card.borderLeft ? "1px solid var(--border)" : undefined,
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
                    style={{
                      margin: "0 0 32px",
                      height: 104,
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontWeight: 500,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {card.desc}
                  </p>
                  <div
                    className="bf-bar"
                    style={{
                      marginBottom: 34,
                      transform: `scaleX(${cardProgress})`,
                      transition: catchingUp ? "transform .5s cubic-bezier(.4,0,.2,1)" : "none",
                    }}
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
                      filter: isActive ? "none" : "grayscale(1)",
                      transition: "filter .9s cubic-bezier(.4,0,.2,1)",
                    }}
                  >
                    <card.Icon width={isMobile ? 100 : 148} height={isMobile ? 100 : 148} />
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
