export default function FinanceChart({ title, unit, data }) {
  const max = Math.max(...data.map((d) => d.value));
  const lastIndex = data.length - 1;

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "36px 32px 28px" }}>
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
              <div style={{ fontSize: 18, fontWeight: 800, color: isLast ? "var(--primary)" : "var(--text-strong)", marginBottom: 10, whiteSpace: "nowrap" }}>
                {d.value}
              </div>
              <div
                className="bf-fbar"
                style={{
                  width: "100%",
                  maxWidth: 46,
                  height: barHeight,
                  borderRadius: "4px 4px 0 0",
                  background: isLast ? "linear-gradient(180deg,var(--blue-300) 0%,var(--primary) 100%)" : "var(--blue-100)",
                  transitionDelay: `${i * 0.06}s`,
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  fontWeight: isLast ? 700 : 500,
                  color: isLast ? "var(--text-strong)" : "var(--text-muted)",
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
