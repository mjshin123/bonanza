import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, getSeo } from "../data/seo.js";

function setMeta(selector, content) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute("content", content);
}

// 경로가 바뀔 때마다 문서 제목·설명·공유용 메타·canonical을 해당 페이지 값으로 맞춤
export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = getSeo(pathname);
    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  }, [pathname]);

  return null;
}
