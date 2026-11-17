"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoiseCircleProps {
  className?: string;
  size?: number;
  color?: string;
  noiseOpacity?: number;
  interactive?: boolean;
}

export function NoiseCircle({
  className,
  size = 300,
  color = "#2563EB",
  noiseOpacity = 0.12,
  interactive = true
}: NoiseCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [intensity, setIntensity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  // Magnetic cursor values - using MotionValue for spring animation
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 });

  // Refs for spring values to use in canvas animation
  const springXRef = useRef(0);
  const springYRef = useRef(0);

  useEffect(() => {
    const unsubX = springX.on("change", (v) => { springXRef.current = v; });
    const unsubY = springY.on("change", (v) => { springYRef.current = v; });
    return () => { unsubX(); unsubY(); };
  }, [springX, springY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let frame = 0;
    const noiseCache: ImageData[] = [];

    // Pre-generate noise frames
    const generateNoise = (seed: number) => {
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      let x = seed;
      for (let i = 0; i < data.length; i += 4) {
        x = (x * 1664525 + 1013904223) % 4294967296;
        const noise = (x / 4294967296) * 255;
        data[i] = noise;     // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = noiseOpacity * 255; // A
      }
      return imageData;
    };

    for (let i = 0; i < 8; i++) {
      noiseCache.push(generateNoise(i * 1000));
    }

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);

      // Draw base circle with clipping
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw noise
      const noiseFrame = noiseCache[Math.floor(frame / 2) % noiseCache.length];
      ctx.putImageData(noiseFrame, 0, 0);

      // Draw gradient overlay that follows cursor with magnetic effect
      const gradient = ctx.createRadialGradient(
        size / 2 + springXRef.current * 40,
        size / 2 + springYRef.current * 40,
        0,
        size / 2 + springXRef.current * 40,
        size / 2 + springYRef.current * 40,
        size / 2 * intensity
      );
      const [r, g, b] = hexToRgb(color);
      gradient.addColorStop(0, `rgba(${r},${g},${b}, 0)`);
      gradient.addColorStop(0.4, `rgba(${r},${g},${b}, ${0.06 * intensity})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b}, ${0.18 * intensity})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      ctx.restore();

      // Draw border ring that reacts to cursor
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b}, ${0.35 * intensity})`;
      ctx.lineWidth = isHovering ? 3 : 2;
      ctx.stroke();
      ctx.restore();

      // Inner glow ring when hovering
      if (isHovering) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b}, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [size, color, noiseOpacity, intensity, isHovering]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - size / 2) / (size / 2);
    const y = (e.clientY - rect.top - size / 2) / (size / 2);
    const clampedX = Math.max(-1, Math.min(1, x));
    const clampedY = Math.max(-1, Math.min(1, y));

    if (interactive) {
      cursorX.set(clampedX);
      cursorY.set(clampedY);
    }

    setMousePos({ x: clampedX, y: clampedY });
    setIntensity(1.6);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (interactive) {
      cursorX.set(0);
      cursorY.set(0);
    }
    setMousePos({ x: 0, y: 0 });
    setIntensity(1);
    setIsHovering(false);
  };

  function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [37, 99, 235];
  }

  // Magnetic cursor element
  const cursorSize = 48;

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Magnetic cursor follower */}
      {interactive && (
        <motion.div
          className="absolute pointer-events-none z-10"
          style={{
            width: cursorSize,
            height: cursorSize,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
            mixBlendMode: "difference",
            transformOrigin: "center",
            x: springX,
            y: springY,
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            borderWidth: isHovering ? 1 : 2,
            opacity: isHovering ? 0.8 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          initial={false}
        >
          {/* Inner pulse */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: color, opacity: 0.1 }}
            animate={{ scale: isHovering ? [0.3, 1, 0.3] : 0.3 }}
            transition={{ duration: isHovering ? 1.5 : 0, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Cursor trail particles */}
      {interactive && <CursorParticles color={color} count={8} size={size} />}
    </div>
  );
}

interface CursorParticlesProps {
  color: string;
  count: number;
  size: number;
}

function CursorParticles({ color, count, size }: CursorParticlesProps) {
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; life: number; id: number; vx: number; vy: number }>
  >([]);

  useEffect(() => {
    let frame = 0;
    let animationId: number;

    const animate = () => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.015,
          }))
          .filter(p => p.life > 0);

        // Add new particles occasionally
        if (frame % 3 === 0 && updated.length < count) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.5;
          updated.push({
            x: size / 2 + (Math.random() - 0.5) * 20,
            y: size / 2 + (Math.random() - 0.5) * 20,
            life: 1,
            id: Date.now() + Math.random(),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
          });
        }

        frame++;
        return updated;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [count, size]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: 4 + i * 0.5,
            height: 4 + i * 0.5,
            background: color,
            opacity: p.life * 0.4,
            transform: "translate(-50%, -50%)",
          }}
          initial={false}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, p.life * 0.4, 0],
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

interface StackedSquaresProps {
  className?: string;
  count?: number;
  baseSize?: number;
  color?: string;
  gap?: number;
  animated?: boolean;
}

export function StackedSquares({
  className,
  count = 6,
  baseSize = 60,
  color = "#2563EB",
  gap = 12,
  animated = true
}: StackedSquaresProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: baseSize + i * gap * 2,
            height: baseSize + i * gap * 2,
            border: `1px solid ${color}`,
            borderRadius: 8,
            opacity: 0.12 - i * 0.015,
            transformOrigin: "center",
          }}
          initial={false}
          animate={animated ? {
            rotate: [0, (i % 2 === 0 ? 1 : -1) * 2, 0],
            scale: [1, 1.015, 1],
            borderColor: [color, `${color}60`, color],
            boxShadow: [`0 0 0 ${color}00`, `0 0 30px ${color}20`, `0 0 0 ${color}00`],
          } : undefined}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
      {/* Center accent with pulse */}
      <motion.div
        className="absolute"
        style={{
          width: baseSize * 0.35,
          height: baseSize * 0.35,
          background: `radial-gradient(circle, ${color} 0%, ${color}00 70%)`,
          borderRadius: "50%",
          opacity: 0.15,
          filter: "blur(8px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

interface CursorTrailProps {
  className?: string;
  color?: string;
  length?: number;
}

export function CursorTrail({
  className,
  color = "#2563EB",
  length = 12
}: CursorTrailProps) {
  const [points, setPoints] = useState<
    Array<{ x: number; y: number; life: number; id: number; size: number }>
  >([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPoints(prev => [
        { x: e.clientX, y: e.clientY, life: 1, id: Date.now() + Math.random(), size: Math.random() * 6 + 3 },
        ...prev.slice(0, length - 1).map(p => ({ ...p, life: p.life - 0.07 })),
      ].filter(p => p.life > 0));
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [length]);

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      {points.map((point, i) => (
        <motion.div
          key={point.id}
          className="absolute rounded-full"
          style={{
            left: point.x,
            top: point.y,
            width: point.size,
            height: point.size,
            background: color,
            opacity: point.life * 0.5,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          initial={false}
          animate={{
            scale: [1, 0.3, 0],
            opacity: [point.life * 0.5, 0],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function NoiseBackground({
  className,
  color = "#2563EB",
  opacity = 0.025
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const noiseFrames: ImageData[] = [];

    const generateNoise = (w: number, h: number, seed: number) => {
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      let x = seed;
      for (let i = 0; i < data.length; i += 4) {
        x = (x * 1664525 + 1013904223) % 4294967296;
        const noise = (x / 4294967296) * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = opacity * 255;
      }
      return imageData;
    };

    // Pre-generate a few frames
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 4; i++) {
      noiseFrames.push(generateNoise(w, h, i * 5000));
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const noiseFrame = noiseFrames[Math.floor(frame / 3) % noiseFrames.length];
      ctx.putImageData(noiseFrame, 0, 0);
      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 pointer-events-none z-0", className)}
      style={{ opacity }}
    />
  );
}