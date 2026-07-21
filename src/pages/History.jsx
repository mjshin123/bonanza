import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { historyEntries, groupHistoryByYear } from "../data/history.js";

const timeline = groupHistoryByYear(historyEntries);

function HistoryRow({ row }) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!row.detail;

  function toggle(e) {
    if (e) e.stopPropagation();
    setOpen((v) => !v);
  }

  return (
    <div
      className="bf-histrow"
      data-clickable={hasDetail ? "1" : "0"}
      onClick={hasDetail ? toggle : undefined}
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr 32px",
        alignItems: "start",
        columnGap: 20,
        padding: "22px 12px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        className="bf-histmonth"
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text-subtle)",
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
          paddingTop: 4,
          whiteSpace: "nowrap",
        }}
      >
        {`${row.month}월`}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          className="bf-histttl"
          style={{
            fontSize: "clamp(16px,1.5vw,20px)",
            fontWeight: 600,
            lineHeight: 1.4,
            color: "var(--text-strong)",
            letterSpacing: "-0.01em",
            transition: "color .18s ease",
          }}
        >
          {row.title}
        </div>
      </div>

      {hasDetail ? (
        <button
          aria-label="toggle"
          onClick={toggle}
          style={{
            justifySelf: "end",
            width: 26,
            height: 26,
            border: "none",
            borderRadius: 5,
            background: open ? "var(--primary)" : "var(--grey-900)",
            color: "#fff",
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background .2s ease, transform .25s ease",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 300, lineHeight: 1 }}>+</span>
        </button>
      ) : (
        <span />
      )}

      {hasDetail && (
        <div
          className="bf-histdetail"
          style={{
            gridColumn: "2 / 3",
            minWidth: 0,
            maxHeight: open ? 520 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            marginTop: open ? 14 : 0,
            transition: "max-height .4s cubic-bezier(.4,0,.2,1), opacity .26s ease, margin-top .3s ease",
          }}
        >
          <p style={{ margin: 0, maxWidth: 720, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", fontWeight: 500 }}>
            {row.detail}
          </p>
          {row.image && (
            <div
              style={{
                marginTop: 18,
                width: "100%",
                maxWidth: 400,
                aspectRatio: "16 / 10",
                borderRadius: 0,
                background: "linear-gradient(135deg,#eef1fc,#dbe2fb)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
                color: "var(--blue-400)",
              }}
            >
              <ImageIcon width={34} height={34} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>이미지 영역 (추후 삽입)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryYear({ year, rows, isLast }) {
  return (
    <section
      className="bf-reveal"
      style={{ padding: "44px 0 8px", borderBottom: isLast ? "1px solid var(--border)" : "none" }}
    >
      <div
        className="bf-year"
        style={{
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: 18,
          color: "var(--text-strong)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {year}
      </div>
      <div>
        {rows.map((row) => (
          <HistoryRow key={row.id} row={row} />
        ))}
      </div>
    </section>
  );
}

export default function History() {
  useEffect(() => {
    document.title = "연혁 | Bonanza Factory";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <header id="top" className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 48px 40px" }}>
        <div
          className="bf-reveal"
          style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-subtle)", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", marginBottom: 26 }}
        >
          <Link to="/" style={{ color: "var(--text-subtle)" }}>홈</Link>
          <ChevronRight width={15} height={15} />
          <span style={{ color: "var(--text-strong)" }}>연혁</span>
        </div>
        <div className="bf-reveal" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "var(--primary)", marginBottom: 20 }}>
          HISTORY
        </div>
        <h1
          className="bf-reveal"
          style={{ margin: 0, fontWeight: 500, fontSize: "clamp(26px,3.4vw,42px)", lineHeight: 1.3, letterSpacing: "-0.01em", color: "var(--text-strong)" }}
        >
          하나씩 쌓아온 발자취,<br />보난자팩토리의 연혁
        </h1>
        <p className="bf-reveal" style={{ margin: "22px 0 0", maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)" }}>
          국내 최초 가상자산 컴플라이언스 기업으로서 걸어온 길을 연도별로 소개합니다.
        </p>
      </header>

      <main className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 48px 120px" }}>
        {timeline.map((g, i) => (
          <HistoryYear key={g.year} year={g.year} rows={g.rows} isLast={i === timeline.length - 1} />
        ))}
      </main>
    </div>
  );
}
