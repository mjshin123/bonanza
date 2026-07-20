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
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em", color: "#fff" }}>
            기술과 규제의 교차점에서 투명한 디지털자산 환경을 만들어갑니다.
          </h2>
        </div>

        {/* stage */}
        <div className="bf-revealF" style={{ position: "relative", height: 860, marginTop: 24 }}>
          {/* downward triangle */}
          <svg
            viewBox="0 0 1400 860"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
          >
            <polygon
              points="24,64 1376,64 700,830"
              fill="none"
              stroke="rgba(22,64,219,0.7)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* corner labels */}
          <div style={{ position: "absolute", left: 8, top: 36, zIndex: 4, fontWeight: 500, fontSize: 16, color: "#fff" }}>
            Blockchain
          </div>
          <div style={{ position: "absolute", right: 8, top: 36, zIndex: 4, fontWeight: 500, fontSize: 16, color: "#fff" }}>
            Finance
          </div>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 8, zIndex: 4, fontWeight: 500, fontSize: 16, color: "#fff" }}>
            Legal
          </div>

          {/* trefoil */}
          <div style={{ position: "absolute", left: "50%", top: "calc(52% - 110px)", transform: "translate(-50%,-50%)", width: 520, height: 470, zIndex: 1 }}>
            <div
              aria-hidden="true"
              className="bf-petal-c1"
              style={{
                position: "absolute",
                left: 110,
                top: 0,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.85) 100%)",
                mixBlendMode: "screen",
              }}
            />
            <div
              aria-hidden="true"
              className="bf-petal-c2"
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.85) 100%)",
                mixBlendMode: "screen",
              }}
            />
            <div
              aria-hidden="true"
              className="bf-petal-c3"
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.8) 19.23%, rgba(22,64,219,0.85) 100%)",
                mixBlendMode: "screen",
              }}
            />

            {/* petal labels — centered on each circle's geometric center */}
            <div className="bf-petal-l1" style={{ position: "absolute", left: 260, top: 150, transform: "translate(-50%,-50%)", textAlign: "center", whiteSpace: "nowrap", zIndex: 3, fontWeight: 400, fontSize: 18, lineHeight: 1.25, color: "#A2B3F1" }}>
              Risk Data
            </div>
            <div className="bf-petal-l2" style={{ position: "absolute", left: 150, top: 320, transform: "translate(-50%,-50%)", width: 150, textAlign: "center", zIndex: 3, fontWeight: 400, fontSize: 18, lineHeight: 1.25, color: "#A2B3F1" }}>
              Blockchain Technology
            </div>
            <div className="bf-petal-l3" style={{ position: "absolute", left: 370, top: 320, transform: "translate(-50%,-50%)", width: 170, textAlign: "center", zIndex: 3, fontWeight: 400, fontSize: 18, lineHeight: 1.25, color: "#A2B3F1" }}>
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
                fontSize: 32,
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
