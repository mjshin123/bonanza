import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import PrivacyPolicyModal from "./PrivacyPolicyModal.jsx";
import eurocertLogo from "../../EUROCERT 컬러 1.svg";

const menuGroups = [
  {
    label: "기업 개요",
    items: [
      { label: "회사 소개", href: "/about" },
      { label: "보난자 그룹", href: "/group" },
      { label: "연혁", href: "/history" },
    ],
  },
  {
    label: "솔루션",
    items: [
      { label: "TranSight", href: "/transight" },
      { label: "TranSafer", href: "/transafer" },
      { label: "Compliance Suite", href: "/compliance-suite" },
    ],
  },
  {
    label: "뉴스룸",
    items: [
      { label: "보도자료", href: "/press" },
      { label: "공지사항", href: "/notice" },
    ],
  },
];

export default function Footer() {
  const darkZoneRef = useRef(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  useNavDarkZone(darkZoneRef);

  return (
    <footer ref={darkZoneRef} className="bf-pad" style={{ background: "#0A0A0A", color: "#c5cef3", padding: "72px 40px 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="bf-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr 0.8fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
              <img
                src="/images/logo/bonanza-factory-logo-white.png"
                alt="Bonanza Factory"
                style={{ height: 22, width: "auto", display: "block" }}
              />
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#9a9a9a", maxWidth: 340 }}>
              신뢰할 수 있는 디지털자산의 기반을 만듭니다.
              <br />
              가상자산 컴플라이언스 전문 기업, 보난자팩토리.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24, color: "#9a9a9a" }}>
              <img
                src={eurocertLogo}
                alt="유로서트 EUROCERT"
                width={40}
                height={36}
                style={{ display: "block", flexShrink: 0, objectFit: "contain", filter: "grayscale(1)" }}
              />
              <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>
                <div>품질·환경경영 국제표준</div>
                <div>ISO 9001, ISO 14001</div>
              </div>
            </div>
          </div>
          {menuGroups.map((group) => (
            <div key={group.label}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 16 }}>{group.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {group.items.map((item) => (
                  <Link key={item.href} to={item.href} style={{ fontSize: 13, color: "#9a9a9a" }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 16 }}>문의</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#9a9a9a" }}>
              <span>서울특별시 영등포구 양평로 12, 정오빌딩 7층</span>
              <span>사업자등록번호: 818-88-00715</span>
              <span>대표이사: 김영석 ㅣ 개인정보책임자: 이찬행</span>
              <span>contact@bonanza-factory.co.kr</span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: "#9a9a9a" }}>© Bonanza Factory. All rights reserved.</span>
          <button
            type="button"
            onClick={() => setPolicyOpen(true)}
            style={{ padding: 0, fontSize: 13, fontWeight: 600, color: "#d4d4d4", background: "none", border: "none", cursor: "pointer" }}
          >
            개인정보처리방침
          </button>
        </div>
      </div>
      <PrivacyPolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </footer>
  );
}
