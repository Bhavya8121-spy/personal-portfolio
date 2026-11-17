"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  className?: string;
  count?: number;
  colors?: string[];
}

export function FloatingElements({
  className,
  count = 12,
  colors = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
}: FloatingElementProps) {
  const [elements, setElements] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      delay: number;
      duration: number;
      shape: "circle" | "square" | "triangle" | "line";
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 15,
      shape: ["circle", "square", "triangle", "line"][Math.floor(Math.random() * 4)] as
        | "circle"
        | "square"
        | "triangle"
        | "line",
      opacity: Math.random() * 0.15 + 0.03,
    }));
    setElements(newElements);
  }, [count, colors]);

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none overflow-hidden z-0",
        className
      )}
      aria-hidden="true"
    >
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.size}px`,
            height: `${el.size}px`,
            opacity: el.opacity,
          }}
          initial={false}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() > 0.5 ? 360 : -360, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.shape === "circle" && (
            <div
              className="w-full h-full rounded-full"
              style={{
                border: `1px solid ${el.color}`,
                background: `linear-gradient(135deg, ${el.color}10, transparent)`,
              }}
            />
          )}
          {el.shape === "square" && (
            <motion.div
              className="w-full h-full"
              style={{
                border: `1px solid ${el.color}`,
                transform: "rotate(45deg)",
              }}
              animate={{ rotate: [45, 405] }}
              transition={{ duration: el.duration * 2, repeat: Infinity, ease: "linear" }}
            />
          )}
          {el.shape === "triangle" && (
            <div
              className="w-full h-full"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                border: `1px solid ${el.color}`,
                background: `linear-gradient(180deg, ${el.color}10, transparent)`,
              }}
            />
          )}
          {el.shape === "line" && (
            <div
              className="w-full h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${el.color}, transparent)`,
                transformOrigin: "center",
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

interface FloatingCodeProps {
  className?: string;
  snippets?: string[];
}

const codeSnippets = [
  "const curiosity = () => explore();",
  "while (learning) { grow(); }",
  "if (idea) { build(it); }",
  "const focus = () => breathe();",
  "function create() { return joy; }",
  "let wonder = true;",
  "const path = iterate();",
  "mindful(() => pause());",
];

export function FloatingCode({ className, snippets = codeSnippets }: FloatingCodeProps) {
  const [floatingSnippets, setFloatingSnippets] = useState<
    Array<{
      id: number;
      text: string;
      x: number;
      y: number;
      delay: number;
      duration: number;
      opacity: number;
      scale: number;
    }>
  >([]);

  useEffect(() => {
    const newSnippets = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      text: snippets[Math.floor(Math.random() * snippets.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      delay: Math.random() * 8,
      duration: Math.random() * 15 + 12,
      opacity: Math.random() * 0.08 + 0.02,
      scale: Math.random() * 0.3 + 0.7,
    }));
    setFloatingSnippets(newSnippets);
  }, [snippets]);

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none overflow-hidden z-0 font-mono text-xs",
        className
      )}
      aria-hidden="true"
    >
      {floatingSnippets.map((snippet) => (
        <motion.div
          key={snippet.id}
          className="absolute white-space-nowrap text-accent/30 select-none"
          style={{
            left: `${snippet.x}%`,
            top: `${snippet.y}%`,
            opacity: snippet.opacity,
            transform: `scale(${snippet.scale})`,
          }}
          initial={false}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 15 - 7.5, 0],
            opacity: [snippet.opacity, 0, snippet.opacity],
          }}
          transition={{
            duration: snippet.duration,
            delay: snippet.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {snippet.text}
        </motion.div>
      ))}
    </div>
  );
}

interface ParticleCursorProps {
  className?: string;
}

export function ParticleCursor({ className }: ParticleCursorProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      life: number;
      size: number;
      color: string;
    }>
  >([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove);

    let frame = 0;
    const animate = () => {
      frame++;
      if (frame % 3 === 0) {
        setParticles((prev) => {
          const newParticles = [
            {
              id: Date.now() + Math.random(),
              x: mouseRef.current.x + (Math.random() - 0.5) * 20,
              y: mouseRef.current.y + (Math.random() - 0.5) * 20,
              life: 1,
              size: Math.random() * 6 + 2,
              color: ["#2563EB", "#3B82F6", "#60A5FA"][Math.floor(Math.random() * 3)],
            },
            ...prev.slice(0, 30).map((p) => ({ ...p, life: p.life - 0.05 })),
          ].filter((p) => p.life > 0);
          return newParticles;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      className={cn("fixed inset-0 pointer-events-none z-50", className)}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.life * 0.6,
            transform: "translate(-50%, -50%)",
          }}
          initial={false}
          animate={{
            scale: [1, 0],
            opacity: [p.life * 0.6, 0],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}