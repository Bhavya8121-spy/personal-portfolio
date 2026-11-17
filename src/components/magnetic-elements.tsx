"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticCursorProps {
  className?: string;
  size?: number;
  color?: string;
  blendMode?: string;
}

export function MagneticCursor({
  className,
  size = 40,
  color = "#2563EB",
  blendMode = "difference"
}: MagneticCursorProps) {
  const [mousePos, setMousePos] = useState({ x: -10000, y: -10000 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const mixBlendMode = blendMode as "difference" | "exclusion" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "normal" | undefined;

  // Don't render anything until mouse has moved
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Visible cursor ring with blend mode */}
      <motion.div
        ref={cursorRef}
        className={cn("fixed pointer-events-none z-[9999] transition-colors", className)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          mixBlendMode,
          transform: `translate(${mousePos.x - size / 2}px, ${mousePos.y - size / 2}px)`,
          pointerEvents: "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          borderWidth: isHovering ? 1 : 2,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            opacity: isHovering ? 0.15 : 0,
          }}
          animate={{ scale: isHovering ? 1 : 0.3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </motion.div>

      {/* Solid visible dot in center for clear navigation - always visible */}
      <motion.div
        className={cn("fixed pointer-events-none z-[9999]", className)}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80`,
          transform: `translate(${mousePos.x - 4}px, ${mousePos.y - 4}px)`,
          pointerEvents: "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.1s ease",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Crosshair lines for precise navigation */}
      <motion.div
        className={cn("fixed pointer-events-none z-[9998]", className)}
        style={{
          width: 1,
          height: 20,
          background: `${color}80`,
          transform: `translate(${mousePos.x - 0.5}px, ${mousePos.y - 10}px)`,
          pointerEvents: "none",
          opacity: isVisible ? 0.5 : 0,
          transition: "opacity 0.1s ease",
        }}
        animate={{ scaleY: isHovering ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <motion.div
        className={cn("fixed pointer-events-none z-[9998]", className)}
        style={{
          width: 20,
          height: 1,
          background: `${color}80`,
          transform: `translate(${mousePos.x - 10}px, ${mousePos.y - 0.5}px)`,
          pointerEvents: "none",
          opacity: isVisible ? 0.5 : 0,
          transition: "opacity 0.1s ease",
        }}
        animate={{ scaleX: isHovering ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            cursor: auto !important;
          }
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
        /* Keep native cursor visible for accessibility */
        * {
          cursor: auto !important;
        }
        /* But hide it for interactive elements where we show custom cursor */
        a, button, input, textarea, select, [role="button"], .cursor-pointer,
        .group, [href], button:not(:disabled) {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}