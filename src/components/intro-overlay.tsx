"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_CUBE_ATTR,
  INTRO_DONE_EVENT,
  INTRO_REVEAL_EVENT,
  INTRO_SEEN_KEY,
  introWillPlay,
} from "@/lib/intro";

const mediaPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media`;

/**
 * playing → the full-screen film runs.
 * landing → it ended on the hero video's first frame; the film glides into the
 *           hero's cube slot while the page appears around it.
 * fading  → skip, error or slow network: a plain crossfade to the page.
 */
type Phase = "playing" | "landing" | "fading" | "done";

const LAND_MS = 1100;
const FADE_MS = 700;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
/** If the film hasn't started by then (slow network, blocked autoplay), show the site. */
const START_TIMEOUT_MS = 3500;

/** Same soft edges as the hero cube video, so the landed film matches it exactly. */
const heroMask = {
  maskImage: "linear-gradient(to right, transparent, black 9%, black 90%, transparent), linear-gradient(to bottom, transparent, black 8%, black 88%, transparent)",
  maskComposite: "intersect" as const,
};

type Box = { top: number; left: number; width: number; height: number };

export function IntroOverlay() {
  const video = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [muted, setMuted] = useState(true);
  const [target, setTarget] = useState<Box | null>(null);

  const skip = useCallback(() => {
    setPhase((current) => (current === "playing" ? "fading" : current));
  }, []);

  const land = useCallback(() => {
    const slot = document.querySelector<HTMLElement>(`[${HERO_CUBE_ATTR}]`);
    const rect = slot?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.bottom < 0 || rect.top > window.innerHeight) {
      skip();
      return;
    }
    setTarget({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setPhase((current) => (current === "playing" ? "landing" : current));
  }, [skip]);

  useEffect(() => {
    // Skipped visitors never see the overlay: <html data-intro="skip"> hides it via CSS.
    if (!introWillPlay()) return;

    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}

    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const media = video.current;
    let started = false;
    const onPlaying = () => { started = true; };
    media?.addEventListener("playing", onPlaying);
    void media?.play().catch(skip);
    const timeout = window.setTimeout(() => { if (!started) skip(); }, START_TIMEOUT_MS);

    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") skip(); };
    window.addEventListener("keydown", onKey);

    return () => {
      root.style.overflow = "";
      media?.removeEventListener("playing", onPlaying);
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKey);
    };
  }, [skip]);

  useEffect(() => {
    if (phase !== "landing" && phase !== "fading") return;
    window.dispatchEvent(new Event(INTRO_REVEAL_EVENT));
    document.documentElement.style.overflow = "";
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      document.documentElement.dataset.intro = "skip";
      setPhase("done");
    }, phase === "landing" ? LAND_MS : FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;

  function toggleSound() {
    const media = video.current;
    if (!media) return;
    media.muted = !media.muted;
    setMuted(media.muted);
  }

  const landing = phase === "landing" && target;
  const filmStyle: React.CSSProperties = landing
    ? {
        ...target,
        ...heroMask,
        transition: `top ${LAND_MS}ms ${EASE}, left ${LAND_MS}ms ${EASE}, width ${LAND_MS}ms ${EASE}, height ${LAND_MS}ms ${EASE}`,
      }
    : { top: 0, left: 0, width: "100%", height: "100%" };

  return (
    <div
      className="intro-overlay fixed inset-0 z-[100]"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: phase === "playing" ? "auto" : "none",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Intro animation"
    >
      {/* Backdrop: clears as the film lands so the page appears around it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#05090C]"
        style={{ opacity: landing ? 0 : 1, transition: `opacity ${LAND_MS * 0.8}ms ease` }}
      />

      <video
        ref={video}
        src={`${mediaPath}/intro.mp4`}
        poster={`${mediaPath}/intro-poster.jpg`}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        // Portrait screens letterbox the 16:9 film instead of cropping it to a sliver.
        className="absolute object-cover portrait:object-contain"
        style={filmStyle}
        onEnded={land}
        onError={skip}
      />

      <div
        className="absolute bottom-5 right-5 flex items-center gap-2 transition-opacity duration-300 sm:bottom-8 sm:right-8"
        style={{ opacity: phase === "playing" ? 1 : 0 }}
      >
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn intro sound on" : "Turn intro sound off"}
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-black/40 text-[#d3d7e0] backdrop-blur-md transition-colors hover:border-white/25 hover:text-white"
        >
          {muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={skip}
          className="h-10 rounded-xl border border-white/10 bg-black/40 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#d3d7e0] backdrop-blur-md transition-colors hover:border-white/25 hover:text-white"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}
