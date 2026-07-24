import { useEffect, useState } from "react";
import { subsidiaries } from "../data/subsidiaries.js";

const MOBILE_QUERY = "(max-width:860px)";
const MOBILE_COLLAPSED_HEIGHT = 120;
const MOBILE_EXPANDED_HEIGHT = 420;

function renderDesc(desc) {
  const sentences = desc.split(/(?<=\.)\s+/);
  return sentences.map((sentence, idx) => (
    <span key={idx}>
      {sentence}
      {idx < sentences.length - 1 && <br />}
    </span>
  ));
}

export default function Group() {
  // Which card is "open": tapping sets this, and it's what's shown whenever no
  // card is actively under the mouse.
  const [openIndex, setOpenIndex] = useState(0);
  // Tracked in JS instead of relying on native :hover — the flex `gap` between
  // cards is dead space that isn't part of any card's hover box, so a real CSS
  // :hover swap between adjacent cards briefly matches "nothing hovered" while
  // crossing it, causing both cards to flicker to a half-transitioned size.
  // onMouseEnter per card + onMouseLeave on the row only changes state on an
  // actual card boundary, never on that in-between gap.
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const anyHovered = hoveredIndex !== null;
  // Below the breakpoint, cards stack in a column and the open one grows
  // TALLER; above it, cards sit in a row and the open one grows WIDER.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="group" className="bf-pad" style={{ background: "var(--surface-subtle)", padding: "110px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="bf-reveal" style={{ maxWidth: 640, marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 14 }}>
            GROUP SYNERGY
          </div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(26px,3.2vw,36px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
            보난자 그룹의 모회사로서
            <br />
            자회사들과 시너지를 이끌어갑니다.
          </h2>
        </div>

        <div className="bf-accrow bf-reveal" onMouseLeave={() => setHoveredIndex(null)}>
          {subsidiaries.map((sub, i) => {
            // While the mouse is over the row, hover alone decides — overriding
            // whichever card was previously tapped open, on every card at once.
            // Only when nothing is hovered does the tapped/open card show.
            // (Mixing "hover controls size" with "openIndex controls the text"
            // was the earlier bug: a hover-shrunk card could still show its full
            // — but now much too narrow — description because tap state said it
            // was "open".)
            const isExpanded = anyHovered ? hoveredIndex === i : i === openIndex;

            return (
              <div
                key={sub.key}
                className="bf-acc"
                style={
                  isMobile
                    ? { color: sub.color, border: sub.border, flex: "none", height: isExpanded ? MOBILE_EXPANDED_HEIGHT : MOBILE_COLLAPSED_HEIGHT }
                    : { color: sub.color, border: sub.border, flex: isExpanded ? "3.4 1 0" : "0.45 1 0" }
                }
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => setOpenIndex(i)}
              >
                <div
                  className="bf-acc-media"
                  style={{ backgroundImage: `url(${sub.image})`, height: isMobile || isExpanded ? "100%" : "70%" }}
                />
                <div
                  className="bf-acc-fade"
                  style={{
                    height: isMobile || isExpanded ? "100%" : "70%",
                    background: "linear-gradient(to bottom,rgba(20,20,20,0) 0%,#141414 100%)",
                  }}
                />
                <div
                  className="bf-acc-collapsed"
                  style={{
                    position: "absolute",
                    bottom: 30,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    opacity: isExpanded ? 0 : 1,
                    // Hide instantly (no fade) the moment this card expands, fade
                    // back in only after a delay when it collapses — guarantees
                    // this label and the expanded one below are never both visible.
                    transition: isExpanded ? "none" : "opacity .25s ease .25s",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 26,
                      letterSpacing: "0.02em",
                      writingMode: !isMobile && !isExpanded ? "vertical-rl" : "horizontal-tb",
                    }}
                  >
                    {sub.name}
                  </span>
                </div>
                <div
                  className="bf-acc-expanded"
                  style={{
                    position: "absolute",
                    left: 28,
                    right: 28,
                    bottom: 30,
                    opacity: isExpanded ? 1 : 0,
                    // Fade in only after a delay when expanding, but hide instantly
                    // (no fade) the moment it collapses — so this never lingers
                    // visible on a card that's already shrinking/shortening away.
                    transition: isExpanded ? "opacity .25s ease .25s" : "none",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 28, whiteSpace: "nowrap", marginBottom: 10 }}>{sub.name}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: sub.descColor, maxWidth: 760 }}>{renderDesc(sub.desc)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
