const ITEMS = [
  {
    tag: "DATA & KYT API",
    title: ["위험 주소 데이터 &", "실시간 KYT 검증"],
    desc: "국내 최대 규모 가상자산 범죄 라벨링 데이터(RA)와 실시간 KYT API로 모든 입출금 거래에서 위험을 즉시 감지하고 차단합니다.",
  },
  {
    tag: "TRANSIGHT WEB",
    title: ["트랜잭션 맵 &", "민관 공조 플랫폼"],
    desc: "멀티체인 자금 흐름을 시각화하고 Auto Trace로 1번의 클릭에 핵심 경로를 추적합니다. IAAN Protocol로 실시간 동결 요청을 중계합니다.",
  },
  {
    tag: "EXPERT ANALYSIS",
    title: ["전문 분석 &", "인텔리전스 리포트"],
    desc: "가상자산 범죄 전문가가 복잡한 온체인 분석을 수행하고 정기 인텔리전스 리포트를 발간합니다. 실시간 범죄 대응 파트너로서 즉각 지원합니다.",
  },
];

export default function TransightSolutions() {
  return (
    <section className="bf-pad" style={{ background: "#fff", padding: "110px 40px 50px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          className="bf-reveal"
          style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 20 }}
        >
          제공 솔루션
        </div>
        <div className="bf-bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {ITEMS.map((item, i) => (
            <div
              key={item.tag}
              className="bf-bento-card bf-reveal"
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "36px 34px",
                display: "flex",
                flexDirection: "column",
                "--reveal-delay": `${i * 0.15}s`,
              }}
            >
              <div className="bf-bento-glow" />
              <div style={{ position: "relative" }}>
                <div
                  className="bf-bento-tag"
                  style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "#2A5BFF",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    marginBottom: 18,
                  }}
                >
                  {item.tag}
                </div>
                <h3 className="bf-bento-title" style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 24, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                  {item.title[0]}
                  <br />
                  {item.title[1]}
                </h3>
                <p className="bf-bento-desc" style={{ margin: 0, fontSize: 14, lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
