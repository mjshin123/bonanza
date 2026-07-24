import { useRef } from "react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";

export default function Sectors() {
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);

  return (
    <section ref={darkZoneRef} id="sectors" className="bf-pad" style={{ position: "relative", background: "#0A0A0A", padding: "96px 40px 104px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="bf-reveal" style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#738de9", marginBottom: 14 }}>
            WHAT WE DO
          </div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(26px,3.2vw,36px)", letterSpacing: "-0.02em", color: "#fff" }}>
            기술과 규제의 교차점에서 투명한 디지털자산 환경을 만들어갑니다.
          </h2>
          <div className="bf-sectors-mobile-caption">Digital Asset Compliance</div>
        </div>

        {/* ================= DESKTOP diagram — matches the Figma "Slide 16:9" spec
            exactly (1920x1080 reference), hidden below the mobile breakpoint */}
        <div className="bf-revealF bf-sectors-desktop" style={{ position: "relative", aspectRatio: "1920 / 1080", marginTop: 24 }}>
          <svg
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
          >
            <polygon
              points="212.87,107.90 1730.68,107.90 971.78,961.52"
              fill="none"
              stroke="rgba(22,64,219,0.7)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div style={{ position: "absolute", left: "8.27%", top: "6.66%", width: "5.16%", height: "2.22%", zIndex: 4, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 14, color: "var(--grey-200)" }}>
            Blockchain
          </div>
          <div style={{ position: "absolute", left: "88.33%", top: "6.66%", width: "3.75%", height: "2.22%", zIndex: 4, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 14, color: "var(--grey-200)" }}>
            Finance
          </div>
          <div style={{ position: "absolute", left: "49.32%", top: "90.14%", width: "2.60%", height: "2.22%", zIndex: 4, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 14, color: "var(--grey-200)" }}>
            Legal
          </div>

          <div aria-hidden="true" style={{ position: "absolute", left: "40.74%", top: "9.45%", width: "18.53%", height: "32.94%", borderRadius: "50%", background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.8) 100%)", transform: "translateY(6px)", zIndex: 1 }} />
          <div aria-hidden="true" style={{ position: "absolute", left: "49.48%", top: "31.85%", width: "18.53%", height: "32.94%", borderRadius: "50%", background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.8) 100%)", transform: "translate(-8px,16px) rotate(130deg)", zIndex: 1 }} />
          <div aria-hidden="true" style={{ position: "absolute", left: "32.57%", top: "31.85%", width: "18.53%", height: "32.94%", borderRadius: "50%", background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.8) 100%)", transform: "translate(8px,16px) rotate(-130deg)", zIndex: 1 }} />

          <div style={{ position: "absolute", left: "50%", top: "26.48%", width: "5.57%", transform: "translate(-50%,-50%)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#A2B3F1" }}>
            Risk Data
          </div>
          <div style={{ position: "absolute", left: "50%", top: "38.13%", transform: "translateX(-50%)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", whiteSpace: "nowrap", fontWeight: 500, fontSize: 42, lineHeight: "50px", color: "#fff" }}>
            Digital Asset Compliance
          </div>
          <div style={{ position: "absolute", left: "42.26%", top: "49.80%", width: "12.86%", transform: "translate(-50%,-50%)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#A2B3F1" }}>
            Blockchain Technology
          </div>
          <div style={{ position: "absolute", left: "58.33%", top: "49.80%", width: "5.16%", transform: "translate(-50%,-50%)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#A2B3F1" }}>
            RegTech
          </div>
        </div>

        {/* ================= MOBILE diagram — hand-tuned separately from the desktop
            spec above (bigger circles, wider-spread petals, extended Legal point),
            shown only below the mobile breakpoint. Every position/size is a
            percentage of this box's own width/height, and the box's aspect-ratio
            is pinned to the SVG's viewBox (1400:860) so the whole diagram scales
            fluidly at any phone width with no clipping or shrink-transform. */}
        <div className="bf-revealF bf-sectors-mobile-graphic" style={{ position: "relative", aspectRatio: "1400 / 860", marginTop: 24 }}>
          {/* downward triangle — its own viewBox is taller than the stage (122.09% of
              stage height) so the point can extend well below the stage box without
              stretching the stage itself (which would distort the circles below,
              since they're sized as percentages of this same box) */}
          <svg
            viewBox="0 0 1400 1050"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "122.09%", zIndex: 2 }}
          >
            <polygon
              points="24,64 1376,64 700,1000"
              fill="none"
              stroke="rgba(22,64,219,0.7)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* corner labels */}
          <div style={{ position: "absolute", left: "0.6%", top: "4.2%", zIndex: 4, fontWeight: 500, fontSize: 16, color: "#fff" }}>
            Blockchain
          </div>
          <div style={{ position: "absolute", right: "0.6%", top: "4.2%", zIndex: 4, fontWeight: 500, fontSize: 16, color: "#fff" }}>
            Finance
          </div>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "-19.42%", zIndex: 4, fontWeight: 500, fontSize: 16, color: "#fff" }}>
            Legal
          </div>

          {/* trefoil — 37.14% x 54.65% of the stage (= 520x470 at the 1400x860 reference size) */}
          <div style={{ position: "absolute", left: "50%", top: "39.21%", transform: "translate(-50%,-50%)", width: "37.14%", height: "54.65%", zIndex: 1 }}>
            <div
              aria-hidden="true"
              className="bf-petal-c1"
              style={{
                position: "absolute",
                left: "19.95%",
                top: "-3.46%",
                width: "60.11%",
                height: "66.50%",
                borderRadius: "50%",
                background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.8) 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="bf-petal-c2"
              style={{
                position: "absolute",
                left: "-6.02%",
                bottom: "-13.03%",
                width: "60.11%",
                height: "66.50%",
                borderRadius: "50%",
                background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.8) 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="bf-petal-c3"
              style={{
                position: "absolute",
                right: "-6.02%",
                bottom: "-13.03%",
                width: "60.11%",
                height: "66.50%",
                borderRadius: "50%",
                background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.8) 100%)",
              }}
            />

            {/* petal labels — centered on each circle's geometric center */}
            <div className="bf-petal-l1" style={{ position: "absolute", left: "50%", top: "29.79%", transform: "translate(-50%, calc(-50% - 10px))", textAlign: "center", whiteSpace: "nowrap", zIndex: 3, fontWeight: 400, fontSize: 15, lineHeight: 1.25, color: "#A2B3F1" }}>
              Risk Data
            </div>
            <div className="bf-petal-l2" style={{ position: "absolute", left: "24.04%", top: "79.79%", transform: "translate(-50%, calc(-50% + 10px))", width: "28.85%", textAlign: "center", zIndex: 3, fontWeight: 400, fontSize: 15, lineHeight: 1.25, color: "#A2B3F1" }}>
              Blockchain Technology
            </div>
            <div className="bf-petal-l3" style={{ position: "absolute", left: "75.96%", top: "79.79%", transform: "translate(-50%, calc(-50% + 10px))", width: "32.69%", textAlign: "center", zIndex: 3, fontWeight: 400, fontSize: 15, lineHeight: 1.25, color: "#A2B3F1" }}>
              RegTech
            </div>

            {/* center */}
            <div
              className="bf-petal-center"
              style={{
                position: "absolute",
                left: "50%",
                top: "47%",
                zIndex: 3,
                whiteSpace: "nowrap",
                fontWeight: 600,
                fontSize: 28,
                lineHeight: 1.2,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Digital Asset Compliance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
