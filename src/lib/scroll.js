export const NAV_HEIGHT = 64;

export function scrollToAnchor(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top: y, behavior: "smooth" });
}
