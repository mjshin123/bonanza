import { useEffect, useId } from "react";
import { useNavTheme } from "../context/NavThemeContext.jsx";

const NAV_HEIGHT = 64;

export default function useNavDarkZone(ref) {
  const { setZoneActive } = useNavTheme();
  const key = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => setZoneActive(key, entry.isIntersecting), {
      rootMargin: `-${NAV_HEIGHT}px 0px -99% 0px`,
      threshold: 0,
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      setZoneActive(key, false);
    };
  }, [ref, key, setZoneActive]);
}
