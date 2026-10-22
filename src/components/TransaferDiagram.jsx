// 거래소 ⇄ TranSafer ⇄ 은행 중계 구조도
const LINKS = [
  { label: "입출금 요청", caption: "블랙리스트 검증" },
  { label: "전문 중계", caption: "사고계좌 · 지급정지" },
];

function Node({ label, active }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 112,
        height: 112,
        borderRadius: "50%",
        background: active ? "radial-gradient(circle at 35% 30%, #4F7BFF 0%, #1640DB 70%)" : "#F4F5FB",
        color: active ? "#fff" : "#2F2F2F",
        fontSize: 16,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

function Head({ dir }) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" style={{ display: "block", flex: "0 0 auto" }}>
      <path d={dir === "right" ? "M1 1 L7 6 L1 11" : "M7 1 L1 6 L7 11"} fill="none" stroke="#2A5BFF" strokeWidth="1.5" />
    </svg>
  );
}

// 양방향 화살표: 라벨은 선 한가운데, 설명은 선 아래
function Link({ label, caption }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: 28, marginBottom: 6 }}>
        <Head dir="left" />
        <span style={{ flex: 1, height: 1.5, margin: "0 -7px", background: "#2A5BFF" }} />
        <Head dir="right" />
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

export default function TransaferDiagram() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 780, margin: "0 auto", padding: "8px 0" }}>
      <Node label="거래소" />
      <Link {...LINKS[0]} />
      <Node label="TranSafer" active />
      <Link {...LINKS[1]} />
      <Node label="은행" />
    </div>
  );
}
