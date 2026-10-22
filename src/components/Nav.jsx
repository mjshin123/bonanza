import { useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import useNavScroll from "../hooks/useNavScroll.js";
import { scrollToAnchor } from "../lib/scroll.js";
import { useNavTheme } from "../context/NavThemeContext.jsx";
import InquiryModal from "./InquiryModal.jsx";
import { accentNums } from "../lib/accentNums.jsx";

const PARENT_COMPANY = { name: "보난자팩토리", email: "contact@bonanza-factory.co.kr" };

const megaGroups = [
  {
    key: "about",
    label: "기업 개요",
    href: "#about",
    heading: (
      <>
        신뢰를 쌓아온<br />보난자팩토리를 소개합니다
      </>
    ),
    items: [
      { label: "회사 소개", href: "/about", route: true },
      { label: "보난자 그룹", href: "/group", route: true },
      { label: "연혁", href: "/history", route: true },
    ],
    image: "/images/nav/menu-1.jpg",
  },
  {
    key: "solutions",
    label: "솔루션",
    href: "#solutions",
    heading: (
      <>
        가상자산 컴플라이언스를<br />완성하는 솔루션
      </>
    ),
    items: [
      { label: "TranSight", href: "/transight", route: true },
      { label: "TranSafer", href: "/transafer", route: true },
      { label: "Compliance Infra", href: "/compliance-infra", route: true },
    ],
    image: "/images/nav/menu-3.png",
  },
  {
    key: "news",
    label: "뉴스룸",
    href: "#news",
    heading: (
      <>
        보난자팩토리의<br />새로운 소식
      </>
    ),
    items: [
      { label: "보도자료", href: "/press", route: true },
      { label: "공지사항", href: "/notice", route: true },
    ],
    image: "/images/nav/menu-4.png",
  },
];

function MegaAnchor({ href, anchor, route, onNavigate, onClose, children, className, style }) {
  if (route) {
    return (
      <Link to={href} className={className} style={style} onClick={onClose}>
        {children}
      </Link>
    );
  }
  if (!anchor) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href.slice(1));
      }}
    >
      {children}
    </a>
  );
}

const MEGA_CLOSE_DELAY = 300;

export default function Nav() {
  const scrolled = useNavScroll();
  const { dark } = useNavTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  // KOR / ENG switch — UI only for now (no English content yet); remembered per browser
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("bf-lang") === "en" ? "en" : "ko";
    } catch {
      return "ko";
    }
  });
  function pickLang(next) {
    setLang(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem("bf-lang", next);
    } catch {
      /* storage blocked: keep the in-memory choice */
    }
  }
  const closeTimerRef = useRef(null);
  const location = useLocation();
  const routerNavigate = useNavigate();

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openMega(key) {
    clearCloseTimer();
    setOpenGroup(key);
  }

  function scheduleMegaClose() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenGroup(null);
      closeTimerRef.current = null;
    }, MEGA_CLOSE_DELAY);
  }

  function closeAll() {
    clearCloseTimer();
    setMobileOpen(false);
    setOpenGroup(null);
  }

  function navigate(id) {
    if (location.pathname === "/") {
      scrollToAnchor(id);
    } else {
      routerNavigate("/", { state: { scrollTo: id } });
    }
    closeAll();
  }

  return (
    <nav
      id="bf-nav"
      data-theme={dark ? "dark" : "light"}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        background: dark ? "#0A0A0A" : "#fff",
        borderBottom: "1px solid transparent",
        transition: "background .25s ease, border-color .25s ease",
        borderBottomColor: dark ? "rgba(255,255,255,.1)" : scrolled ? "var(--border)" : "transparent",
      }}
    >
      <div
        className="bf-pad"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={dark ? "/images/logo/bonanza-factory-logo-white.png" : "/images/logo/bonanza-factory-logo.png"}
            alt="Bonanza Factory"
            style={{ height: 22, width: "auto", display: "block" }}
          />
        </a>

        <div
          className="bf-desktopnav"
          style={{ display: "flex", alignItems: "center", gap: 80 }}
          onMouseLeave={scheduleMegaClose}
        >
          {megaGroups.map((group) => {
            const firstItem = group.items[0];
            return (
            <div
              className="bf-navgroup"
              key={group.key}
              onMouseEnter={() => openMega(group.key)}
            >
              <MegaAnchor
                href={firstItem.href}
                anchor={firstItem.anchor}
                route={firstItem.route}
                onNavigate={navigate}
                onClose={closeAll}
                style={{ fontWeight: 500, fontSize: 15, color: dark ? "#fff" : "var(--primary)", transition: "color .25s ease" }}
              >
                {group.label}
              </MegaAnchor>
              <div className="bf-mega" data-open={openGroup === group.key ? "1" : "0"}>
                <div
                  className="bf-pad"
                  style={{
                    maxWidth: 1400,
                    margin: "0 auto",
                    padding: "56px 48px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 48,
                  }}
                >
                  <h3 className="bf-accent"
                    style={{
                      margin: 0,
                      flex: 1,
                      maxWidth: 520,
                      fontWeight: 800,
                      fontSize: 21,
                      lineHeight: 1.45,
                      letterSpacing: "-0.02em",
                      color: dark ? "#fff" : "var(--text-strong)",
                      transition: "color .25s ease",
                    }}
                  >
                    {accentNums(group.heading)}
                  </h3>
                  <div style={{ flex: "none", width: 280 }}>
                    {group.items.map((item) => (
                      <MegaAnchor
                        key={item.label}
                        href={item.href}
                        anchor={item.anchor}
                        route={item.route}
                        onNavigate={navigate}
                        onClose={closeAll}
                        className="bf-megaitem"
                      >
                        {item.label}
                      </MegaAnchor>
                    ))}
                  </div>
                  <div
                    style={{
                      flex: "none",
                      width: 230,
                      height: 140,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={group.image}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="bf-navcta" role="group" aria-label="언어 선택" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 6, fontSize: 13, fontWeight: 600 }}>
            {[
              ["ko", "KOR"],
              ["en", "ENG"],
            ].map(([code, label], i) => (
              <span key={code} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {i > 0 && (
                  <span aria-hidden="true" style={{ color: dark ? "rgba(255,255,255,.3)" : "var(--border)", transition: "color .25s ease" }}>
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => pickLang(code)}
                  aria-pressed={lang === code}
                  style={{
                    padding: "4px 2px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    color:
                      lang === code
                        ? dark
                          ? "#fff"
                          : "var(--text-strong)"
                        : dark
                          ? "rgba(255,255,255,.45)"
                          : "var(--text-muted)",
                    transition: "color .25s ease",
                  }}
                >
                  {label}
                </button>
              </span>
            ))}
          </div>
          <a
            href="#about"
            className="bf-ghostlink bf-navcta"
            onClick={(e) => {
              e.preventDefault();
              closeAll();
              setInquiryOpen(true);
            }}
            // outline style like the home "연혁 보기" link: colour only on the border and text
            // (#5E8EFF on the dark nav; the stronger primary blue on white, where #5E8EFF reads too faint)
            style={{
              display: "inline-flex",
              whiteSpace: "nowrap",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 16px",
              background: "transparent",
              border: `1px solid ${dark ? "#5E8EFF" : "var(--primary)"}`,
              borderRadius: 4,
              color: dark ? "#5E8EFF" : "var(--primary)",
              fontWeight: 600,
              fontSize: 13,
              transition: "background .2s ease, color .25s ease, border-color .25s ease",
            }}
          >
            사업 문의
          </a>

          <button
            id="bf-burger"
            className="bf-burger"
            aria-label="menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              border: "none",
              background: "transparent",
              color: dark ? "#fff" : "var(--primary)",
              cursor: "pointer",
              transition: "color .25s ease",
            }}
          >
            <Menu width={26} height={26} />
          </button>
        </div>
      </div>

      <div
        id="bf-mobile"
        data-open={mobileOpen ? "1" : "0"}
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          background: dark ? "#0A0A0A" : "#fff",
          borderBottom: dark ? "1px solid rgba(255,255,255,.12)" : "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? "none" : "translateY(-8px)",
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity .2s ease, transform .2s ease, background .25s ease, border-color .25s ease",
          padding: "16px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {megaGroups.map((group) => {
          const firstItem = group.items[0];
          return (
          <div key={group.key}>
            <MegaAnchor
              href={firstItem.href}
              anchor={firstItem.anchor}
              route={firstItem.route}
              onNavigate={navigate}
              onClose={closeAll}
              style={{ display: "block", fontWeight: 600, fontSize: 15, color: dark ? "#fff" : "var(--primary)", marginBottom: 6, transition: "color .25s ease" }}
            >
              {group.label}
            </MegaAnchor>
            {group.items.map((item) => (
              <MegaAnchor
                key={item.label}
                href={item.href}
                anchor={item.anchor}
                route={item.route}
                onNavigate={navigate}
                onClose={closeAll}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  color: dark ? "rgba(255,255,255,.65)" : "var(--text-muted)",
                  fontWeight: 500,
                  fontSize: 14,
                  transition: "color .25s ease",
                }}
              >
                {item.label}
              </MegaAnchor>
            ))}
          </div>
          );
        })}

        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            closeAll();
            setInquiryOpen(true);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
            padding: "12px 16px",
            background: "var(--primary)",
            borderRadius: 4,
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          사업 문의
        </a>
      </div>

      <InquiryModal
        open={inquiryOpen}
        company={PARENT_COMPANY.name}
        email={PARENT_COMPANY.email}
        onClose={() => setInquiryOpen(false)}
      />
    </nav>
  );
}
