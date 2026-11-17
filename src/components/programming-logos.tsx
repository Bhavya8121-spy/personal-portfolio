"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const languageLogos: Record<string, React.ReactNode> = {
  typescript: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 28L12 4H20L28 28H4Z" stroke="#3178C6" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M8 16H24" stroke="#3178C6" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="3" fill="#3178C6"/>
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 26L14 6H18L26 26H6Z" stroke="#F7DF1E" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M10 16H22" stroke="#F7DF1E" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 10V22" stroke="#F7DF1E" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  python: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C22.6 4 28 9.4 28 16C28 22.6 22.6 28 16 28C9.4 28 4 22.6 4 16C4 9.4 9.4 4 16 4Z" stroke="#3776AB" strokeWidth="2.5"/>
      <path d="M16 10V22" stroke="#3776AB" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M10 16H22" stroke="#3776AB" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M22 16C22 19.3 19.3 22 16 22C12.7 22 10 19.3 10 16" stroke="#3776AB" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  rust: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="#CE422B" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 8L24 14M16 8L8 14" stroke="#CE422B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 18L24 24M16 18L8 24" stroke="#CE422B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  go: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C8.3 2 2 8.3 2 16C2 23.7 8.3 30 16 30C23.7 30 30 23.7 30 16C30 8.3 23.7 2 16 2Z" stroke="#00ADD8" strokeWidth="2.5"/>
      <path d="M20 10C20 10 26 10 26 16C26 22 20 22 20 22" stroke="#00ADD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22V10" stroke="#00ADD8" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 16H20" stroke="#00ADD8" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="#61DAFB" strokeWidth="2.5"/>
      <circle cx="16" cy="16" r="8" stroke="#61DAFB" strokeWidth="2.5"/>
      <path d="M16 8V4M16 28V24M4 16H8M28 16H24M7 7L10 10M22 22L25 25M7 25L10 22M25 10L22 7" stroke="#61DAFB" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L26 6V26L16 30L6 26V6L16 2Z" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 6V26M16 6L6 11M16 6L26 11" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L26 6V26L16 30L6 26V6L16 2Z" stroke="#06B6D4" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 10L24 14V18L16 22L8 18V14L16 10Z" fill="#06B6D4" opacity="0.3"/>
      <path d="M16 10L24 14V18L16 22L8 18V14L16 10Z" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  swift: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000.svg">
      <path d="M16 2L26 6V26L16 30L6 26V6L16 2Z" stroke="#FA7343" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 10L24 14V18L16 22L8 18V14L16 10Z" stroke="#FA7343" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="3" fill="#FA7343"/>
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000.svg">
      <ellipse cx="16" cy="6" rx="12" ry="3" stroke="#336791" strokeWidth="2.5"/>
      <path d="M4 6C4 10 16 14 16 14S28 10 28 6" stroke="#336791" strokeWidth="2.5"/>
      <path d="M4 6V22C4 26 16 30 16 30S28 26 28 22V6" stroke="#336791" strokeWidth="2.5"/>
      <ellipse cx="16" cy="28" rx="12" ry="4" stroke="#336791" strokeWidth="2.5"/>
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000.svg">
      <path d="M6 10L8 6H24L26 10V22L24 26H8L6 22V10Z" stroke="#2496ED" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M10 10V22M14 10V22M18 10V22" stroke="#2496ED" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 14L26 14" stroke="#2496ED" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
    </svg>
  ),
  git: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000.svg">
      <circle cx="8" cy="8" r="3" fill="#F05032"/>
      <circle cx="24" cy="24" r="3" fill="#F05032"/>
      <path d="M11 8C11 12 16 16 16 16S21 12 21 8" stroke="#F05032" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M11 24C11 20 16 16 16 16S21 20 21 24" stroke="#F05032" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  vscode: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000.svg">
      <path d="M2 8L14 2L26 8L14 28L2 8Z" stroke="#007ACC" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M14 2V28M14 2L2 8M14 2L26 8" stroke="#007ACC" strokeWidth="2" strokeLinecap="round"/>
      <rect x="6" y="14" width="16" height="10" rx="2" stroke="#007ACC" strokeWidth="2"/>
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000.svg">
      <rect x="4" y="4" width="10" height="10" rx="2" fill="#F24E1E"/>
      <rect x="18" y="4" width="10" height="10" rx="2" fill="#0ACF83"/>
      <rect x="4" y="18" width="10" height="10" rx="2" fill="#00A8FF"/>
      <rect x="18" y="18" width="10" height="10" rx="2" fill="#FFD700"/>
    </svg>
  ),
};

export function LanguageLogo({
  name,
  size = 32,
  className,
  animated = false
}: {
  name: keyof typeof languageLogos;
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const logo = languageLogos[name];

  if (!logo) return null;

  const Component = animated ? motion.div : 'div';

  return (
    <Component
      className={cn("inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      animate={animated ? { scale: [1, 1.1, 1] } : undefined}
      transition={animated ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
      initial={false}
    >
      {logo}
    </Component>
  );
}

export function LanguageLogoStack({
  languages = ["typescript", "react", "nextjs", "tailwind", "python", "rust", "go", "docker", "postgresql", "git", "vscode", "figma"],
  size = 40,
  className,
  maxVisible = 8
}: {
  languages?: (keyof typeof languageLogos)[];
  size?: number;
  className?: string;
  maxVisible?: number;
}) {
  const visible = languages.slice(0, maxVisible);
  const remaining = languages.length - maxVisible;

  return (
    <div className={cn("flex items-center gap-2 -ml-1", className)}>
      {visible.map((lang, i) => (
        <motion.div
          key={lang}
          style={{ zIndex: visible.length - i }}
          className="relative"
          whileHover={{ scale: 1.15, zIndex: 100, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <LanguageLogo name={lang} size={size} />
        </motion.div>
      ))}
      {remaining > 0 && (
        <motion.div
          className="relative ml-1"
          whileHover={{ scale: 1.15, zIndex: 100, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="flex items-center justify-center rounded-lg border border-border bg-muted/50 font-sans text-xs font-medium text-muted-foreground"
            style={{ width: size, height: size }}
          >
            +{remaining}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function LanguageLogoCloud({
  languages = ["typescript", "javascript", "python", "rust", "go", "swift", "react", "nextjs", "tailwind", "docker", "postgresql", "git", "vscode", "figma", "nodejs"],
  className
}: {
  languages?: (keyof typeof languageLogos)[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {languages.map((lang, i) => (
        <motion.div
          key={lang}
          className="group"
          style={{ animationDelay: `${i * 0.1}s` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
          whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0], transition: { duration: 0.3 } }}
        >
          <LanguageLogo name={lang} size={48} animated={false} />
        </motion.div>
      ))}
    </div>
  );
}