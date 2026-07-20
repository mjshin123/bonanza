import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { milestones } from "../data/milestones.js";
import DiamondSvg from "./DiamondSvg.jsx";
import { scrollToAnchor } from "../lib/scroll.js";
import useNavDarkZone from "../hooks/useNavDarkZone.js";

const W = 1120;
const DW = 300;
const DH = 128;
const STEP = 46;
const CX = 540;
const TOP = 96;
const GAP = 26;
const TIP_X = CX - DW / 2 + 6;
const H = TOP + DH / 2 + (milestones.length - 1) * STEP + GAP + DH / 2 + 60;

function centerY(i, sel) {
  return TOP + DH / 2 + i * STEP + (i < sel ? -GAP : i > sel ? GAP : 0);
}

export default function Tech() {
  const [sel, setSel] = useState(0);
  const picked = milestones[sel];
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);

  return (
    <section ref={darkZoneRef} id="tech" className="bf-pad" style={{ position: "relative", zIndex: 0, background: "#0A0A0A", padding: "96px 40px 84px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h2
          className="bf-reveal"
          style={{
            margin: "0 auto",
            fontWeight: 500,
            fontSize: "clamp(24px,3vw,40px)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: "#fff",
            maxWidth: 1100,
            textAlign: "center",
          }}
        >
          하나씩 쌓아온 인증과 성과가, 지금의 기술력이 되었습니다.
        </h2>

        <div id="bf-stack">
          <div className="bf-stack-stage" style={{ width: W, height: H }}>
            {milestones.map((m, i) => {
              const isSel = i === sel;
              const cy = centerY(i, sel);
              return (
                <div
                  key={`connector-${i}`}
                  className="bf-connector"
                  onMouseEnter={() => setSel(i)}
                  style={{
                    left: 250,
                    width: TIP_X - 250,
                    top: cy,
                    borderTop: `1px solid ${isSel ? "#4566E2" : "rgba(255,255,255,0.35)"}`,
                  }}
                />
              );
            })}
            {milestones.map((m, i) => {
              const isSel = i === sel;
              const cy = centerY(i, sel);
              return (
                <div
                  key={`diamond-${i}`}
                  className="bf-diamond"
                  onMouseEnter={() => setSel(i)}
                  style={{
                    left: CX - DW / 2,
                    top: cy - DH / 2,
                    width: DW,
                    height: DH,
                    zIndex: isSel ? 200 : milestones.length - i,
                    transform: isSel ? "scale(1.05)" : "none",
                    transformOrigin: "center",
                    filter: isSel
                      ? "drop-shadow(0 26px 48px rgba(22,64,219,.55))"
                      : "drop-shadow(0 10px 20px rgba(0,0,0,.35))",
                  }}
                >
                  <DiamondSvg index={i} selected={isSel} />
                </div>
              );
            })}
            {milestones.map((m, i) => {
              const isSel = i === sel;
              const cy = centerY(i, sel);
              return (
                <div
                  key={`title-${i}`}
                  className="bf-title"
                  onMouseEnter={() => setSel(i)}
                  style={{
                    left: -40,
                    width: 290,
                    top: cy,
                    color: isSel ? "#738DE9" : "#ffffff",
                  }}
                >
                  {m.title}
                </div>
              );
            })}

            <div style={{ position: "absolute", left: 760, top: 150, width: 320 }}>
              <div style={{ color: "#BFBFBF", fontSize: 14, fontWeight: 400, marginBottom: 26 }}>{picked.year}</div>
              <div style={{ color: "#738DE9", fontSize: 26, fontWeight: 700, lineHeight: 1.3, marginBottom: 22 }}>
                {picked.title}
              </div>
              <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 400, lineHeight: 1.6 }}>{picked.body}</div>
            </div>
          </div>

          <div className="bf-stack-mobile">
            {milestones.map((m, i) => (
              <div className="bf-stack-mobile-item" key={`mobile-${i}`}>
                <div style={{ color: "#738DE9", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{m.year}</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{m.title}</div>
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1.6 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <a
            href="#news"
            className="bf-ghostlink"
            onClick={(e) => {
              e.preventDefault();
              scrollToAnchor("news");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              border: "1px solid #738DE9",
              borderRadius: 30,
              color: "#738DE9",
              fontWeight: 600,
              fontSize: 14,
              transition: "background .2s ease",
            }}
          >
            연혁 보기 <ArrowRight width={20} height={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
