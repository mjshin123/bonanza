import { lazy, Suspense, useEffect, useRef, useState } from "react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";

// three.js + postprocessing load in their own chunk; the headline and poster don't wait for them
const CrystalCubeField3D = lazy(() => import("./CrystalCubeField3D.jsx"));

const BG = "#0b0c11"; // keep in sync with CrystalCubeField3D

function smoothstep(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/* ── section ───────────────────────────────────────────────── */
export default function CrystalHero() {
  const wrapRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, last: 0 });
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tabHidden, setTabHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  const copyRef = useRef(null);
  useNavDarkZone(wrapRef);

  // headline + description stay put (fixed) while the block field scrolls up underneath,
  // then fade out as the field is almost gone and the next section takes over
  useEffect(() => {
    const section = wrapRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / rect.height)); // 0 = at top, 1 = field scrolled away
      const f = smoothstep(0.55, 0.9, p);
      copy.style.opacity = String(1 - f);
      copy.style.transform = `translateY(${-24 * f}px)`;
      copy.style.visibility = f >= 1 ? "hidden" : "visible";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // pause rendering while off-screen
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // and while another tab is in front
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const updatePointer = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const p = pointerRef.current;
    p.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    p.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    p.active = true;
    p.last = performance.now();
  };
  const leave = () => {
    pointerRef.current.active = false;
    pointerRef.current.last = performance.now();
  };

  return (
    <section
      ref={wrapRef}
      id="home"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: 560, background: BG }}
      onPointerMove={updatePointer}
      onPointerDown={updatePointer}
      onPointerLeave={leave}
      onPointerCancel={leave}
    >
      {/* static render of the idle field, shown until the live canvas fades in over it */}
      <div aria-hidden="true" className="bf-hero3d-poster pointer-events-none absolute inset-0" />
      <div className="absolute inset-0" style={{ opacity: ready ? 1 : 0, transition: "opacity .9s ease" }}>
        <Suspense fallback={null}>
          <CrystalCubeField3D pointerRef={pointerRef} running={visible && !tabHidden} onReady={() => setReady(true)} />
        </Suspense>
      </div>

      {/* thin dim layer so the centred headline reads over the blocks */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* edge vignette + blend into the next (video) section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${BG}ee 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0A0A)" }}
      />

      {/* centred headline with the description under it; wrapper ignores the pointer so the blocks stay interactive.
          Fixed to the viewport (scroll-driven fade above), under the nav (z 100), over the next section.
          Same side padding as the other sections (40px, 24px on mobile via .bf-pad). */}
      <div
        ref={copyRef}
        className="bf-pad pointer-events-none"
        style={{ position: "fixed", inset: 0, zIndex: 5, padding: "64px 40px 0", willChange: "opacity, transform" }}
      >
        <div style={{ position: "relative", maxWidth: 1400, height: "100%", margin: "0 auto" }}>
          <div className="bf-hero3d-main">
            <h1
              className="bf-hero3d-h"
              style={{ opacity: 0, animation: "revU 1s .15s ease both" }}
            >
              신뢰할 수 있는 디지털 자산의 기반을 만듭니다.
            </h1>
            <p className="bf-hero3d-desc" style={{ opacity: 0, animation: "revU 1s .3s ease both" }}>
              보난자팩토리는 가상자산 자금세탁방지(AML) 전문 기업입니다. 블록체인 데이터에 대한 깊은 이해를
              <br className="bf-hero3d-br" />
              바탕으로, 거래소와 은행, 수사기관이 함께 신뢰할 수 있는 가상자산 생태계를 만들어갑니다.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
