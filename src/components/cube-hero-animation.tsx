"use client";

import { profile } from "@/content/profile";
import Link from "next/link";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const mediaPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media`;
const openingFrame = `${mediaPath}/chrome-cube-opening.jpg`;
const stillFrame = `${mediaPath}/chrome-cube.jpg`;
const filmMask = {
  maskImage: "linear-gradient(to right, transparent, black 9%, black 90%, transparent), linear-gradient(to bottom, transparent, black 8%, black 88%, transparent)",
  maskComposite: "intersect" as const,
};

export function CubeHeroAnimation() {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["center center", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.75], ["0%", "-32%"]);
  const opacity = useTransform(scrollYProgress, [0.12, 0.78], [1, 0]);
  const visibility = useTransform(opacity, (value) => value > 0 ? "visible" : "hidden");
  const scale = useTransform(scrollYProgress, [0, 0.78], [1, 0.94]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMotionEnabled(!preference.matches);
      if (preference.matches) {
        setRevealed(false);
        setPlaying(false);
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const media = video.current;
    const viewportTarget = stage.current;
    if (!media || !viewportTarget) return;

    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && revealed && !userPaused) {
        void media.play().catch(() => {});
      } else {
        media.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.15;
      sync();
    }, { threshold: 0.15 });
    observer.observe(viewportTarget);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.pause();
    };
  }, [motionEnabled, revealed, userPaused]);

  function togglePlayback() {
    const media = video.current;
    if (!media) return;

    if (!media.paused) {
      setUserPaused(true);
      media.pause();
      return;
    }

    setUserPaused(false);
    void media.play().catch(() => {});
  }

  return (
    <section
      aria-labelledby="home-title"
      className="relative isolate overflow-hidden bg-[#05090C] text-[#f2f3f6]"
    >
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] content-center items-center gap-8 px-6 pb-12 pt-14 md:px-12 lg:grid-cols-[55fr_45fr] lg:gap-0 lg:px-16 lg:py-20">
        <motion.div
          className="relative z-10"
          initial={false}
          animate={motionEnabled ? { opacity: [0, 1], y: [14, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <p className="mb-5 text-sm font-medium text-[#b7bdca]">Computer Science at Vanderbilt University</p>
          <h1 id="home-title" className="font-display text-[clamp(3.8rem,8.5vw,8rem)] font-medium leading-[0.92] tracking-[-0.075em]">
            {profile.name}
          </h1>
          <p className="mt-7 max-w-lg text-balance text-xl leading-snug tracking-tight text-[#e0e3eb] md:text-[1.7rem]">
            I build AI systems and developer tools.
          </p>
          <p className="mt-4 max-w-[38ch] leading-relaxed text-[#b7bdca]">
            My projects span agent security, real-time observability, and offline document search.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f2f3f6] px-5 text-sm font-semibold text-[#05090C] hover:bg-white">
              Explore My Work <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full border border-[#454c5b] px-5 text-sm font-medium hover:border-[#b7bdca]">
              Get in Touch
            </Link>
          </div>
        </motion.div>

        <div ref={stage} className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <motion.div className="relative aspect-video" style={motionEnabled ? { y, opacity, scale, visibility } : undefined}>
            {/* Studio lighting: a cool halo behind the cube and a pool of light on the floor beneath it */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[85%] w-[70%] mix-blend-screen -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(130,170,255,0.11),rgba(130,170,255,0.035)_55%,transparent)] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[6%] left-1/2 z-10 h-[22%] w-[62%] mix-blend-screen -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(242,243,246,0.10),rgba(130,170,255,0.045)_60%,transparent)] blur-xl"
            />
            {motionEnabled ? (
              <motion.div
                className="size-full"
                initial={{ y: window.matchMedia("(min-width: 64rem)").matches ? "-100vh" : "-70px", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.75, ease: [0.2, 0.75, 0.2, 1] }}
                onAnimationComplete={() => setRevealed(true)}
              >
                <video
                  ref={video}
                  src={`${mediaPath}/chrome-cube.mp4`}
                  poster={openingFrame}
                  width={1280}
                  height={720}
                  preload="auto"
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                  className="block size-full object-cover"
                  style={filmMask}
                  onPlaying={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              </motion.div>
            ) : (
              <div
                role="img"
                aria-label="A chrome puzzle cube with amber reflections"
                className="size-full bg-cover motion-safe:invisible"
                style={{ ...filmMask, backgroundImage: `url(${stillFrame})` }}
              />
            )}
            {motionEnabled && revealed && (
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={playing ? "Pause cube animation" : "Play cube animation"}
                className="absolute bottom-0 right-0 z-20 grid size-11 place-items-center rounded-full border border-[#454c5b] bg-[#05090C] text-[#e0e3eb] hover:border-[#b7bdca]"
              >
                {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
              </button>
            )}
          </motion.div>
        </div>
      </div>
      <a href="#home-terminal" aria-label="Scroll to the interactive terminal" className="absolute bottom-6 left-1/2 hidden size-11 -translate-x-1/2 place-items-center rounded-full text-[#b7bdca] hover:text-white lg:grid">
        <ArrowDown className="size-5" aria-hidden="true" />
      </a>
    </section>
  );
}
