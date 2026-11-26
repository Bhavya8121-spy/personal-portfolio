"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven sequel to the intro film: a heap of sand grains assembles into a
 * chip as the visitor scrolls, then signal pulses run out along its traces.
 * The pointer pushes grains around at any stage; they spring back into place.
 */

const steps = [
  { label: "Sand", text: "Silicon makes up about 28% of the Earth's crust. Every chip starts as quartz sand." },
  { label: "Silicon", text: "Purified, sliced and patterned, it becomes the die at the heart of every chip." },
  { label: "System", text: "And from there, everything I build: software that runs on top of it." },
];

const sandColors = ["#C9B48F", "#B59D76", "#D8C6A3", "#9E8763"];
const chipColors = ["#8497AC", "#CBD8E5", "#F1F6FF", "#BB7044", "#FFAD72"];
const PULSE = "130, 170, 255";

type Grain = {
  sx: number; sy: number; // sand position (unit space)
  tx: number; ty: number; // chip position (unit space)
  delay: number;
  sand: string; chip: string;
  size: number; alpha: number;
  ox: number; oy: number; vx: number; vy: number; // pointer displacement (px)
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** A point on the chip drawing, in unit space where the package spans -0.5…0.5. */
function chipPoint(): [number, number, "line" | "pin" | "fill"] {
  const r = Math.random();
  const along = Math.random() - 0.5;
  if (r < 0.24) {
    // Package outline.
    const side = Math.floor(Math.random() * 4);
    return side === 0 ? [along, -0.5, "line"] : side === 1 ? [0.5, along, "line"] : side === 2 ? [along, 0.5, "line"] : [-0.5, along, "line"];
  }
  if (r < 0.58) {
    // Die grid: 4 × 4 cells inside the package.
    const line = -0.36 + Math.floor(Math.random() * 5) * 0.18;
    const span = along * 0.72;
    return Math.random() < 0.5 ? [line, span, "line"] : [span, line, "line"];
  }
  if (r < 0.8) {
    // Pins: 7 per side.
    const side = Math.floor(Math.random() * 4);
    const slot = -0.39 + Math.floor(Math.random() * 7) * 0.13;
    const reach = 0.52 + Math.random() * 0.1;
    return side === 0 ? [slot, -reach, "pin"] : side === 1 ? [reach, slot, "pin"] : side === 2 ? [slot, reach, "pin"] : [-reach, slot, "pin"];
  }
  // Sparse sheen across the die.
  return [(Math.random() - 0.5) * 0.72, (Math.random() - 0.5) * 0.72, "fill"];
}

function makeGrains(count: number): Grain[] {
  return Array.from({ length: count }, () => {
    const [tx, ty, kind] = chipPoint();
    // A wide, low dune along the bottom of the frame.
    const sx = (Math.random() * 2 - 1) * 1.35;
    const heap = (1 - (sx / 1.35) ** 2) * 0.32;
    const sy = 0.62 - heap * Math.sqrt(Math.random());
    return {
      sx, sy, tx, ty,
      delay: Math.random() * 0.35 + (tx + 0.6) * 0.12,
      sand: sandColors[Math.floor(Math.random() * sandColors.length)],
      chip: kind === "fill" ? chipColors[Math.floor(Math.random() * 3)] : chipColors[Math.floor(Math.random() * chipColors.length)],
      size: kind === "fill" ? 0.9 : 1 + Math.random() * 0.9,
      alpha: kind === "fill" ? 0.25 + Math.random() * 0.25 : 0.55 + Math.random() * 0.45,
      ox: 0, oy: 0, vx: 0, vy: 0,
    };
  });
}

/** Trace endpoints for the signal pulses: one per pin, running outward. */
const traces = [0, 1, 2, 3].flatMap((side) =>
  Array.from({ length: 7 }, (_, i) => {
    const slot = -0.39 + i * 0.13;
    const dir: [number, number] = side === 0 ? [0, -1] : side === 1 ? [1, 0] : side === 2 ? [0, 1] : [-1, 0];
    const start: [number, number] = side === 0 ? [slot, -0.62] : side === 1 ? [0.62, slot] : side === 2 ? [slot, 0.62] : [-0.62, slot];
    return { start, dir, phase: Math.random(), speed: 0.25 + Math.random() * 0.3 };
  }),
);

export function SandToSilicon() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = section.current;
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!root || !element || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grains = makeGrains(window.innerWidth < 768 ? 2200 : 4200);
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let pointer: { x: number; y: number } | null = null;
    let shownStep = -1;
    let shownProgress = -1;

    function resize() {
      if (!element || !ctx) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = element.clientWidth;
      height = element.clientHeight;
      element.width = width * ratio;
      element.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function scrollProgress() {
      if (reduced || !root) return 1;
      const rect = root.getBoundingClientRect();
      return clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
    }

    function draw(time: number) {
      if (!ctx) return;
      const p = scrollProgress();
      const nextStep = p < 0.3 ? 0 : p < 0.68 ? 1 : 2;
      if (nextStep !== shownStep) { shownStep = nextStep; setStep(nextStep); }
      const rounded = Math.round(p * 100) / 100;
      if (rounded !== shownProgress) { shownProgress = rounded; setProgress(rounded); }

      ctx.clearRect(0, 0, width, height);
      // Wide screens: chip sits right of the caption. Narrow: above it.
      const wide = width >= 960;
      const cx = wide ? width * 0.62 : width / 2;
      const cy = wide ? height * 0.5 : height * 0.38;
      const chipScale = wide ? Math.min(width * 0.42, height * 0.6) : Math.min(width * 0.62, height * 0.42);
      const sandX = width / 2;
      const sandY = height / 2;
      const sandScaleX = width / 2.7;
      const sandScaleY = height / 2;
      // 0.12…0.82 of the scroll is the assembly; before it the sand drifts, after it the chip is live.
      const build = clamp((p - 0.12) / 0.7);
      const live = clamp((p - 0.72) / 0.2);

      // Signal traces and pulses once the chip has formed.
      if (live > 0) {
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, chipScale * 0.9);
        halo.addColorStop(0, `rgba(${PULSE}, ${0.1 * live})`);
        halo.addColorStop(1, `rgba(${PULSE}, 0)`);
        ctx.fillStyle = halo;
        ctx.fillRect(cx - chipScale, cy - chipScale, chipScale * 2, chipScale * 2);
        ctx.lineWidth = 1;
        for (const trace of traces) {
          const x0 = cx + trace.start[0] * chipScale;
          const y0 = cy + trace.start[1] * chipScale;
          const length = chipScale * 0.55;
          ctx.strokeStyle = `rgba(${PULSE}, ${0.12 * live})`;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + trace.dir[0] * length, y0 + trace.dir[1] * length);
          ctx.stroke();
          if (!reduced) {
            const t = (time * 0.001 * trace.speed + trace.phase) % 1;
            const px = x0 + trace.dir[0] * length * t;
            const py = y0 + trace.dir[1] * length * t;
            const glow = ctx.createRadialGradient(px, py, 0, px, py, 9);
            glow.addColorStop(0, `rgba(${PULSE}, ${0.9 * live * (1 - t)})`);
            glow.addColorStop(1, `rgba(${PULSE}, 0)`);
            ctx.fillStyle = glow;
            ctx.fillRect(px - 9, py - 9, 18, 18);
          }
        }
      }

      for (const grain of grains) {
        const local = easeInOut(clamp((build - grain.delay * 0.5) / 0.5));
        const drift = reduced ? 0 : Math.sin(time * 0.0007 + grain.sx * 4) * 3 * (1 - local);
        const homeX = (1 - local) * (sandX + grain.sx * sandScaleX) + local * (cx + grain.tx * chipScale) + drift;
        const homeY = (1 - local) * (sandY + grain.sy * sandScaleY) + local * (cy + grain.ty * chipScale);

        if (!reduced) {
          grain.vx = (grain.vx - grain.ox * 0.05) * 0.88;
          grain.vy = (grain.vy - grain.oy * 0.05) * 0.88;
          if (pointer) {
            const dx = homeX + grain.ox - pointer.x;
            const dy = homeY + grain.oy - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 0 && distance < 90) {
              const force = 3.2 * (1 - distance / 90);
              grain.vx += (dx / distance) * force;
              grain.vy += (dy / distance) * force;
            }
          }
          grain.ox += grain.vx;
          grain.oy += grain.vy;
        }

        ctx.globalAlpha = grain.alpha;
        ctx.fillStyle = local < 0.5 ? grain.sand : grain.chip;
        const size = grain.size * (1 + local * 0.4);
        ctx.fillRect(homeX + grain.ox, homeY + grain.oy, size, size);
      }
      ctx.globalAlpha = 1;
    }

    function loop(time: number) {
      draw(time);
      frame = visible && !reduced ? requestAnimationFrame(loop) : 0;
    }

    function start() {
      if (!frame) frame = requestAnimationFrame(loop);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    observer.observe(root);

    function onMove(event: PointerEvent) {
      const rect = element!.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    function onLeave() { pointer = null; }

    // Reduced motion draws one still frame, so it must redraw itself after a resize.
    const onResize = () => { resize(); if (reduced) draw(0); };
    onResize();
    draw(0);
    window.addEventListener("resize", onResize);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    element.addEventListener("pointercancel", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  return (
    <section
      ref={section}
      aria-labelledby="sand-title"
      className="relative h-[260svh] border-t border-[var(--border)] bg-[#05090C] motion-reduce:h-auto md:h-[300svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative">
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full touch-pan-y" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-6 pb-10 md:px-12 md:pb-14 lg:px-16">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            From sand to system
          </span>
          <h2 id="sand-title" className="mt-2 font-display text-3xl font-medium text-[var(--foreground)] md:text-4xl">
            {steps[step].label}
          </h2>
          <p aria-live="polite" className="mt-3 max-w-md leading-relaxed text-[#b7bdca]">
            {steps[step].text}
          </p>
          <ol className="mt-6 flex max-w-xs gap-2" aria-hidden="true">
            {steps.map((item, index) => {
              const start = index === 0 ? 0 : index === 1 ? 0.3 : 0.68;
              const end = index === 0 ? 0.3 : index === 1 ? 0.68 : 1;
              const fill = clamp((progress - start) / (end - start));
              return (
                <li key={item.label} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full origin-left bg-[#d3d7e0]" style={{ transform: `scaleX(${fill})` }} />
                </li>
              );
            })}
          </ol>
        </div>

        <p className="pointer-events-none absolute right-6 top-24 hidden font-mono text-[11px] uppercase tracking-[0.16em] text-[#8a91a0] md:block lg:right-16">
          Move through the grains
        </p>
      </div>
    </section>
  );
}
