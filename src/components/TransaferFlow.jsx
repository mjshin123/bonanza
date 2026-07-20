// Percentages derived from the diagram's own 1340.92x315.75 bounding box
// (cropped out of the original 1920x1080 Figma frame) so the graphic scales
// as a standalone unit, matching the approach used by TransightRing.
const ELLIPSE_LEFT_PCT = [16.892, 38.226, 59.56];
const ELLIPSE_W_PCT = 23.548;

const LABELS = [
  { text: "거래소", leftPct: 2.722, color: "#2A5BFF" },
  { text: "펌뱅킹 시스템", leftPct: 28.665, color: "#fff" },
  { text: "블랙리스트 DB", leftPct: 50, color: "#fff" },
  { text: ["이상거래탐지(FDS)", "필터링"], leftPct: 71.335, color: "#fff" },
  { text: "금융사", leftPct: 97.278, color: "#2A5BFF" },
];

const CONNECTORS = [
  { leftPct: 8.133, widthPct: 8.847 },
  { leftPct: 83.107, widthPct: 8.847 },
];

const ARROWS = [
  { leftPct: 16.3 },
  { leftPct: 91.3 },
];

function GlowCircle({ id }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 249 249" fill="none" style={{ display: "block" }}>
      <circle cx="124.218" cy="124.218" r="124.218" fill={`url(#${id})`} />
      <defs>
        <radialGradient
          id={id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(124.218 124.218) rotate(131.605) scale(116.772)"
        >
          <stop offset="0.6875" stopColor="#193799" stopOpacity="0" />
          <stop offset="0.961538" stopColor="#2A5BFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#2A5BFF" stopOpacity="0.5" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function TransaferFlow() {
  return (
    <div
      className="bf-tsa"
      style={{ position: "relative", width: "100%", aspectRatio: "1340.92 / 315.75", containerType: "inline-size" }}
    >
      {CONNECTORS.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${c.leftPct}%`,
            top: "50%",
            width: `${c.widthPct}%`,
            borderTop: "1px solid #1640DB",
            pointerEvents: "none",
          }}
        />
      ))}

      {ARROWS.map((a, i) => (
        <svg
          key={i}
          width="16"
          height="19"
          viewBox="0 0 16 19"
          fill="none"
          style={{
            position: "absolute",
            left: `${a.leftPct}%`,
            top: "50%",
            width: "2.8%",
            height: "6.3%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        >
          <path
            d="M0.249434 18.433L14.3379 10.299C15.0046 9.91411 15.0046 8.95186 14.3379 8.56696L0.249433 0.432984"
            stroke="#1640DB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}

      {ELLIPSE_LEFT_PCT.map((left, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: 0,
            width: `${ELLIPSE_W_PCT}%`,
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <GlowCircle id={`bf-tsa-glow-${i}`} />
        </div>
      ))}

      {LABELS.map((label, i) => (
        <div
          key={i}
          className="bf-tsa-label"
          style={{
            position: "absolute",
            left: `${label.leftPct}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontSize: "clamp(11px,2.09cqw,28px)",
            lineHeight: 1.18,
            color: label.color,
          }}
        >
          {Array.isArray(label.text) ? label.text.map((line, j) => <div key={j}>{line}</div>) : label.text}
        </div>
      ))}
    </div>
  );
}
