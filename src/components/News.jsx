import { Link } from "react-router-dom";
import { newsItems as allNewsItems } from "../data/news.js";

const newsItems = allNewsItems.slice(0, 4);

export default function News() {
  return (
    <section id="news" className="bf-pad" style={{ background: "var(--surface-subtle)", padding: "110px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="bf-split" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.45fr", gap: 64, alignItems: "start" }}>
          <div>
            <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14 }}>
              NEWSROOM
            </div>
            <h2 className="bf-reveal" style={{ margin: "0 0 16px", fontWeight: 700, fontSize: "clamp(26px,3.2vw,36px)", letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
              최신 뉴스
            </h2>
            <p className="bf-reveal" style={{ margin: "0 0 28px", fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 300 }}>
              보난자팩토리의 새로운 소식과
              <br />
              성과를 전해드립니다.
            </p>
            <div className="bf-reveal">
              <Link to="/보도자료" className="bf-btn-outline">
                전체 보기
              </Link>
            </div>
          </div>
          <div className="bf-reveal">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-subtle)", marginBottom: 8 }}>
              LATEST
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {newsItems.map((item, i) => (
                <Link
                  key={item.id}
                  to={`/보도자료/${item.id}`}
                  className="bf-techrow"
                  style={{
                    display: "block",
                    borderTop: "1px solid var(--border)",
                    borderBottom: i === newsItems.length - 1 ? "1px solid var(--border)" : undefined,
                    padding: "20px 0",
                    textDecoration: "none",
                  }}
                >
                  <div className="bf-techttl" style={{ fontWeight: 500, fontSize: "clamp(18px,1.8vw,22px)", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                    {item.title}
                  </div>
                  <div className="bf-techsub" style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {item.category} · {item.date}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
