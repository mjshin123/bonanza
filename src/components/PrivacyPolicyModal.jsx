import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { privacyPolicyVersions } from "../data/privacyPolicy.js";

const CELL_STYLE = {
  padding: "10px 12px",
  border: "1px solid var(--border)",
  textAlign: "left",
  verticalAlign: "top",
};

function Block({ block }) {
  if (block.p) return <p style={{ margin: 0 }}>{block.p}</p>;
  if (block.ul)
    return (
      <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6, listStyle: "disc" }}>
        {block.ul.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  if (block.table)
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {block.table.head.map((h) => (
                <th key={h} style={{ ...CELL_STYLE, background: "#f5f6f8", fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row) => (
              <tr key={row.join("|")}>
                {row.map((cell, i) => (
                  <td key={i} style={CELL_STYLE}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return null;
}

// 개인정보 처리방침 전문. 상단 개정 이력에서 이전 버전을 골라 볼 수 있다.
export default function PrivacyPolicyModal({ open, onClose }) {
  const [versionId, setVersionId] = useState(privacyPolicyVersions[0].id);
  const bodyRef = useRef(null);
  const version = privacyPolicyVersions.find((v) => v.id === versionId) ?? privacyPolicyVersions[0];
  const isCurrent = version.id === privacyPolicyVersions[0].id;

  useEffect(() => {
    if (!open) return undefined;
    setVersionId(privacyPolicyVersions[0].id);
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [versionId]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 210,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,10,10,.55)",
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 760,
          maxHeight: "min(86vh, 900px)",
          background: "#fff",
        }}
      >
        <div style={{ padding: "32px 40px 20px", borderBottom: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <X width={20} height={20} />
          </button>
          <h3
            id="privacy-policy-title"
            style={{ margin: 0, fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "var(--text-strong)" }}
          >
            개인정보 처리방침
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
            <label htmlFor="privacy-policy-version" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>
              개정 이력
            </label>
            <select
              id="privacy-policy-version"
              value={version.id}
              onChange={(e) => setVersionId(e.target.value)}
              style={{
                padding: "7px 10px",
                fontSize: 13,
                color: "var(--text-strong)",
                background: "#fff",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {privacyPolicyVersions.map((v, i) => (
                <option key={v.id} value={v.id}>
                  {v.effectiveDate} 시행{i === 0 ? " (현행)" : ""}
                </option>
              ))}
            </select>
            {!isCurrent && (
              <button
                type="button"
                onClick={() => setVersionId(privacyPolicyVersions[0].id)}
                style={{ padding: 0, fontSize: 13, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
              >
                현행 방침 보기
              </button>
            )}
          </div>
          {!isCurrent && (
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--danger)", textAlign: "right" }}>
              현재 보고 계신 내용은 이전 버전의 처리방침입니다.
            </div>
          )}
        </div>

        <div
          ref={bodyRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 40px 36px",
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--text-muted)",
            wordBreak: "keep-all",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {version.sections.map((section) => (
              <section key={section.title}>
                <h4 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>
                  {section.title}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
            <section>
              <h4 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>부칙</h4>
              <p style={{ margin: 0 }}>
                본 개인정보 처리방침은 {version.effectiveDate}부터 시행합니다.
                {version.note ? ` (${version.note})` : ""}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
