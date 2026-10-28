import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const englishSuffixes = {
  "조": " Trillion",
  "만": "M",
  "억+": "M+",
  "분": " min",
  "건": " requests",
};

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function format(v, decimals) {
  return v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function StatCounter({ target, decimals = 0, suffix = "" }) {
  const { isEnglish } = useLanguage();
  const ref = useRef(null);
  const displaySuffix = isEnglish ? (englishSuffixes[suffix] ?? suffix) : suffix;
  const [value, setValue] = useState(format(target, decimals) + displaySuffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function animate() {
      const dur = 1400;
      const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / dur);
        const v = target * easeOut(p);
        setValue(format(v, decimals) + displaySuffix);
        if (p < 1) requestAnimationFrame(step);
        else setValue(format(target, decimals) + displaySuffix);
      }
      requestAnimationFrame(step);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animate();
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals, displaySuffix]);

  return (
    <span ref={ref} style={{ whiteSpace: "nowrap" }}>
      {value}
    </span>
  );
}
