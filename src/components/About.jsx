import StatCounter from "./StatCounter.jsx";

const stats = [
  { target: 1, suffix: "위", label: "국내 가상자산 컴플라이언스" },
  { target: 40, suffix: "+", label: "도입 기관·거래소" },
  { target: 99.2, decimals: 1, suffix: "%", label: "이상거래 탐지 정확도" },
  { target: 2, suffix: "조+", label: "누적 모니터링 규모(₩)" },
];

export default function About() {
  return (
    <section id="about" className="bf-pad" style={{ background: "#fff", padding: "110px 40px 160px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="bf-split" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 48, alignItems: "end" }}>
          <h2
            className="bf-reveal"
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 30,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "var(--text-strong)",
            }}
          >
            국내 최초 가상자산 컴플라이언스
            <br />
            솔루션으로 <span style={{ color: "var(--primary)" }}>업계 1위</span> 달성
          </h2>
          <div className="bf-reveal" style={{ paddingBottom: 6 }}>
            <div style={{ width: 40, height: 3, background: "var(--primary)", marginBottom: 18 }} />
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", fontWeight: 500 }}>
              국내 최대 규모의 원화입출금 솔루션의 노하우를 바탕으로 가상자산 규제 대응의 새로운 지평을 엽니다.
            </p>
          </div>
        </div>

        <div
          className="bf-stats bf-reveal"
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 0,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "40px 28px",
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : undefined,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
                <StatCounter target={stat.target} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
