import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SELECTOR = ".bf-reveal, .bf-revealF";

export default function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("bf-in", entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );

    document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);
}
