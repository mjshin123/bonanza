// DATA & KYT API: 이용기관 ⇄ TranSight 호출·응답 구조도
const CALLS = [
  { label: "API 호출", caption: "거래번호 · 지갑주소", dir: "right" },
  { label: "API 응답값 반환", caption: "고위험 지갑 여부 · 위험 정보 유형 · RA 분류코드", dir: "left" },
];

function Node({ label, active }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 104,
        height: 104,
        borderRadius: "50%",
        background: active ? "radial-gradient(circle at 35% 30%, #4F7BFF 0%, #1640DB 70%)" : "#F4F5FB",
        color: active ? "#fff" : "#2F2F2F",
        fontSize: 15,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

function Arrow({ label, caption, dir }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 라벨은 화살표 선 한가운데에 얹음 */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: dir === "right" ? "row" : "row-reverse",
          alignItems: "center",
          justifyContent: "center",
          width: "calc(100% + 8px)",
          height: 28,
          marginBottom: 6,
        }}
      >
        <span style={{ flex: 1, height: 1.5, background: "#2A5BFF" }} />
        <svg width="8" height="12" viewBox="0 0 8 12" style={{ display: "block", marginLeft: dir === "right" ? -7 : 0, marginRight: dir === "right" ? 0 : -7 }}>
          <path d={dir === "right" ? "M1 1 L7 6 L1 11" : "M7 1 L1 6 L7 11"} fill="none" stroke="#2A5BFF" strokeWidth="1.5" />
        </svg>
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            padding: "4px 12px",
            borderRadius: 999,
            border: "1px solid #2A5BFF",
            background: "#fff",
            color: "#1640DB",
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <span style={{ fontSize: 12, lineHeight: 1.5, color: "#7A8299", textAlign: "center", wordBreak: "keep-all" }}>{caption}</span>
    </div>
  );
}

export default function KytApiDiagram() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        maxWidth: 520,
        margin: "0 auto",
        padding: "8px 0",
      }}
    >
      <Node label="이용기관" />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {CALLS.map((call) => (
          <Arrow key={call.label} {...call} />
        ))}
      </div>
      <Node label="TranSight" active />
    </div>
  );
}
