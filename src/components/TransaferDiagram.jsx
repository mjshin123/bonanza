import { useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../data/translations/compliance.js";

// 거래소 ⇄ TranSafer ⇄ 은행 중계 구조도
const LINKS = [
  { label: "입출금 요청", caption: "블랙리스트 검증" },
  { label: "전문 중계", caption: "사고계좌 · 지급정지" },
];

// 이보다 좁은 칸(모바일)에서는 가로 배치를 유지한 채 원·글자를 줄이고, 라벨을 선 위로 올림
const COMPACT_WIDTH = 560;

// 그림이 실제로 들어가는 칸의 폭 (뷰포트가 아니라 칸 기준이라 태블릿 2단 배치에서도 맞음)
function useWidth(ref) {
  const [width, setWidth] = useState(Infinity);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

function Node({ label, active, size, fontSize }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: active ? "radial-gradient(circle at 35% 30%, #4F7BFF 0%, #1640DB 70%)" : "#F4F5FB",
        color: active ? "#fff" : "#2F2F2F",
        fontSize,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

function Head({ dir }) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" style={{ display: "block", flex: "0 0 auto" }}>
      <path d={dir === "right" ? "M1 1 L7 6 L1 11" : "M7 1 L1 6 L7 11"} fill="none" stroke="#2A5BFF" strokeWidth="1.5" />
    </svg>
  );
}

// 양방향 화살표: 라벨은 선 한가운데(좁을 때는 선 바로 위), 설명은 선 아래
function Link({ label, caption, compact }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: 28, marginBottom: compact ? 4 : 6 }}>
        <Head dir="left" />
        <span style={{ flex: 1, height: 1.5, margin: "0 -7px", background: "#2A5BFF" }} />
        <Head dir="right" />
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: compact ? "auto" : "50%",
            bottom: compact ? "calc(50% + 5px)" : "auto",
            transform: compact ? "translateX(-50%)" : "translate(-50%,-50%)",
            padding: compact ? "3px 6px" : "4px 12px",
            borderRadius: 999,
            border: "1px solid #2A5BFF",
            background: "#fff",
            color: "#1640DB",
            fontSize: compact ? 11 : 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: compact ? 11 : 12,
          lineHeight: 1.5,
          color: "#7A8299",
          textAlign: "center",
          wordBreak: "keep-all",
        }}
      >
        {caption}
      </span>
    </div>
  );
}

export default function TransaferDiagram() {
  const { isEnglish } = useLanguage();
  const translate = (value) => isEnglish ? (translations[value] ?? value) : value;
  const ref = useRef(null);
  const width = useWidth(ref);
  const compact = width < COMPACT_WIDTH;
  // 좁은 칸: 칸 폭의 약 1/5 크기 원 (64~112px), 라벨이 들어갈 화살표 폭을 남김
  const size = compact ? Math.max(64, Math.min(112, Math.round(width * 0.19))) : 112;
  const fontSize = compact ? 12 : 16;
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 4 : 12,
        maxWidth: 850,
        margin: "0 auto",
        padding: compact ? "24px 0 8px" : "8px 0",
      }}
    >
      <Node label={translate("거래소")} size={size} fontSize={fontSize} />
      <Link label={translate(LINKS[0].label)} caption={translate(LINKS[0].caption)} compact={compact} />
      <Node label="TranSafer" active size={size} fontSize={fontSize} />
      <Link label={translate(LINKS[1].label)} caption={translate(LINKS[1].caption)} compact={compact} />
      <Node label={translate("은행")} size={size} fontSize={fontSize} />
    </div>
  );
}
