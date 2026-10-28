import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { accentNums } from "../lib/accentNums.jsx";
import TransaferDiagram from "./TransaferDiagram.jsx";
import InquiryModal from "./InquiryModal.jsx";
import useStepProgress from "../hooks/useStepProgress.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../data/translations/compliance.js";

const PARENT_COMPANY = { name: "보난자팩토리", email: "contact@bonanza-factory.co.kr" };

const OVERVIEW = {
  label: "Overview",
  heading: "거래소와 은행 사이에서 원화 입출금 흐름을 검증하고, 인증부터 AML 업무까지 하나의 채널로 중계합니다.",
  video: "/videos/transafer-wide.mp4",
};

const API = {
  tag: "TranSafer API",
  heading: "거래소의 블랙리스트와 은행의 사고계좌 정보를 교차 검증하여, 각 기관의 AML/FDS 대응을 보조하고 이상 거래를 사전에 탐지합니다.",
  points: [
    "블랙리스트·사고계좌 기반 이상거래 탐지",
    "초고위험 고객 확인 및 지급정지 전문 중계",
  ],
  process: {
    label: "원화 입출금 검증 절차",
    heading: "전자금융보조업자로서 고객 전자서명 인증을 수행하여, 거래소·은행 간 원화 입출금 인증 절차를 안전하게 지원합니다.",
    steps: [
      { actor: "고객 → 거래소", text: "원화 입출금 요청" },
      { actor: "TranSafer → 고객", text: "전자서명 요청" },
      { actor: "TranSafer", text: "전자서명 완료 및 고객 검증" },
      { actor: "TranSafer → 은행", text: "입출금이체 전문 요청" },
      { actor: "은행", text: "입출금 완료" },
    ],
    points: [
      "은행 위탁 기반 전자서명 인증으로 규제 적합성 확보",
      "특허 기반 출금동의·고객확인 인증 대행",
      "가상자산 실명계정 운영지침을 준수하는 인증 체계",
    ],
  },
};

function renderHeading(text) {
  const idx = text.indexOf(",");
  if (idx === -1) return accentNums(text);
  return (
    <>
      {accentNums(text.slice(0, idx + 1))}
      <br />
      {accentNums(text.slice(idx + 1).trim())}
    </>
  );
}

const headingStyle = {
  wordBreak: "keep-all",
  fontWeight: 500,
  fontSize: "clamp(20px,2.1vw,30px)",
  lineHeight: 1.35,
  color: "#000",
};

function DetailItem({ index, title }) {
  return (
    <div
      className="bf-detailsitem"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        minHeight: 60,
        padding: "14px 24px",
        background: "#F4F5FB",
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#2A5BFF" }}>{String(index + 1).padStart(2, "0")}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#2F2F2F" }}>{title}</span>
    </div>
  );
}

function DetailGrid({ items }) {
  return (
    <div
      className="bf-detailsgrid"
      style={{ display: "grid", gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 14 }}
    >
      {items.map((item, i) => (
        <DetailItem key={item} index={i} title={item} />
      ))}
    </div>
  );
}

function ProcessSteps({ steps }) {
  const count = steps.length;
  const [ref, active] = useStepProgress(count);
  return (
    <div
      ref={ref}
      className="bf-flowsteps"
      style={{ display: "grid", gridTemplateColumns: `repeat(${count},1fr)`, columnGap: 16, maxWidth: 1040, margin: "0 auto" }}
    >
      {steps.map((step, i) => {
        const on = i <= active;
        return (
        <div key={step.text} className="bf-flowstep" style={{ minWidth: 0, textAlign: "center" }}>
          <div className="bf-flowdot" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span
              style={{
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: on ? "#1640DB" : "#fff",
                border: "1.5px solid #1640DB",
                color: on ? "#fff" : "#1640DB",
                fontSize: 12,
                fontWeight: 700,
                // 앞 연결선이 다 채워진 뒤 원이 켜지도록 지연
                transition: `background .3s ease ${on && i > 0 ? ".4s" : "0s"}, color .3s ease ${on && i > 0 ? ".4s" : "0s"}`,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < count - 1 && (
              <span
                className="bf-flowline"
                // 원 중심에서 다음 원 중심까지 (칸 폭 + 간격 - 원 지름)
                style={{
                  position: "absolute",
                  left: "calc(50% + 16px)",
                  width: "calc(100% - 16px)",
                  top: "50%",
                  height: 1,
                  background: "#C9D3F5",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#1640DB",
                    transform: `scaleX(${i < active ? 1 : 0})`,
                    "--flow-fill": i < active ? 1 : 0, // 모바일 세로 연결선용 (page.css)
                    transformOrigin: "left",
                    transition: i < active ? "transform .4s linear" : "none",
                  }}
                />
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#7A8299", marginBottom: 6 }}>{step.actor}</div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45, color: "#2F2F2F", padding: "0 4px", wordBreak: "keep-all" }}>
            {step.text}
          </div>
        </div>
        );
      })}
    </div>
  );
}

export default function TransaferDetails() {
  const { process } = API;
  const { isEnglish } = useLanguage();
  const translate = (value) => isEnglish ? (translations[value] ?? value) : value;
  const [inquiryOpen, setInquiryOpen] = useState(false);
  return (
    <section className="bf-pad" style={{ background: "#fff", padding: "110px 40px 130px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 160 }}>
        <div className="bf-reveal">
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "var(--primary)",
              marginBottom: 20,
            }}
          >
            {OVERVIEW.label}
          </div>
          <h2 className="bf-accent" style={{ ...headingStyle, margin: "0 auto", maxWidth: 1200, textAlign: "center" }}>
            {renderHeading(translate(OVERVIEW.heading))}
          </h2>
          <div style={{ marginTop: 40, aspectRatio: "21 / 9", overflow: "hidden", borderRadius: 14, background: "#0A0A0A" }}>
            <video
              src={OVERVIEW.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="bf-reveal" style={{ transitionDelay: "0.3s" }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6.5px 16px",
                borderRadius: 30,
                background: "#1640DB",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {API.tag}
            </span>
            <h2 className="bf-accent" style={{ ...headingStyle, margin: "20px auto 0", maxWidth: 1200 }}>
              {renderHeading(translate(API.heading))}
            </h2>
          </div>

          <div style={{ marginTop: 56 }}>
            <TransaferDiagram />
          </div>
          <div style={{ marginTop: 48 }}>
            <DetailGrid items={API.points.map(translate)} />
          </div>

          <div style={{ marginTop: 160 }}>
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "var(--primary)",
                marginBottom: 20,
              }}
            >
              {translate(process.label)}
            </div>
            <h2 className="bf-accent" style={{ ...headingStyle, margin: "0 auto 48px", maxWidth: 1200, textAlign: "center" }}>
              {renderHeading(translate(process.heading))}
            </h2>
            <ProcessSteps steps={process.steps.map((step) => ({ actor: translate(step.actor), text: translate(step.text) }))} />
          </div>
          <div style={{ marginTop: 48 }}>
            <DetailGrid items={process.points.map(translate)} />
          </div>
        </div>

        <div className="bf-reveal" style={{ display: "flex", justifyContent: "center", transitionDelay: "0.4s" }}>
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              border: "none",
              borderRadius: 4,
              background: "#1640DB",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {translate("도입 상담 문의")} <ArrowRight width={16} height={16} />
          </button>
        </div>
      </div>

      <InquiryModal
        open={inquiryOpen}
        company={PARENT_COMPANY.name}
        email={PARENT_COMPANY.email}
        onClose={() => setInquiryOpen(false)}
      />
    </section>
  );
}
