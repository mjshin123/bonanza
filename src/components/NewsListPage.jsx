import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, Search, Image as ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { accentNums } from "../lib/accentNums.jsx";

const PAGE_SIZE = 10;
const ALL_COMPANIES = "전체 계열사";

function FilterBar({ companies, company, onCompanyChange, query, onQueryChange, searchPlaceholder }) {
  const [open, setOpen] = useState(false);

  function pick(c) {
    onCompanyChange(c);
    setOpen(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", padding: "4px 8px 28px" }}>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 55, background: "transparent" }} />}
      <div style={{ position: "relative", zIndex: 60 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "none", background: "transparent", color: "var(--text-strong)", fontSize: 16, fontWeight: 700, cursor: "pointer", padding: 0 }}
        >
          {company}
          <ChevronDown width={20} height={20} />
        </button>
        {open && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, minWidth: 200, background: "#fff", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-md)", padding: 8, zIndex: 60 }}>
            {companies.map((c) => (
              <button
                key={c}
                onClick={() => pick(c)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: 4,
                  background: c === company ? "var(--blue-50)" : "transparent",
                  color: c === company ? "var(--primary)" : "var(--text-strong)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, maxWidth: 340, flex: "1 1 280px", justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 320, border: "1px solid var(--border)", borderRadius: 8, background: "#fff", padding: "10px 14px" }}>
          <input
            type="text"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(e) => onQueryChange(e.target.value)}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--text-strong)", fontFamily: "inherit", minWidth: 0 }}
          />
          <Search width={18} height={18} color="var(--text-subtle)" style={{ flex: "none" }} />
        </div>
      </div>
    </div>
  );
}

function Pager({ page, totalPages, onPageChange }) {
  const nums = [];
  for (let p = 1; p <= totalPages; p++) {
    const active = p === page;
    nums.push(
      <button
        key={p}
        onClick={() => onPageChange(p)}
        style={{ position: "relative", minWidth: 30, height: 40, border: "none", background: "transparent", color: active ? "var(--primary)" : "var(--text-muted)", fontSize: 14, fontWeight: active ? 700 : 500, cursor: "pointer" }}
      >
        {p}
        {active && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 22, height: 2, background: "var(--primary)" }} />}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "34px 4px 8px" }}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "none", background: "transparent", color: page <= 1 ? "var(--grey-300)" : "var(--text-strong)", fontSize: 14, fontWeight: 500, cursor: page <= 1 ? "default" : "pointer", padding: 0 }}
      >
        <ArrowLeft width={18} height={18} /> Previous
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>{nums}</div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "none", background: "transparent", color: page >= totalPages ? "var(--grey-300)" : "var(--text-strong)", fontSize: 14, fontWeight: 500, cursor: page >= totalPages ? "default" : "pointer", padding: 0 }}
      >
        Next <ArrowRight width={18} height={18} />
      </button>
    </div>
  );
}

export default function NewsListPage({ breadcrumbLabel, heading, searchPlaceholder, items, getItemPath }) {
  const [company, setCompany] = useState(ALL_COMPANIES);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const companies = useMemo(() => [ALL_COMPANIES, ...new Set(items.map((n) => n.category))], [items]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      const okCompany = company === ALL_COMPANIES || n.category === company;
      const okQuery = !q || (n.title + n.excerpt).toLowerCase().includes(q);
      return okCompany && okQuery;
    });
  }, [items, company, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateCompany(c) {
    setCompany(c);
    setPage(1);
  }

  function updateQuery(q) {
    setQuery(q);
    setPage(1);
  }

  return (
    <div style={{ position: "relative", paddingTop: 64 }}>
      <header className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "88px 48px 24px" }}>
        <div className="bf-reveal" style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-subtle)", fontSize: 13, fontWeight: 600, marginBottom: 26 }}>
          <Link to="/" style={{ color: "var(--text-subtle)" }}>홈</Link>
          <ChevronRight width={15} height={15} />
          <span style={{ color: "var(--text-strong)" }}>{breadcrumbLabel}</span>
        </div>
        <h1 className="bf-accent bf-reveal" style={{ margin: 0, fontWeight: 500, fontSize: "clamp(26px,3.4vw,42px)", lineHeight: 1.3, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
          {accentNums(heading)}
        </h1>
      </header>

      <main className="bf-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 48px 40px" }}>
        <FilterBar companies={companies} company={company} onCompanyChange={updateCompany} query={query} onQueryChange={updateQuery} searchPlaceholder={searchPlaceholder} />

        {pageItems.map((item) => {
          const href = getItemPath?.(item);
          const RowTag = href ? Link : "a";
          const rowLinkProps = href ? { to: href } : { href: "#", onClick: (e) => e.preventDefault() };

          return (
            <RowTag key={item.title} className="bf-newsrow" {...rowLinkProps}>
              <div className="bf-newsdate" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-subtle)", letterSpacing: "0.01em", alignSelf: "start", paddingTop: 4 }}>
                {item.date}
              </div>
              <div style={{ minWidth: 0, alignSelf: "start" }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", color: "var(--primary)", marginBottom: 12 }}>{item.category}</div>
                <h2 className="bf-newsttl" style={{ margin: 0, fontWeight: 700, fontSize: "clamp(18px,1.8vw,22px)", lineHeight: 1.35, letterSpacing: "-0.01em", color: "var(--text-strong)", transition: "color .18s ease" }}>
                  {item.title}
                </h2>
                <p style={{ margin: "14px 0 0", maxWidth: "none", fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", fontWeight: 500 }}>{item.excerpt}</p>
              </div>
              {item.hasImage && (
                <div className="bf-newsthumb">
                  <ImageIcon width={30} height={30} />
                </div>
              )}
              <span className="bf-newsarrow">
                <ArrowRight width={22} height={22} />
              </span>
            </RowTag>
          );
        })}

        <div style={{ borderTop: "1px solid #d9dbe0" }} />
        <Pager page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}
