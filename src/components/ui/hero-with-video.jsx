import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Adapted from 21st.dev "cta-with-marquee" (HeroWithVideo demo) for this Vite + JS project:
   no next/image, no "use client", copy/assets passed in as props.
   Left: headline + lines + play button. Right: looping muted video, both inside the 1400px content area.
   The button opens `onPlay` (e.g. a modal with the full intro video). */

export function PlayButton({ label, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-[4px] bg-[var(--primary)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1233b0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
    >
      <Play className="size-4 fill-current" aria-hidden="true" />
      <span>{label}</span>
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

/* Scroll-pinned, time-based entrance.
   The section is `position: sticky` inside a wrapper that is `pinVh` taller than the viewport, so it
   holds still for that extra scroll distance. Once the section is mostly on screen, the [data-seq]
   items (title → lines → video → button) fade/slide in one after another on a timer — no further
   scrolling needed. They play once and stay shown. */
const SEQ_STAGGER = 0.3; // s between items
const SEQ_DURATION = 0.9; // s per item
const TRIGGER = 0.4; // play when the section's top is within this share of the viewport height

function useTimedReveal(wrapRef, sectionRef) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const section = sectionRef.current;
    if (!wrap || !section) return undefined;
    const items = [...section.querySelectorAll("[data-seq]")];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = `translateY(28px)${"seqScale" in item.dataset ? " scale(0.97)" : ""}`;
    });
    const play = () => {
      items.forEach((item) => {
        // reveal order comes from data-seq (1, 2, 3…), not from DOM order
        const i = Number(item.dataset.seq) - 1;
        item.style.transition = reduce
          ? "none"
          : `opacity ${SEQ_DURATION}s ease-out ${i * SEQ_STAGGER}s, transform ${SEQ_DURATION}s cubic-bezier(.22,1,.36,1) ${i * SEQ_STAGGER}s`;
        item.style.opacity = "1";
        item.style.transform = "none";
      });
    };
    let raf = 0;
    let done = false;
    const check = () => {
      raf = 0;
      if (done || wrap.getBoundingClientRect().top > window.innerHeight * TRIGGER) return;
      done = true;
      play();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    if (!done) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [wrapRef, sectionRef]);
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
  scrollHint = false, // fixed bottom-centre "SCROLL" cue, shown until this section's pin releases
}) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const setRefs = (el) => {
    innerRef.current = el;
    if (typeof sectionRef === "function") sectionRef(el);
    else if (sectionRef) sectionRef.current = el;
  };
  useTimedReveal(wrapRef, innerRef);
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
          <div data-seq="4">
            <PlayButton label={buttonLabel} onClick={onPlay} />
          </div>
        </div>

        {/* right video: the rest of the content width, at the video's own aspect ratio */}
        <div data-seq="3" data-seq-scale className="relative w-full flex-1 overflow-hidden rounded-[6px]">
          <PlaylistVideo src={videoSrc} crop={videoCrop} poster={poster} className="block h-auto w-full" />
        </div>
      </div>
    </section>
    </div>
  );
}

/* Full-screen player for the intro video (sound on, custom controls). Esc / backdrop closes.
   Control bar follows the "영상재생 ui" reference: caption line, then play · thin progress · time · volume,
   plus the rest of what the native bar offered (speed, picture-in-picture, fullscreen) — no download. */
// how long the pointer can sit still before the controls and close button fade out
const IDLE_HIDE_MS = 2500;
const SEEK_STEP = 5;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(sec) {
  const t = Number.isFinite(sec) && sec > 0 ? sec : 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ControlButton({ label, onClick, tabIndex, className, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      tabIndex={tabIndex}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70",
        className
      )}
    >
      {children}
    </button>
  );
}

export function VideoModal({ open, onClose, src, title }) {
  const closeRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const idleTimerRef = useRef(null);
  const scrubbingRef = useRef(false);

  const [active, setActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [scrubbing, setScrubbing] = useState(false);

  // while paused or seeking the controls stay up so the viewer can always resume
  const showUi = active || paused || scrubbing;
  const uiTab = showUi ? 0 : -1;
  const pipSupported = typeof document !== "undefined" && document.pictureInPictureEnabled;

  const wake = useCallback(() => {
    setActive(true);
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setActive(false), IDLE_HIDE_MS);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) v.play().catch(() => {});
    else v.pause();
  }, []);

  const seekBy = useCallback((delta) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + delta));
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // unmuting at zero volume would stay silent, so bring it back to an audible level
    if (v.muted || v.volume === 0) {
      v.muted = false;
      if (v.volume === 0) v.volume = 0.5;
    } else {
      v.muted = true;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    // iOS Safari has no element fullscreen; fall back to the video's own fullscreen player
    else videoRef.current?.webkitEnterFullscreen?.();
  }, []);

  const togglePip = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.pictureInPictureElement) document.exitPictureInPicture().catch(() => {});
    else v.requestPictureInPicture?.().catch(() => {});
  }, []);

  const cycleRate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const i = SPEEDS.indexOf(v.playbackRate);
    v.playbackRate = i === -1 ? 1 : SPEEDS[(i + 1) % SPEEDS.length];
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setPaused(false);
    setEnded(false);
    setWaiting(false);
    setCurrent(0);
    setDuration(0);
    setBuffered(0);
    setRate(1);
    setHoverTime(null);
    wake();
    return () => clearTimeout(idleTimerRef.current);
  }, [open, wake]);

  useEffect(() => {
    if (!open) return undefined;
    const onFs = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (document.pictureInPictureElement) document.exitPictureInPicture?.().catch(() => {});
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      wake();
      if (e.key === "Escape") {
        // the browser itself leaves fullscreen on Esc; only close when we're not in it
        if (!document.fullscreenElement) onClose();
        return;
      }
      // leave keys alone while a control has focus (space/enter press the button, arrows move the slider)
      const tag = e.target?.tagName;
      if (tag === "INPUT" || (tag === "BUTTON" && (e.key === " " || e.key === "Enter"))) return;
      switch (e.key) {
        case " ":
        case "k":
        case "K":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekBy(-SEEK_STEP);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekBy(SEEK_STEP);
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, wake, togglePlay, seekBy, toggleMute, toggleFullscreen]);

  function timeAtPointer(clientX) {
    const track = trackRef.current;
    if (!track || !duration) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }

  function onTrackPointerDown(e) {
    if (!duration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubbingRef.current = true;
    setScrubbing(true);
    const t = timeAtPointer(e.clientX);
    videoRef.current.currentTime = t;
    setCurrent(t);
  }

  function onTrackPointerMove(e) {
    const t = timeAtPointer(e.clientX);
    setHoverTime(t);
    if (scrubbingRef.current) {
      videoRef.current.currentTime = t;
      setCurrent(t);
    }
  }

  function onTrackPointerUp(e) {
    if (!scrubbingRef.current) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    scrubbingRef.current = false;
    setScrubbing(false);
  }

  function onTrackKeyDown(e) {
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      videoRef.current.currentTime = e.key === "Home" ? 0 : duration;
    }
  }

  function syncBuffered() {
    const v = videoRef.current;
    if (!v || !v.duration || !v.buffered.length) return;
    // the buffered range that covers the playhead is what the viewer can play without stalling
    for (let i = 0; i < v.buffered.length; i++) {
      if (v.buffered.start(i) <= v.currentTime && v.currentTime <= v.buffered.end(i)) {
        setBuffered(v.buffered.end(i) / v.duration);
        return;
      }
    }
  }

  if (!open) return null;

  const progress = duration ? (current / duration) * 100 : 0;
  const effectiveVolume = muted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;
  const playLabel = paused ? (ended ? "다시 재생" : "재생") : "일시정지";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm",
        !showUi && "cursor-none"
      )}
      onClick={onClose}
      onMouseMove={wake}
      onPointerDown={wake}
      onTouchStart={wake}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="닫기"
        tabIndex={uiTab}
        // round like the control-bar buttons, a touch larger so it still reads as the way out
        className={cn(
          "absolute top-5 right-5 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 backdrop-blur-sm transition-[background-color,color,opacity] duration-300 hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 sm:top-6 sm:right-6",
          !showUi && "pointer-events-none opacity-0"
        )}
      >
        <X className="size-[18px]" />
      </button>

      {/* phones/narrow windows: whole 16:9 frame, as large as the viewport allows, never cropped;
          desktop: full viewport height with no bars above/below (sides trimmed if the window is narrower than 16:9), see page.css .bf-vm-frame;
          in fullscreen the frame itself fills the screen so the custom controls come along */}
      <div
        ref={frameRef}
        className={cn("relative overflow-hidden bg-black", !showUi && "cursor-none", fullscreen ? "flex items-center justify-center" : "bf-vm-frame")}
        style={fullscreen ? { width: "100vw", height: "100vh" } : undefined}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={wake}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay
          playsInline
          preload="auto"
          className={cn("block bg-black object-contain", fullscreen ? "h-full w-full" : "aspect-video w-full")}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
          // no "save video as" from the browser's right-click menu either
          onContextMenu={(e) => e.preventDefault()}
          onPlay={() => {
            setPaused(false);
            setEnded(false);
          }}
          onPause={() => setPaused(true)}
          onEnded={() => setEnded(true)}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => setWaiting(false)}
          onCanPlay={() => setWaiting(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => {
            if (!scrubbingRef.current) setCurrent(e.currentTarget.currentTime);
            syncBuffered();
          }}
          onProgress={syncBuffered}
          onVolumeChange={(e) => {
            setVolume(e.currentTarget.volume);
            setMuted(e.currentTarget.muted);
          }}
          onRateChange={(e) => setRate(e.currentTarget.playbackRate)}
        />

        {waiting && !paused && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-10 animate-spin text-white/80" />
          </div>
        )}

        {paused && (
          <button
            type="button"
            aria-label={playLabel}
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-105"
          >
            {ended ? <RotateCcw className="size-6" /> : <Play className="ml-1 size-6 fill-current" />}
          </button>
        )}

        {/* control bar: caption line, then play · progress · time · volume · speed · PiP · fullscreen */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-14 pb-3 text-white transition-opacity duration-300 sm:px-7 sm:pb-5",
            !showUi && "pointer-events-none opacity-0"
          )}
        >
          {title && <p className="mb-2.5 truncate text-[13px] font-medium tracking-[-0.01em] text-white/90">{title}</p>}

          <div className="flex items-center gap-2 sm:gap-3">
            <ControlButton label={playLabel} onClick={togglePlay} tabIndex={uiTab} className="-ml-1.5">
              {!paused ? (
                <Pause className="size-4 fill-current" />
              ) : ended ? (
                <RotateCcw className="size-4" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
            </ControlButton>

            {/* progress: played (brand blue) over buffered (light) over the rest (faint) */}
            <div
              ref={trackRef}
              role="slider"
              tabIndex={uiTab}
              aria-label="재생 위치"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(current)}
              aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
              className="group/track relative flex h-6 min-w-0 flex-1 cursor-pointer touch-none items-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              onPointerDown={onTrackPointerDown}
              onPointerMove={onTrackPointerMove}
              onPointerUp={onTrackPointerUp}
              onPointerCancel={onTrackPointerUp}
              onPointerLeave={() => setHoverTime(null)}
              onKeyDown={onTrackKeyDown}
            >
              <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/20 transition-[height] duration-150 group-hover/track:h-1">
                <div className="absolute inset-y-0 left-0 bg-white/35" style={{ width: `${buffered * 100}%` }} />
                <div className="absolute inset-y-0 left-0 bg-[var(--blue-400)]" style={{ width: `${progress}%` }} />
              </div>
              <span
                className={cn(
                  "pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-150",
                  scrubbing ? "scale-100" : "scale-0 group-hover/track:scale-100"
                )}
                style={{ left: `${progress}%` }}
              />
              {hoverTime !== null && duration > 0 && (
                <span
                  className="pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
                  style={{ left: `${(hoverTime / duration) * 100}%` }}
                >
                  {formatTime(hoverTime)}
                </span>
              )}
            </div>

            <span className="shrink-0 text-[12px] font-medium tabular-nums text-white/85">
              {formatTime(current)} <span className="text-white/45">/</span> {formatTime(duration)}
            </span>

            <div className="group/vol flex shrink-0 items-center">
              <ControlButton label={effectiveVolume === 0 ? "음소거 해제" : "음소거"} onClick={toggleMute} tabIndex={uiTab}>
                <VolumeIcon className="size-4" />
              </ControlButton>
              {/* volume slider slides out on hover/focus; phones use their hardware buttons instead */}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={effectiveVolume}
                aria-label="볼륨"
                tabIndex={uiTab}
                onChange={(e) => {
                  const v = videoRef.current;
                  const val = Number(e.target.value);
                  v.volume = val;
                  v.muted = val === 0;
                }}
                className="bf-vm-volume hidden w-0 opacity-0 transition-[width,opacity,margin] duration-200 sm:block group-focus-within/vol:ml-1 group-focus-within/vol:w-16 group-focus-within/vol:opacity-100 group-hover/vol:ml-1 group-hover/vol:w-16 group-hover/vol:opacity-100"
                style={{ "--vol": `${effectiveVolume * 100}%` }}
              />
            </div>

            <button
              type="button"
              aria-label={`재생 속도 ${rate}배`}
              title="재생 속도"
              onClick={cycleRate}
              tabIndex={uiTab}
              className="hidden h-8 min-w-10 shrink-0 items-center justify-center rounded-full px-2 text-[12px] font-semibold tabular-nums text-white/85 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              {rate}x
            </button>

            {pipSupported && (
              <ControlButton label="PIP 모드" onClick={togglePip} tabIndex={uiTab} className="hidden sm:inline-flex">
                <PictureInPicture2 className="size-4" />
              </ControlButton>
            )}


            <ControlButton
              label={fullscreen ? "전체화면 종료" : "전체화면"}
              onClick={toggleFullscreen}
              tabIndex={uiTab}
              className="-mr-1.5"
            >
              {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}
