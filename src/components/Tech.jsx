import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { homeMilestones } from "../data/history.js";
import DiamondSvg from "./DiamondSvg.jsx";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { accentNums } from "../lib/accentNums.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import homeTranslations from "../data/translations/home.js";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(year, month, isEnglish) {
  return isEnglish ? `${monthNames[Number(month) - 1]} ${year}` : `${year}년 ${month}월`;
}

function translated(value, isEnglish) {
  return isEnglish ? (homeTranslations[value] ?? value) : value;
}

// 연혁 페이지와 동일한 데이터에서 "홈 화면에 보이기"로 표시된 항목만 사용한다.
const milestones = homeMilestones.filter((entry) => entry.showOnHome);

const W = 1120;
const DW = 300;
const DH = 128;
const STEP = 46;
const CX = 540;
const TOP = 96;
const GAP = 26;
const TIP_X = CX - DW / 2 + 6;
const H = TOP + DH / 2 + (milestones.length - 1) * STEP + GAP + DH / 2 + 60;

function centerY(i, sel) {
  return TOP + DH / 2 + i * STEP + (i < sel ? -GAP : i > sel ? GAP : 0);
}

export default function Tech() {
  const [sel, setSel] = useState(0);
  const { isEnglish } = useLanguage();
  const picked = milestones[sel];
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);

  return (
    <section ref={darkZoneRef} id="tech" className="bf-pad" style={{ position: "relative", zIndex: 0, background: "#0A0A0A", padding: "96px 40px 84px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h2
          className="bf-accent bf-reveal"
          style={{
            margin: "0 auto",
            fontWeight: 700,
            fontSize: "clamp(26px,3.2vw,36px)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: "#fff",
            maxWidth: 1100,
            textAlign: "center",
          }}
        >
          {isEnglish ? "A History of Achievement, a Commitment to Innovation" : "하나씩 쌓아온 인증과 성과가, 지금의 기술력이 되었습니다."}
        </h2>

        <div id="bf-stack">
          <div className="bf-stack-stage" style={{ width: W, height: H, transform: "scale(0.9)", transformOrigin: "top center" }}>
            {milestones.map((m, i) => {
              const isSel = i === sel;
              const cy = centerY(i, sel);
              return (
                <div
                  key={`connector-${i}`}
                  className="bf-connector"
                  onMouseEnter={() => setSel(i)}
                  style={{
                    left: 250,
                    width: TIP_X - 250,
                    top: cy,
                    borderTop: `1px solid ${isSel ? "#4566E2" : "rgba(255,255,255,0.35)"}`,
                  }}
                />
              );
            })}
            {milestones.map((m, i) => {
              const isSel = i === sel;
              const cy = centerY(i, sel);
              return (
                <div
                  key={`diamond-${i}`}
                  className="bf-diamond"
                  onMouseEnter={() => setSel(i)}
                  style={{
                    left: CX - DW / 2,
                    top: cy - DH / 2,
                    width: DW,
                    height: DH,
                    zIndex: isSel ? 200 : milestones.length - i,
                    transform: isSel ? "scale(1.05)" : "none",
                    transformOrigin: "center",
                    filter: isSel
                      ? "drop-shadow(0 26px 48px rgba(22,64,219,.55))"
                      : "drop-shadow(0 10px 20px rgba(0,0,0,.35))",
                  }}
                >
                  <DiamondSvg index={i} selected={isSel} />
                </div>
              );
            })}
            {milestones.map((m, i) => {
              const isSel = i === sel;
              const cy = centerY(i, sel);
              return (
                <div
                  key={`title-${i}`}
                  className="bf-title"
                  onMouseEnter={() => setSel(i)}
                  style={{
                    left: -40,
                    width: 290,
                    top: cy,
                    color: isSel ? "#5E8EFF" : "#ffffff",
                  }}
                >
                  {translated(m.title, isEnglish)}
                </div>
              );
            })}

            <div style={{ position: "absolute", left: 760, top: 150, width: 320 }}>
              <div style={{ color: "#BFBFBF", fontSize: 14, fontWeight: 400, marginBottom: 26 }}>
                {formatDate(picked.year, picked.month, isEnglish)}
              </div>
              <div className="bf-accent" style={{ color: "#5E8EFF", fontSize: 21, fontWeight: 700, lineHeight: 1.4, marginBottom: 18 }}>
                {accentNums(translated(picked.title, isEnglish))}
              </div>
              <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 400, lineHeight: 1.6 }}>{translated(picked.detail, isEnglish)}</div>
              {picked.image && (
                <div
                  style={{
                    marginTop: 20,
                    width: "100%",
                    maxWidth: 280,
                    aspectRatio: "16 / 10",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                    color: "#9DBBFF",
                  }}
                >
                  <ImageIcon width={28} height={28} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{translated("이미지 영역 (추후 삽입)", isEnglish)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bf-stack-mobile">
            {milestones.map((m, i) => (
              <div className="bf-stack-mobile-item" key={`mobile-${i}`}>
                <div style={{ color: "#5E8EFF", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  {formatDate(m.year, m.month, isEnglish)}
                </div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{translated(m.title, isEnglish)}</div>
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1.6 }}>{translated(m.detail, isEnglish)}</div>
                {m.image && (
                  <div
                    style={{
                      marginTop: 14,
                      width: "100%",
                      maxWidth: 320,
                      aspectRatio: "16 / 10",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 8,
                      color: "#9DBBFF",
                    }}
                  >
                    <ImageIcon width={26} height={26} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{translated("이미지 영역 (추후 삽입)", isEnglish)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <Link
            to="/history"
            className="bf-ghostlink"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              border: "1px solid #5E8EFF",
              borderRadius: 4,
              color: "#5E8EFF",
              fontWeight: 600,
              fontSize: 14,
              transition: "background .2s ease",
            }}
          >
            연혁 보기 <ArrowRight width={20} height={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
