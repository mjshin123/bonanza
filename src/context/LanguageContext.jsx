import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";
import sharedTranslations from "../data/translations/shared.js";
import homeTranslations from "../data/translations/home.js";
import groupTranslations from "../data/translations/group.js";
import aboutTranslations from "../data/translations/about.js";
import historyTranslations from "../data/translations/history.js";
import transightTranslations from "../data/translations/transight.js";
import complianceTranslations from "../data/translations/compliance.js";
import pressTranslations from "../data/translations/press.js";
import noticeTranslations from "../data/translations/notice.js";

const LanguageContext = createContext(null);
const originalTextNodes = new WeakMap();
const originalDocumentTitle = "보난자팩토리 | Bonanza Factory";

const sourceTranslations = {
  ...sharedTranslations,
  ...homeTranslations,
  ...groupTranslations,
  ...aboutTranslations,
  ...historyTranslations,
  ...transightTranslations,
  ...complianceTranslations,
  ...pressTranslations,
  ...noticeTranslations,
  홈: "Home",
};

const normalize = (value) => value.replace(/\s+/g, " ").trim();
const translations = new Map(
  Object.entries(sourceTranslations).map(([source, english]) => [normalize(source), english.trim()]),
);

function translateTextNode(node, lang) {
  const current = node.nodeValue;
  let original = originalTextNodes.get(node) ?? current;

  // 영어 상태에서 조건부 렌더링된 노드는 영어가 최초 원문으로 저장될 수 있다.
  // KOR 전환으로 React가 한국어를 다시 넣었으면 그 값을 새 원문으로 채택한다.
  if (lang === "ko" && current !== original && /[가-힣]/.test(current)) {
    original = current;
    originalTextNodes.set(node, original);
    return;
  }

  // React가 라우트 전환 중 같은 DOM 노드를 다른 한국어 문구로 재사용하면
  // 새 원문으로 갱신한 뒤 번역한다.
  const previousTranslation = translations.get(normalize(original));
  if (lang === "en" && current !== original && current.trim() !== previousTranslation) {
    original = current;
  }
  originalTextNodes.set(node, original);

  if (lang === "ko") {
    if (current !== original) node.nodeValue = original;
    return;
  }

  const translated = translations.get(normalize(original));
  if (!translated) return;

  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  const next = `${leading}${translated}${trailing}`;
  if (current !== next) node.nodeValue = next;
}

function translateAttributes(element, lang) {
  if (!(element instanceof Element)) return;
  ["placeholder", "aria-label", "title", "alt"].forEach((name) => {
    const current = element.getAttribute(name);
    if (!current) return;
    const storageName = `data-bf-ko-${name}`;
    const original = element.getAttribute(storageName) ?? current;
    if (!element.hasAttribute(storageName)) element.setAttribute(storageName, original);
    const translated = translations.get(normalize(original));
    element.setAttribute(name, lang === "en" && translated ? translated : original);
  });
}

function useDomTranslations(lang) {
  useLayoutEffect(() => {
    if (typeof document === "undefined") return undefined;

    const apply = (root = document.body) => {
      if (!root) return;
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root, lang);
        return;
      }
      translateAttributes(root, lang);
      root.querySelectorAll?.("[placeholder], [aria-label], [title]").forEach((element) => {
        translateAttributes(element, lang);
      });
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) translateTextNode(node, lang);
    };

    apply();
    document.documentElement.lang = lang;
    document.title = lang === "en"
      ? "Bonanza Factory | Digital Asset Compliance"
      : originalDocumentTitle;

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "characterData") apply(record.target);
        record.addedNodes.forEach(apply);
      });
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [lang]);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("bf-lang") === "en" ? "en" : "ko";
    } catch {
      return "ko";
    }
  });

  function pickLang(next) {
    setLang(next);
    try {
      localStorage.setItem("bf-lang", next);
    } catch {
      // Storage can be blocked; the current session still changes language.
    }
  }

  useDomTranslations(lang);
  const value = useMemo(() => ({ lang, pickLang, isEnglish: lang === "en" }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
