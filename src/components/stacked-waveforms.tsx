"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StackedWaveformsProps {
  className?: string;
  size?: number;
  waveformCount?: number;
  particleCount?: number;
}

const reflections = ["#8497AC", "#CBD8E5", "#F1F6FF", "#BB7044", "#FFAD72"];

export function StackedWaveforms({
  className,
  size = 400,
  waveformCount = 3,
  particleCount = 3000,
}: StackedWaveformsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const particles = Array.from({ length: particleCount }, (_, index) => {
      const ribbon = index % waveformCount;
      const progress = Math.random() * 2 - 1;
      const thickness = (Math.random() - 0.5) * (1 - progress ** 2);
      const wave = Math.sin(progress * Math.PI + ribbon * 0.65);
      const amber = progress + thickness * 2 > 0.12 + ribbon * 0.1;
      const paletteIndex = amber ? 3 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3);

      return {
        baseX: progress * size * 0.44,
        baseY: size * ((ribbon - (waveformCount - 1) / 2) * 0.18 + wave * 0.1 + thickness * 0.12),
        color: reflections[paletteIndex],
        alpha: 0.35 + Math.random() * 0.6,
        radius: 0.6 + Math.random() * 1.25,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      };
    });
    let width = 0;
    let height = 0;
    let scale = 1;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const baseX = width / 2 + particle.baseX * scale;
        const baseY = height / 2 + particle.baseY * scale;
        let x = baseX;
        let y = baseY;

        if (!preference.matches) {
          const wave = Math.sin(time * 0.0015 + particle.baseX * 0.022) * 7 * scale;
          particle.vx = (particle.vx - particle.x * 0.06) * 0.87;
          particle.vy = (particle.vy + (wave - particle.y) * 0.06) * 0.87;

          if (pointer) {
            const dx = baseX + particle.x - pointer.x;
            const dy = baseY + particle.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 0 && distance < 70) {
              const force = 2.8 * (1 - distance / 70);
              particle.vx += (dx / distance) * force;
              particle.vy += (dy / distance) * force;
            }
          }

          particle.x += particle.vx;
          particle.y += particle.vy;
          x += particle.x;
          y += particle.y;
        }

        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fillRect(x, y, particle.radius, particle.radius);
      }
      ctx.globalAlpha = 1;
      if (!preference.matches) frame = requestAnimationFrame(draw);
    }

    const redraw = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      scale = Math.min(width / size, height / size, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(frame);
      if (width && height) draw(performance.now());
    };

    const trackPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const clearPointer = () => { pointer = null; };
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    preference.addEventListener("change", redraw);
    canvas.addEventListener("pointermove", trackPointer);
    canvas.addEventListener("pointerdown", trackPointer);
    canvas.addEventListener("pointerleave", clearPointer);
    canvas.addEventListener("pointerup", clearPointer);
    canvas.addEventListener("pointercancel", clearPointer);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      preference.removeEventListener("change", redraw);
      canvas.removeEventListener("pointermove", trackPointer);
      canvas.removeEventListener("pointerdown", trackPointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      canvas.removeEventListener("pointerup", clearPointer);
      canvas.removeEventListener("pointercancel", clearPointer);
    };
  }, [size, waveformCount, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Silver and amber particle waves"
      className={cn("block size-full", className)}
    />
  );
}
