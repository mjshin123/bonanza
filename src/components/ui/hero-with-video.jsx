import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* Adapted from 21st.dev "cta-with-marquee" (HeroWithVideo demo) for this Vite + JS project:
   no next/image, no "use client", copy/assets passed in as props.
   Left: headline + lines + scramble button. Right: looping muted video, both inside the 1400px content area.
   The button opens `onPlay` (e.g. a modal with the full intro video). */

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789가나다라마바사아자차카타파하";

export function ScrambleButton({ label, onClick, className }) {
  const [text, setText] = useState(label);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);
  useEffect(() => setText(label), [label]);

  const scramble = () => {
    if (timer.current) return;
    let iteration = 0;
    timer.current = setInterval(() => {
      setText(
        label
          .split("")
          .map((ch, i) => (ch === " " || i < iteration ? ch : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0]))
          .join(""),
      );
      if (iteration >= label.length) {
        clearInterval(timer.current);
        timer.current = null;
        setText(label);
      }
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <button
      type="button"
      onMouseEnter={scramble}
      onFocus={scramble}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-[4px] bg-[var(--primary)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1233b0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
    >
      <Play className="size-4 fill-current" aria-hidden="true" />
      {/* fixed width per character so the scramble doesn't make the button jitter */}
      <span className="tabular-nums" aria-label={label}>
        {text}
      </span>
    </button>
  );
}

/* Muted autoplay video. `src` may be a list: the clips play one after another and the list loops.
   `crop` = { width, height, top, bottom } in source pixels trims letterbox bars (and anything in
   them, e.g. a logo): the box takes the visible part's aspect ratio and the video is scaled/shifted
   so only that band shows. */
function PlaylistVideo({ src, poster, className, crop }) {
  const list = Array.isArray(src) ? src : [src];
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const current = list[index % list.length];

  // on a clip change, start the next one right away (autoPlay only covers the first load)
  useEffect(() => {
    if (index === 0) return;
    ref.current?.play().catch(() => {});
  }, [index]);

  const video = (
    <video
      ref={ref}
      key={list.length > 1 ? undefined : current}
      src={current}
      poster={poster}
      autoPlay
      muted
      playsInline
      loop={list.length === 1}
      onEnded={() => setIndex((i) => (i + 1) % list.length)}
      className={crop ? undefined : className}
      style={
        crop
          ? {
              position: "absolute",
              left: 0,
              width: "100%",
              height: `${(crop.height / (crop.height - crop.top - crop.bottom)) * 100}%`,
              top: `${(-crop.top / (crop.height - crop.top - crop.bottom)) * 100}%`,
              objectFit: "cover",
            }
          : undefined
      }
    />
  );
  if (!crop) return video;
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", aspectRatio: `${crop.width} / ${crop.height - crop.top - crop.bottom}` }}>
      {video}
    </div>
  );
}

/* Scroll-pinned, scroll-scrubbed entrance — no scroll hijacking.
   The section is `position: sticky` inside a wrapper that is `pinVh` taller than the viewport, so it
   holds still while the user scrolls through that extra distance. Over the first `revealEnd` of it
   the [data-seq] items (title → lines → button → video) fade/slide in *in step with the scroll*;
   the rest of the distance they simply stay put. The section therefore can't move on before
   everything is shown, and scrolling back up plays it in reverse (so it replays every pass). */
const SEQ_STAGGER = 0.2; // item i starts at i × stagger of the reveal
const SEQ_SPAN = 0.4; // each item takes this share of the reveal
const easeOut = (t) => 1 - (1 - t) ** 3;

function useScrubbedReveal(wrapRef, sectionRef, revealEnd) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const section = sectionRef.current;
    if (!wrap || !section) return undefined;
    const items = [...section.querySelectorAll("[data-seq]")];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const dist = Math.max(1, wrap.offsetHeight - window.innerHeight);
      const prog = Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / dist)); // 0 = just pinned
      const r = reduce ? 1 : Math.min(1, prog / revealEnd);
      items.forEach((item, i) => {
        const t = easeOut(Math.min(1, Math.max(0, (r - i * SEQ_STAGGER) / SEQ_SPAN)));
        const isVideo = item.dataset.seq === "4";
        item.style.opacity = String(t);
        item.style.transform = `translateY(${(1 - t) * 28}px)${isVideo ? ` scale(${0.97 + 0.03 * t})` : ""}`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [wrapRef, sectionRef, revealEnd]);
}

/* Fixed "SCROLL" cue at the bottom centre. Stays on screen from the top of the page for as long as
   this section is still pinned, and fades out as the pin releases and the next section comes in. */
function ScrollHint({ wrapRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const hint = ref.current;
    if (!wrap || !hint) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // wrapper bottom reaching the viewport bottom = pin released; fade over the last 15vh before that
      const left = wrap.getBoundingClientRect().bottom - vh;
      const o = Math.min(1, Math.max(0, left / (vh * 0.15)));
      hint.style.opacity = String(o);
      hint.style.visibility = o <= 0 ? "hidden" : "visible";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [wrapRef]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[6] flex flex-col items-center gap-2 text-[11px] tracking-[0.3em] text-white/50"
    >
      <span>SCROLL</span>
      <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
    </div>
  );
}

export function HeroWithVideo({
  title,
  lines = [],
  buttonLabel,
  onPlay,
  videoSrc,
  videoCrop,
  poster,
  className,
  sectionRef,
  pinVh = 120, // extra scroll distance the section stays pinned for
  revealEnd = 0.75, // share of that distance over which the items appear
  scrollHint = false, // fixed bottom-centre "SCROLL" cue, shown until this section's pin releases
}) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const setRefs = (el) => {
    innerRef.current = el;
    if (typeof sectionRef === "function") sectionRef(el);
    else if (sectionRef) sectionRef.current = el;
  };
  useScrubbedReveal(wrapRef, innerRef, revealEnd);
  return (
    <div ref={wrapRef} className="relative bg-[#0A0A0A]" style={{ height: `calc(100vh + ${pinVh}vh)` }}>
    {scrollHint && <ScrollHint wrapRef={wrapRef} />}
    <section
      ref={setRefs}
      className={cn("bf-seq sticky top-0 flex h-screen items-center overflow-hidden bg-[#0A0A0A] px-6 py-24 text-white md:px-10", className)}
    >
      {/* everything sits inside the site's content area (1400px), like the other sections */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 lg:flex-row lg:gap-16">
        {/* left copy */}
        <div className="w-full space-y-7 lg:w-[40%] lg:flex-shrink-0">
          <h2 data-seq="1" className="bf-accent text-[clamp(28px,2.8vw,40px)] leading-[1.3] tracking-[-0.02em] break-keep">{title}</h2>
          <div data-seq="2" className="space-y-1.5 text-[clamp(15px,1.1vw,17px)] leading-relaxed text-white/60 break-keep">
            {lines.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>
          <div data-seq="3">
            <ScrambleButton label={buttonLabel} onClick={onPlay} />
          </div>
        </div>

        {/* right video: the rest of the content width, at the video's own aspect ratio */}
        <div data-seq="4" className="relative w-full flex-1 overflow-hidden rounded-[6px]">
          <PlaylistVideo src={videoSrc} crop={videoCrop} poster={poster} className="block h-auto w-full" />
        </div>
      </div>
    </section>
    </div>
  );
}

/* Full-screen player for the intro video (sound on, native controls). Esc / backdrop closes. */
export function VideoModal({ open, onClose, src, title }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-[4px] bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      {/* whole 16:9 frame, as large as the viewport allows (width- or height-bound), never cropped */}
      <video
        src={src}
        autoPlay
        controls
        playsInline
        className="block aspect-video bg-black object-contain"
        style={{ width: "min(94vw, calc((100dvh - 112px) * 16 / 9))" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
