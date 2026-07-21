import { useRef } from "react";
import { Link } from "react-router-dom";
import useNavDarkZone from "../hooks/useNavDarkZone.js";

const menuGroups = [
  {
    label: "기업 개요",
    items: [
      { label: "회사 소개", href: "/회사소개" },
      { label: "연혁", href: "/연혁" },
      { label: "보난자 그룹", href: "/계열사-소개" },
    ],
  },
  {
    label: "솔루션",
    items: [
      { label: "TranSight", href: "/TranSight" },
      { label: "TranSafer", href: "/TranSafer" },
    ],
  },
  {
    label: "뉴스룸",
    items: [
      { label: "보도자료", href: "/보도자료" },
      { label: "공지사항", href: "/공지사항" },
    ],
  },
];

export default function Footer() {
  const darkZoneRef = useRef(null);
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
          <span style={{ fontSize: 12, color: "#9a9a9a" }}>개인정보처리방침 · 이용약관</span>
        </div>
      </div>
    </footer>
  );
}
