const logos = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));

function LogoChip({ mark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 44px", height: 96, flex: "none" }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 0,
          background: "var(--grey-100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--grey-400)",
          fontWeight: 800,
          fontSize: 14,
          flex: "none",
        }}
      >
        {mark}
      </div>
      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--grey-400)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
        LOGO
      </span>
    </div>
  );
}

function MarqueeRow({ direction }) {
  const doubled = [...logos, ...logos];
  return (
    <div className="bf-marquee-viewport">
      <div className={direction === "left" ? "bf-marquee-row bf-marquee-left" : "bf-marquee-row bf-marquee-right"}>
        {doubled.map((mark, i) => (
          <LogoChip key={i} mark={mark} />
        ))}
      </div>
    </div>
  );
}

export default function Network() {
  return (
    <section id="network" className="bf-pad" style={{ background: "#fff", padding: "110px 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div className="bf-reveal" style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 48px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14 }}>
            TRUST NETWORK
          </div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(26px,3.2vw,36px)", lineHeight: 1.35, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
            국내 및 글로벌 기업·기관의
            <br />
            신뢰를 받고 있습니다
          </h2>
        </div>
      </div>

      <div className="bf-reveal" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <MarqueeRow direction="left" />
        </div>
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          <MarqueeRow direction="right" />
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <p className="bf-reveal" style={{ textAlign: "center", fontSize: 12, color: "var(--text-subtle)", marginTop: 20 }}>
          * 로고는 배치용 플레이스홀더입니다. 실제 파트너 로고로 교체해 주세요.
        </p>
      </div>
    </section>
  );
}
