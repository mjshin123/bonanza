import { useEffect, useId } from "react";
import { useNavTheme } from "../context/NavThemeContext.jsx";

const NAV_HEIGHT = 64;

export default function useNavDarkZone(ref) {
  const { setZoneActive } = useNavTheme();
  const key = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // The nav theme is determined by the strip occupied by the fixed nav,
    // not by whether the dark section is visible anywhere in the viewport.
    // A regular IntersectionObserver viewport intersection keeps a zone active
    // after it has already scrolled below the nav, especially on tall sections.
    const update = () => {
      const rect = node.getBoundingClientRect();
      setZoneActive(key, rect.top <= NAV_HEIGHT && rect.bottom > 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      setZoneActive(key, false);
    };
  }, [ref, key, setZoneActive]);
}
