import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, PlayCircle } from "lucide-react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { subsidiaries } from "../data/subsidiaries.js";
import InquiryModal from "../components/InquiryModal.jsx";
import Orb from "../components/Orb/Orb.jsx";
import { accentNums } from "../lib/accentNums.jsx";

const PARENT_COMPANY = { name: "보난자팩토리", email: "contact@bonanza-factory.co.kr" };
const PARENT_DESC =
  "보난자팩토리는 고객이 가상자산 거래를 보다 안전하게 할 수 있도록 투명한 디지털자산 생태계를 만들어가는 컴플라이언스 기업입니다. 그룹의 자회사들과 함께 데이터·보안·인프라 기술 시너지를 이끌어갑니다.";

const solutionItems = [
  {
    company: "보난자랩",
    title: "차세대 컴플라이언스 연구",
    desc: "블록체인·AI 기술을 연구하며 이상거래 탐지 모델과 규제 대응 엔진을 자체 개발합니다. 다수의 특허와 국책 과제로 기술력을 축적합니다.",
    link: "",
  },
  {
    company: "트라버스",
    title: "온체인 데이터 분석 플랫폼",
    desc: "온체인 거래 흐름을 실시간으로 수집·정규화하고 자금 이동을 그래프로 시각화해, 위험 지갑과 자금세탁 경로를 빠르게 식별합니다.",
    link: "",
  },
  {
    company: "바이스",
    title: "AI기반 비즈니스 프로필 서비스(Felore)",
    desc: "펠로어는 링크 하나로 나를 소개하는 AI 비즈니스 프로필입니다. 경력과 학력 인증, 직접 만난 사람들이 남긴 평판 키워드와 피드백, 명함 네트워크를 한 화면에 담아 처음 만나는 상대에게도 신뢰를 빠르게 전달합니다. AI가 프로필을 분석해 한 줄 페르소나를 만들고, 상대와의 공통점과 케미를 알려줘 더 좋은 만남을 돕습니다.",
    link: "https://felore.me",
    video: "/videos/felore.mp4",
    poster: "/videos/felore-poster.jpg",
  },
  {
    company: "플러그NX",
    title: "결제·정산 인프라",
    desc: "가맹점 결제부터 실시간 정산·리포팅까지, 가상자산 결제 전 과정을 안정적으로 처리하는 인프라를 제공합니다.",
    link: "",
  },
];

// 솔루션 우측 미디어 영역 — 영상이 있으면 박스 없이 영상 비율 그대로 두되,
// 자리표시 박스(16:10)와 비슷한 면적이 되도록 폭을 줄인다 (9:16 기준 약 59%)
function SolutionMedia({ item, iconSize, boxStyle }) {
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
        style={{ display: "block", width: "59%", height: "auto", marginTop: boxStyle.marginTop, marginBottom: boxStyle.marginBottom, flex: "none" }}
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
        gridTemplateColumns: "84px 100px 46% 1fr",
        columnGap: 40,
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
              maxWidth: 440,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {item.desc}
          </p>
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
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            maxHeight: open ? (item.video ? 720 : 460) : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "max-height .4s cubic-bezier(.65,0,.35,1), opacity .3s ease",
          }}
        >
          <SolutionMedia
            item={item}
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

  // Every row swaps places being the tall "open" one, so the list's total height
  // is the same in every steady state — but the padding/max-height/font-size
  // transitions don't all finish at exactly the same moment, so while a row is
  // opening/closing the two rows' combined height can briefly overshoot that
  // steady-state total, which shakes everything below (the footer). Locking the
  // wrapper to a real measured height (with overflow hidden to absorb that brief
  // overshoot) keeps the list's own box perfectly stable, so the wobble never
  // reaches outside it.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setListHeight((prev) => Math.max(prev, entry.contentRect.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    // Driven by wheel/touch gestures rather than actual page scroll position:
    // once the page is already at the very top or bottom, native scrolling can't
    // move any further in that direction, so it never fires another scroll event —
    // which would otherwise strand the user unable to go back to earlier rows.
    // Wheel/touch input keeps firing regardless of whether the page itself can
    // still move, so "scroll up" always works even at the top of the page.
    function onWheel(e) {
      if (!sectionActiveRef.current) return;
      // While locked, ignore wheel input entirely so it can't build up a "debt"
      // that instantly fires the moment the lock lifts.
      if (lockedRef.current) {
        wheelAccumRef.current = 0;
        return;
      }
      // Reversing direction shouldn't have to pay off leftover accumulation from
      // the previous direction — that would make a reversal feel unresponsive.
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
            보난자 그룹은 각 영역의 전문 자회사와
            <br />
            함께 시너지를 만들어 갑니다.
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
                  key={item.company}
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
                  <SolutionMedia
                    item={item}
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
                  <AccordionRow key={item.company} item={item} index={i} open={i === active} onOpen={openRow} />
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
