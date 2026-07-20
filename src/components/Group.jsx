import { subsidiaries } from "../data/subsidiaries.js";

function renderDesc(desc) {
  const sentences = desc.split(/(?<=\.)\s+/);
  return sentences.map((sentence, idx) => (
    <span key={idx}>
      {sentence}
      {idx < sentences.length - 1 && <br />}
    </span>
  ));
}

export default function Group() {
  return (
    <section id="group" className="bf-pad" style={{ background: "var(--surface-subtle)", padding: "110px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="bf-reveal" style={{ maxWidth: 640, marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14 }}>
            GROUP SYNERGY
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 30, lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
            보난자 그룹의 모회사로서
            <br />
            자회사들과 시너지를 이끌어갑니다
          </h2>
        </div>

        <div className="bf-accrow bf-reveal">
          {subsidiaries.map((sub) => (
            <div
              key={sub.key}
              className="bf-acc"
              style={{ color: sub.color, border: sub.border }}
            >
              <div className="bf-acc-media" style={{ backgroundImage: `url(${sub.image})` }} />
              <div className="bf-acc-fade" />
              <div className="bf-acc-collapsed" style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                <span style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.02em" }}>
                  {sub.name}
                </span>
              </div>
              <div className="bf-acc-expanded" style={{ position: "absolute", left: 28, right: 28, bottom: 30 }}>
                <div style={{ fontWeight: 800, fontSize: 28, whiteSpace: "nowrap", marginBottom: 10 }}>{sub.name}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: sub.descColor, maxWidth: 760 }}>{renderDesc(sub.desc)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
