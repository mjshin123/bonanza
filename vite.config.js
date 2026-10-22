import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { SITE_URL, getSeo, getPrerenderPaths } from "./src/data/seo.js";

const escapeAttr = (v) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// 빌드된 index.html의 제목·설명·공유 메타를 경로별 값으로 바꾼 HTML
export function renderSeoHtml(html, pagePath) {
  const { title, description } = getSeo(pagePath);
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const url = escapeAttr(`${SITE_URL}${pagePath}`);
  const setContent = (src, attr, value) =>
    src.replace(new RegExp(`(<meta ${attr} content=")[^"]*(")`), `$1${value}$2`);
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  out = setContent(out, 'name="description"', d);
  out = setContent(out, 'property="og:title"', t);
  out = setContent(out, 'property="og:description"', d);
  out = setContent(out, 'property="og:url"', url);
  out = setContent(out, 'name="twitter:title"', t);
  out = setContent(out, 'name="twitter:description"', d);
  return out;
}

// JS를 실행하지 않는 링크 미리보기·검색 수집기도 페이지별 메타를 읽도록 경로마다 HTML을 만든다
// (vercel.json의 cleanUrls로 /transight → transight.html 이 제공됨)
function seoPages() {
  return {
    name: "seo-pages",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const indexPath = path.join(dist, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, "utf8");
      for (const pagePath of getPrerenderPaths()) {
        const file = path.join(dist, `${pagePath.slice(1)}.html`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, renderSeoHtml(html, pagePath));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPages()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
