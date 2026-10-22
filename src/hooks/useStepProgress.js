import { useEffect, useRef, useState } from "react";

const STEP_MS = 900;
const HOLD_MS = 1800;

// 화면에 보이는 동안 01 → 마지막 단계까지 차례로 파랗게 채우고, 잠시 멈춘 뒤 반복
export default function useStepProgress(count) {
  const ref = useRef(null);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setActive(count - 1);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  useEffect(() => {
    if (!visible) return undefined;
    const delay = active >= count - 1 ? HOLD_MS : STEP_MS;
    const timer = setTimeout(() => setActive((a) => (a >= count - 1 ? -1 : a + 1)), delay);
    return () => clearTimeout(timer);
  }, [visible, active, count]);

  return [ref, active];
}
