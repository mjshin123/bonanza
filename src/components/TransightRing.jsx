const FEATURES = ["지갑주소 분석", "자금 흐름 추적", "실시간 모니터링", "공조 요청 및 동결"];

// Percentages derived from the ring's own 972x510.36 bounding box (cropped out
// of the original 1920x752 Figma frame) so the graphic scales as a standalone unit.
const ELLIPSE_LEFT_PCT = [2.611, 25.738, 48.784, 71.831];
const ELLIPSE_TOP_PCT = 25.658;
const ELLIPSE_W_PCT = 25.561;
const ELLIPSE_H_PCT = 48.681;
const LABEL_CENTER_PCT = [15.371, 38.483, 61.556, 84.593];
const LABEL_TOP_PCT = ELLIPSE_TOP_PCT + ELLIPSE_H_PCT / 2;

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

export default function TransightRing() {
  return (
    <div
      className="bf-tsf"
      style={{ position: "relative", width: "100%", aspectRatio: "972 / 510.36", containerType: "inline-size" }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          border: "1px solid #2A5BFF",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <svg
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
        style={{
          position: "absolute",
          left: "49.409%",
          top: "0%",
          width: "1.44%",
          height: "3.331%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      >
        <path d="M0.249352 16.1056L12.3223 9.13534C12.9889 8.75044 12.9889 7.78818 12.3223 7.40328L0.249352 0.432984" stroke="#2A5BFF" />
      </svg>
      <svg
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
        style={{
          position: "absolute",
          left: "49.696%",
          top: "99.793%",
          width: "1.44%",
          height: "3.331%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      >
        <path d="M13.0729 16.1056L1 9.13534C0.333333 8.75044 0.333335 7.78818 1 7.40328L13.0729 0.432984" stroke="#2A5BFF" />
      </svg>

      {ELLIPSE_LEFT_PCT.map((left, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: `${ELLIPSE_TOP_PCT}%`,
            width: `${ELLIPSE_W_PCT}%`,
            height: `${ELLIPSE_H_PCT}%`,
            pointerEvents: "none",
          }}
        >
          <GlowCircle id={`bf-tsf-ring-glow-${i}`} />
        </div>
      ))}

      {FEATURES.map((label, i) => (
        <div
          key={label}
          className="bf-tsf-label"
          style={{
            position: "absolute",
            left: `${LABEL_CENTER_PCT[i]}%`,
            top: `${LABEL_TOP_PCT}%`,
            transform: "translate(-50%,-50%)",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontSize: "clamp(10px,2.3cqw,22.03px)",
            lineHeight: 1.18,
            color: "#fff",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
