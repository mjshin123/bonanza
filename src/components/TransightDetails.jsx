const SECTIONS = [
  {
    tag: "DATA & KYT API",
    heading: "국내 컴플라이언스 환경에 최적화된 데이터 및 리스크 평가 모델로, 고객사별 규제 및 니즈에 따라 맞춤형 솔루션을 제공합니다.",
    columns: 1,
    items: ["독보적인 국내 범죄 데이터", "자체 온체인 분석 알고리즘을 통한 폭넓은 커버리지", "실무 환경에서 검증된 리스크 모델"],
  },
  {
    tag: "TranSight WEB",
    heading:
      "자금 흐름을 한눈에 파악하는 혁신적인 자체 설계 맵과, 공조 요청 프로세스의 효율화로 신속한 차단이 가능한 가상자산 통합 AML 솔루션입니다.",
    columns: 2,
    items: [
      "가상자산 자금 이동 1 Click 자동 추적",
      "크로스체인 전송을 하나의 맵에서, Canvas Map",
      "지갑주소 분석 리포트 생성",
      "평균 48시간 이내 응답받는 공조 중계 플랫폼",
      "종단간 암호화 방식으로 안전한 파일 보관",
      "지갑주소 실시간 거래 모니터링 및 알림",
    ],
  },
  {
    tag: "EXPERT ANALYSIS",
    heading: "블록체인 전문가의 온체인 분석 및 긴급 대응 컨설팅을 제공하며, 가상자산 범죄 관련 정기 리포트를 발간합니다.",
    columns: 1,
    items: ["복잡한 온체인 분석 요청", "실시간 범죄 대응 파트너", "가상자산 범죄 트렌드 리포트 발간"],
  },
];

function renderHeading(text) {
  const idx = text.indexOf(",");
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx + 1)}
      <br />
      {text.slice(idx + 1).trim()}
    </>
  );
}

export default function TransightDetails() {
  return (
    <section className="bf-pad" style={{ background: "#fff", padding: "50px 40px 130px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 100 }}>
        {SECTIONS.map((sec, i) => (
          <div key={sec.tag} className="bf-reveal" style={{ transitionDelay: `${0.3 + i * 0.1}s` }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 30,
                background: "#1640DB",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {sec.tag}
            </span>
            <h2
              style={{
                margin: "20px 0 0",
                maxWidth: 1050,
                fontWeight: 500,
                fontSize: "clamp(18px,1.8vw,26px)",
                lineHeight: 1.35,
                color: "#000",
              }}
            >
              {renderHeading(sec.heading)}
            </h2>
            <div
              className="bf-detailsgrid"
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: sec.columns === 2 ? "repeat(2,1fr)" : "1fr",
                gridTemplateRows: sec.columns === 2 ? "repeat(3,1fr)" : undefined,
                gridAutoFlow: sec.columns === 2 ? "column" : "row",
                gap: 14,
              }}
            >
              {sec.items.map((title, i) => (
                <div
                  key={title}
                  className="bf-detailsitem"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    minHeight: 60,
                    padding: "14px 24px",
                    background: "#F4F5FB",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#2A5BFF" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#2F2F2F" }}>{title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
