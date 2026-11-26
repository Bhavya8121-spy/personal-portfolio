"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

type Category = { title: string; items: string[] };

/**
 * Skills as a loose bank of keycaps: drag and fling any key and it springs back,
 * press it and it travels down, and the whole bank leans with scroll speed.
 */
export function SkillKeycaps({ categories }: { categories: Category[] }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 300 });
  const skew = useTransform(smooth, [-2500, 0, 2500], [5, 0, -5], { clamp: true });

  return (
    <div className="max-w-5xl">
      <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8a91a0]">
        Drag a key, then let go
      </p>
      <div className="space-y-8">
        {categories.map((category, row) => (
          <div key={category.title} className="grid gap-3 md:grid-cols-[11rem_1fr] md:items-center">
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--foreground)]">
              {category.title}
            </h3>
            <motion.ul className="flex flex-wrap gap-2.5" style={reduced ? undefined : { skewX: skew }}>
              {category.items.map((item, index) => (
                <motion.li
                  key={item}
                  drag={!reduced}
                  dragSnapToOrigin
                  dragElastic={0.6}
                  dragTransition={{ bounceStiffness: 420, bounceDamping: 14 }}
                  whileDrag={{ scale: 1.08, rotate: (index + row) % 2 ? 6 : -6, zIndex: 10 }}
                  whileTap={{ scale: 0.95, boxShadow: "0 1px 0 0 #1b1f27, inset 0 1px 0 0 rgba(255,255,255,0.06)" }}
                  className="relative cursor-grab touch-pan-y select-none rounded-lg border border-white/[0.09] bg-gradient-to-b from-[#1a1d25] to-[#12141a] px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-[#d3d7e0] shadow-[0_4px_0_0_#1b1f27,inset_0_1px_0_0_rgba(255,255,255,0.08)] active:cursor-grabbing motion-reduce:cursor-default motion-reduce:touch-auto"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ))}
      </div>
    </div>
  );
}
