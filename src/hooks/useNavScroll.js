import { useEffect, useState } from "react";

export default function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function applyNav() {
      setScrolled(window.scrollY > 20);
    }
    applyNav();
    window.addEventListener("scroll", applyNav, { passive: true });
    return () => window.removeEventListener("scroll", applyNav);
  }, []);

  return scrolled;
}
