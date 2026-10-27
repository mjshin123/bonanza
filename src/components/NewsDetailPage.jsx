import { useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { accentNums } from "../lib/accentNums.jsx";

function PlaceholderImage() {
  return (
    <div
      style={{
        height: 460,
        borderRadius: 8,
        background: "linear-gradient(135deg,#dbe2fb,#c3cef7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--blue-400)",
        marginBottom: 48,
      }}
    >
      <ImageIcon width={40} height={40} />
    </div>
  );
}

export default function NewsDetailPage({ items, listPath, showCategory = true }) {
  const { id } = useParams();
  const item = items.find((n) => String(n.id) === id);
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);

  useEffect(() => {
    if (item) window.scrollTo(0, 0);
  }, [item]);

  if (!item) return <Navigate to={listPath} replace />;

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <header ref={darkZoneRef} style={{ background: "#0A0A0A" }}>
        <div className="bf-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 48px 40px" }}>
          {showCategory && <div
            className="bf-reveal"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#5E8EFF", marginBottom: 20, textTransform: "uppercase" }}
          >
            {item.category}
          </div>}
          <h1
            className="bf-accent bf-reveal"
            style={{ margin: 0, fontWeight: 500, fontSize: "clamp(24px,2.9vw,36px)", lineHeight: 1.3, letterSpacing: "-0.01em", color: "#fff" }}
          >
            {accentNums(item.title)}
          </h1>
          <div style={{ marginTop: 40 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,.45)", fontWeight: 500 }}>{item.date}</span>
          </div>
        </div>
      </header>

      <main className="bf-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px 100px" }}>
        {item.hasImage && <PlaceholderImage />}

        <ul style={{ margin: "0 0 40px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {item.bullets.map((bullet) => (
            <li key={bullet} style={{ display: "flex", gap: 12, fontSize: 16, fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--primary)" }}>•</span>
              {bullet}
            </li>
          ))}
        </ul>

        <div style={{ maxWidth: 840, display: "flex", flexDirection: "column", gap: 24 }}>
          {item.body.map((paragraph) => (
            <p key={paragraph} style={{ margin: 0, fontSize: 16, lineHeight: 1.9, color: "var(--text-muted)", fontWeight: 500 }}>
              {paragraph}
            </p>
          ))}
        </div>

        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 56,
              padding: "12px 20px",
              borderRadius: 4,
              background: "var(--grey-900)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            원문 보기 <ArrowUpRight width={16} height={16} />
          </a>
        )}
      </main>
    </div>
  );
}
