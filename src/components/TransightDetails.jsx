import { ArrowRight } from "lucide-react";
import { accentNums } from "../lib/accentNums.jsx";
import KytApiDiagram from "./KytApiDiagram.jsx";

const SECTIONS = [
  {
    tag: "DATA & KYT API",
    heading: "국내 컴플라이언스 환경에 최적화된 데이터 및 리스크 평가 모델로, 고객사별 규제 및 니즈에 따라 맞춤형 솔루션을 제공합니다.",
    features: [
      {
        video: "/videos/transight-api.mp4",
        diagram: KytApiDiagram,
        points: [
          "독보적인 국내 범죄 라벨링 데이터",
          "자체 온체인 분석 알고리즘을 통한 폭넓은 커버리지",
          "실무 환경에서 검증된 리스크 모델과 실시간 KYT API",
        ],
      },
    ],
  },
  {
    tag: "TranSight WEB",
    heading:
      "수사기관의 추적·실시간 모니터링·공조 요청을 하나로 잇고, 금융기관의 의심거래 대응 컴플라이언스 체계를 강화하는 금융범죄 인텔리전스 플랫폼입니다.",
    features: [
      {
        title: "트랜잭션 맵",
        video: "/videos/transight-map.mp4",
        lead: "자금 흐름을 한눈에 파악하는 혁신적인 자체 설계 맵으로, 체인별 고유 특성에 맞게 설계되었으며 멀티체인 추적 및 뷰 모드 전환에 최적화된 UX를 제공합니다.",
        points: [
          "가상자산 자금 이동 1 Click 자동 추적",
          "크로스체인 전송을 하나의 맵에서, Canvas Map",
          "탭 전환으로 끊김 없는 Non-Stop 분석 환경",
        ],
      },
      {
        title: "공조 요청 (IAAN)",
        titleNote: "Institutional AML Alliance Network",
        video: "/videos/transight-request.mp4",
        lead: "수사기관과 거래소 간 고객 정보 및 주소 동결을 전송하는 공조 요청 중계 플랫폼입니다. 공조 요청 프로세스의 효율화로 신속한 차단이 가능하며, 다양한 거래소와의 요청 창구를 일원화하여 관리합니다.",
        points: [
          "평균 48시간 이내 응답받는 공조 중계 플랫폼",
          "종단간 암호화 기반의 Zero-Knowledge 파일 전달",
          "컴플라이언스 부서와 직접 소통하는 커뮤니케이션 채널 제공",
        ],
      },
    ],
  },
  {
    tag: "EXPERT ANALYSIS",
    heading: "블록체인 전문가의 온체인 분석 및 긴급 대응 컨설팅을 제공하며, 가상자산 범죄 관련 정기 리포트를 발간합니다.",
    features: [
      {
        video: "/videos/transight-report.mp4",
        points: [
          "블록체인 전문가의 사건별 1:1 온체인 분석 리포트 제공",
          "긴급 대응 컨설팅을 통한 실시간 범죄 대응 파트너",
          "가상자산 범죄 트렌드 리포트 정기 발간",
        ],
      },
    ],
  },
];

const SITE_URL = "https://www.transight.io/";

function renderHeading(text) {
  const idx = text.indexOf(",");
  if (idx === -1) return accentNums(text);
  return (
    <>
      {accentNums(text.slice(0, idx + 1))}
      <br />
      {accentNums(text.slice(idx + 1).trim())}
    </>
  );
}

function DetailItem({ index, title }) {
  return (
    <div
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
      <span style={{ fontSize: 15, fontWeight: 600, color: "#2A5BFF" }}>{String(index + 1).padStart(2, "0")}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#2F2F2F" }}>{title}</span>
    </div>
  );
}

export default function TransightDetails() {
  let videoCount = 0;
  return (
    <section className="bf-pad" style={{ background: "#fff", padding: "110px 40px 130px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 160 }}>
        {SECTIONS.map((sec, i) => (
          <div key={sec.tag} className="bf-reveal" style={{ transitionDelay: `${0.3 + i * 0.1}s` }}>
            <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6.5px 16px",
                borderRadius: 30,
                background: "#1640DB",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {sec.tag}
            </span>
            <h2 className="bf-accent"
              style={{
                margin: "20px auto 0",
                maxWidth: 1200,
                wordBreak: "keep-all",
                fontWeight: 500,
                fontSize: "clamp(20px,2.1vw,30px)",
                lineHeight: 1.35,
                color: "#000",
              }}
            >
              {renderHeading(sec.heading)}
            </h2>
            </div>
            {sec.features.map((feature, fi) => {
              // 페이지 전체에서 영상이 우·좌로 번갈아 오도록 (첫 영상은 우측)
              const videoRight = videoCount++ % 2 === 0;
              return (
              <div key={feature.video} style={{ marginTop: fi === 0 ? 40 : 64 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: videoRight ? "row-reverse" : "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 56,
                  }}
                >
                  <div
                    style={{
                      flex: "0.85 1 420px",
                      minWidth: 0,
                      aspectRatio: "16 / 9",
                      overflow: "hidden",
                      borderRadius: 14,
                      background: "#F4F5FB",
                    }}
                  >
                    <video
                      src={feature.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 380px", minWidth: 0, wordBreak: "keep-all" }}>
                    {feature.title && (
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          margin: "0 0 14px",
                          fontWeight: 700,
                          fontSize: 22,
                          letterSpacing: "-0.01em",
                          color: "#000",
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#2A5BFF" }}>주요 기능</span>
                        {feature.title}
                        {feature.titleNote && (
                          <span style={{ fontSize: 13, fontWeight: 400, letterSpacing: 0, color: "#7A8299" }}>
                            {feature.titleNote}
                          </span>
                        )}
                      </h3>
                    )}
                    {feature.diagram && <feature.diagram />}
                    {feature.lead && (
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 500, lineHeight: 1.7, color: "#2F2F2F" }}>{feature.lead}</p>
                    )}
                    <div
                      style={{
                        marginTop: feature.diagram || feature.lead ? 24 : 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {feature.points.map((point, pi) => (
                        <DetailItem key={point} index={pi} title={point} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
            {sec.items && (
              <div
                className="bf-detailsgrid"
                style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}
              >
                {sec.items.map((title, ii) => (
                  <DetailItem key={title} index={ii} title={title} />
                ))}
              </div>
            )}
          </div>
        ))}

        <div
          className="bf-reveal"
          style={{ display: "flex", justifyContent: "center", transitionDelay: `${0.3 + SECTIONS.length * 0.1}s` }}
        >
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 4,
              background: "#1640DB",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            더 알아보기 <ArrowRight width={16} height={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
