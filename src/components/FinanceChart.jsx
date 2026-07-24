import { useEffect, useRef, useState } from "react";

export default function FinanceChart({ title, unit, data }) {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  const max = Math.max(...data.map((d) => d.value));
  const lastIndex = data.length - 1;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "36px 32px 28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 32 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>{title}</span>
        {unit && (
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-subtle)" }}>
            (단위: {unit})
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, height: 200 }}>
        {data.map((d, i) => {
          const isLast = i === lastIndex;
          const barHeight = Math.max(10, Math.round((d.value / max) * 176));
          const barDelay = i * 0.06;
          const textDelay = barDelay + 0.35;
          return (
            <div
              key={d.year}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: isLast ? "var(--primary)" : "var(--text-strong)",
                  marginBottom: 10,
                  whiteSpace: "nowrap",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(6px)",
                  transition: `opacity .45s ease ${textDelay}s, transform .45s ease ${textDelay}s`,
                }}
              >
                {d.value}
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 46,
                  height: barHeight,
                  borderRadius: "4px 4px 0 0",
                  background: isLast ? "linear-gradient(180deg,var(--blue-300) 0%,var(--primary) 100%)" : "var(--blue-100)",
                  transformOrigin: "bottom",
                  transform: inView ? "scaleY(1)" : "scaleY(0)",
                  transition: `transform .6s cubic-bezier(.4,0,.2,1) ${barDelay}s`,
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  fontWeight: isLast ? 700 : 500,
                  color: isLast ? "var(--text-strong)" : "var(--text-muted)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(6px)",
                  transition: `opacity .45s ease ${barDelay}s, transform .45s ease ${barDelay}s`,
                }}
              >
                {d.year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
