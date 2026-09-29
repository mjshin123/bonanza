const topLogos = [
  { src: "/images/network/top/bybit.jpg", alt: "Bybit" },
  { src: "/images/network/top/dwf-labs.jpg", alt: "DWF Labs" },
  { src: "/images/network/top/mexc.png", alt: "MEXC" },
  { src: "/images/network/top/weex.avif", alt: "WEEX" },
  { src: "/images/network/top/광주은행.jpg", alt: "광주은행" },
  { src: "/images/network/top/국민은행.jpg", alt: "국민은행" },
  { src: "/images/network/top/두나무.png", alt: "두나무" },
  { src: "/images/network/top/미래에셋.jpg", alt: "미래에셋" },
  { src: "/images/network/top/신한은행.png", alt: "신한은행" },
  { src: "/images/network/top/카카오뱅크.png", alt: "카카오뱅크" },
  { src: "/images/network/top/카카오페이.avif", alt: "카카오페이" },
  { src: "/images/network/top/케이뱅크.png", alt: "케이뱅크" },
  { src: "/images/network/top/코인원.png", alt: "코인원" },
  { src: "/images/network/top/하나은행.png", alt: "하나은행" },
];

const bottomLogos = [
  { src: "/images/network/bottom/kpmg.png", alt: "KPMG" },
  { src: "/images/network/bottom/lgcns.png", alt: "LG CNS" },
  { src: "/images/network/bottom/네이버.png", alt: "네이버" },
  { src: "/images/network/bottom/국세청.png", alt: "국세청" },
  { src: "/images/network/bottom/국방부.jpg", alt: "국방부" },
  { src: "/images/network/bottom/경찰청.jpg", alt: "경찰청" },
  { src: "/images/network/bottom/고려대학교.gif", alt: "고려대학교" },
  { src: "/images/network/bottom/취리히대학.png", alt: "취리히대학" },
];

function LogoTile({ src, alt }) {
  return (
    <div className="bf-logo-tile">
      <div className="bf-logo-box">
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "auto", flex: "none", display: "block" }}
        />
      </div>
    </div>
  );
}

function MarqueeRow({ direction, logos }) {
  const doubled = [...logos, ...logos];
  return (
    <div className="bf-marquee-viewport">
      <div className={direction === "left" ? "bf-marquee-row bf-marquee-left" : "bf-marquee-row bf-marquee-right"}>
        {doubled.map((logo, i) => (
          <LogoTile key={i} {...logo} />
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
          <h2 className="bf-accent" style={{ margin: 0, fontWeight: 700, fontSize: "clamp(26px,3.2vw,36px)", lineHeight: 1.35, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
            국내 및 글로벌 기업·기관의
            <br />
            신뢰를 받고 있습니다.
          </h2>
        </div>
      </div>

      <div className="bf-reveal" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <MarqueeRow direction="left" logos={topLogos} />
        </div>
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          <MarqueeRow direction="right" logos={bottomLogos} />
        </div>
      </div>
    </section>
  );
}
