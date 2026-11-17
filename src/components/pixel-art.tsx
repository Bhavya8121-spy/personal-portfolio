"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const computerScreenCode = [
  { text: "const curiosity = () =>", opacity: 0.9, indent: 0 },
  { text: "explore();", opacity: 0.7, indent: 16 },
  { text: "build();", opacity: 0.7, indent: 16 },
  { text: "learn();", opacity: 0.7, indent: 16 },
  { text: "while (growing) {", opacity: 0.5, indent: 0, marginTop: 16 },
  { text: "create();", opacity: 0.5, indent: 16 },
  { text: "}", opacity: 0.5, indent: 16 },
];

const laptopScreenCode = [
  { text: "vim main.rs", opacity: 0.9, indent: 0 },
  { text: "fn main() {", opacity: 0.7, indent: 0, marginTop: 8 },
  { text: "println!(\"Hello\");", opacity: 0.7, indent: 16 },
  { text: "}", opacity: 0.7, indent: 16 },
];

const terminalLines = [
  { text: "alex@portfolio:~$ ", color: "#e6edf3", bold: false },
  { text: "whoami", color: "#58a6ff", bold: false },
  { text: "", color: "#e6edf3", bold: false },
  { text: "Alex Chen", color: "#e6edf3", bold: false },
  { text: "Computer Science @ Vanderbilt", color: "#e6edf3", bold: false },
  { text: "Curious mind • Builder • Learner", color: "#e6edf3", bold: false },
  { text: "", color: "#e6edf3", bold: false },
  { text: "alex@portfolio:~$ ", color: "#e6edf3", bold: false },
  { text: "projects", color: "#58a6ff", bold: false },
  { text: "📱 mindful-moments — Gentle reminder app", color: "#8b949e", bold: false },
  { text: "🌿 campus-roots — Campus flora mapping", color: "#8b949e", bold: false },
  { text: "🔬 ink-to-code — Wireframes → React", color: "#8b949e", bold: false },
  { text: "📓 weekly-rhythm — Reflection practice", color: "#8b949e", bold: false },
  { text: "⌨️ focus-friend — Menu bar timer", color: "#8b949e", bold: false },
  { text: "alex@portfolio:~$ ", color: "#e6edf3", bold: false, showCursor: true },
];

function CodeLine({ text, opacity = 1, indent = 0, marginTop = 0, color, bold = false, showCursor = false }: {
  text: string;
  opacity?: number;
  indent?: number;
  marginTop?: number;
  color?: string;
  bold?: boolean;
  showCursor?: boolean;
}) {
  return (
    <div
      style={{
        opacity,
        marginLeft: indent,
        marginTop,
        color: color || "inherit",
        fontWeight: bold ? 600 : 400,
        whiteSpace: "pre",
      }}
    >
      {text}
      {showCursor && (
        <motion.span
          className="cursor-blink"
          style={{ color: "#2563EB" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          █
        </motion.span>
      )}
    </div>
  );
}

function ComputerScreen() {
  return (
    <div className="absolute inset-0 p-4 font-mono text-xs" style={{ lineHeight: 1.6 }}>
      {computerScreenCode.map((line, i) => (
        <CodeLine key={i} {...line} />
      ))}
    </div>
  );
}

function LaptopScreen() {
  return (
    <div className="absolute inset-0 p-4 font-mono text-xs" style={{ lineHeight: 1.6 }}>
      {laptopScreenCode.map((line, i) => (
        <CodeLine key={i} {...line} />
      ))}
    </div>
  );
}

function TerminalScreen({ color = "#2563EB" }: { color?: string }) {
  return (
    <div className="absolute inset-0 p-4 font-mono" style={{ fontSize: "13px", lineHeight: 1.7, color: "#e6edf3", overflow: "hidden" }}>
      {terminalLines.map((line, i) => (
        <CodeLine key={i} {...line} color={line.color} />
      ))}
      <style jsx>{`
        .cursor-blink {
          display: inline-block;
          width: 8px;
          height: 1.2em;
          background: currentColor;
          animation: blink 1s infinite;
          vertical-align: text-bottom;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function PixelComputer({
  className,
  color = "#2563EB",
  size = 120,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}) {
  const s = size / 120;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={animated ? { y: [0, -8, 0] } : undefined}
      transition={animated ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
      initial={false}
    >
      {/* Monitor */}
      <div style={{ transform: `scale(${s})` }}>
        {/* Screen */}
        <div
          className="relative"
          style={{
            width: 100 * s,
            height: 68 * s,
            background: `linear-gradient(180deg, ${color}15, ${color}05)`,
            border: `3px solid ${color}`,
            borderRadius: `8px`,
            boxShadow: `inset 0 0 20px ${color}30, 0 10px 30px -10px ${color}40`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${color}10, ${color}10 1px, transparent 1px, transparent 3px)`,
              opacity: 0.3,
            }}
          />
          {/* Code on screen */}
          <ComputerScreen />
          {/* Blinking cursor */}
          <motion.div
            className="absolute"
            style={{ bottom: 12 * s, left: 68 * s, width: 8 * s, height: 14 * s, background: color }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* Stand */}
        <div
          style={{
            width: 24 * s,
            height: 8 * s,
            background: color,
            borderRadius: "4px 4px 0 0",
            margin: `${4 * s} auto 0`,
            boxShadow: `0 4px 10px ${color}40`,
          }}
        />
        <div
          style={{
            width: 40 * s,
            height: 6 * s,
            background: color,
            borderRadius: "0 0 4px 4px",
            margin: "0 auto",
            boxShadow: `0 4px 15px ${color}40`,
          }}
        />
      </div>
    </motion.div>
  );
}

export function PixelLaptop({
  className,
  color = "#2563EB",
  size = 120,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}) {
  const s = size / 120;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={animated ? { rotate: [0, 2, -2, 0] } : undefined}
      transition={animated ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      initial={false}
    >
      <div style={{ transform: `scale(${s})` }}>
        {/* Screen */}
        <div
          style={{
            width: 104 * s,
            height: 66 * s,
            background: `linear-gradient(180deg, ${color}15, ${color}05)`,
            border: `3px solid ${color}`,
            borderRadius: `6px`,
            position: "relative",
            overflow: "hidden",
            boxShadow: `inset 0 0 20px ${color}30, 0 8px 25px -8px ${color}40`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${color}10, ${color}10 1px, transparent 1px, transparent 3px)`,
              opacity: 0.2,
            }}
          />
          <LaptopScreen />
        </div>

        {/* Keyboard base */}
        <div
          style={{
            width: 112 * s,
            height: 20 * s,
            background: "#1a1a2e",
            border: `3px solid ${color}`,
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            marginTop: `${4 * s}`,
            position: "relative",
            boxShadow: `0 10px 30px -10px ${color}40`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 4 * s,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40 * s,
              height: 4 * s,
              background: color,
              borderRadius: "2px",
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function PixelPhone({
  className,
  color = "#2563EB",
  size = 80,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}) {
  const s = size / 80;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={animated ? { y: [0, -6, 0], rotate: [0, 3, -3, 0] } : undefined}
      transition={animated ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      initial={false}
    >
      <div style={{ transform: `scale(${s})` }}>
        <div
          style={{
            width: 40 * s,
            height: 74 * s,
            background: "#0d1117",
            border: `3px solid ${color}`,
            borderRadius: `20px`,
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 10px 30px -10px ${color}50, inset 0 0 20px ${color}20`,
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 16 * s,
              height: 6 * s,
              background: "#0d1117",
              borderBottomLeftRadius: `8px`,
              borderBottomRightRadius: `8px`,
            }}
          />
          <div
            className="absolute inset-0 p-3 font-mono text-[10px]"
            style={{ color, lineHeight: 1.7 }}
          >
            <div style={{ opacity: 0.5, textAlign: "center", marginBottom: 8 }}>10:42</div>
            <div style={{ opacity: 0.9, fontWeight: 600, textAlign: "center" }}>Mindful</div>
            <div style={{ opacity: 0.9, fontWeight: 600, textAlign: "center" }}>Moments</div>
            <div style={{ opacity: 0.4, textAlign: "center", marginTop: 16, fontSize: "9px" }}>Breathe. Pause. Reset.</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PixelKeyboard({
  className,
  color = "#2563EB",
  size = 140,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}) {
  const s = size / 140;

  const keyRows = [
    ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace"],
    ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
    ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"],
    ["ctrl", "alt", "space", "alt", "ctrl"],
  ];

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size * 0.4 }}
      animate={animated ? { y: [0, -4, 0] } : undefined}
      transition={animated ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      initial={false}
    >
      <div style={{ transform: `scale(${s})` }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#1a1a2e",
            border: `3px solid ${color}`,
            borderRadius: "12px",
            position: "relative",
            boxShadow: `0 10px 30px -10px ${color}40, inset 0 0 30px ${color}10`,
          }}
        >
          {/* Key rows */}
          <div className="absolute inset-0 p-3" style={{ pointerEvents: "none" }}>
            {keyRows.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: "flex", gap: "3px", marginBottom: "3px" }}>
                {row.map((k, keyIndex) => {
                  let width = "28px";
                  if (k === "backspace" || k === "enter") width = "44px";
                  else if (k === "tab") width = "40px";
                  else if (k === "\\") width = "32px";
                  else if (k === "caps") width = "44px";
                  else if (k === "shift") width = "56px";
                  else if (k === "ctrl" || k === "alt") width = "56px";
                  else if (k === "space") width = "124px";

                  // Stable pseudo-random delay based on key position
                  const seed = rowIndex * 100 + keyIndex;
                  const delay = ((seed * 1664525 + 1013904223) % 4294967296) / 4294967296 * 2;

                  return (
                    <motion.kbd
                      key={k}
                      style={{
                        width,
                        height: "28px",
                        background: "#252540",
                        border: `1px solid ${color}40`,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "7px",
                        color,
                        opacity: 0.6,
                      }}
                      animate={k === "esc" || k === "f1" || k === "space" ? { backgroundColor: ["#252540", color, "#252540"] } : undefined}
                      transition={{ duration: 3, repeat: Infinity, delay }}
                    >
                      {k === "space" ? " " : k}
                    </motion.kbd>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PixelTerminal({
  className,
  color = "#2563EB",
  size = 200,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}) {
  const s = size / 200;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size * 0.6 }}
      initial={false}
    >
      <div style={{ transform: `scale(${s})` }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#0d1117",
            border: `3px solid ${color}`,
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 15px 40px -15px ${color}50, inset 0 0 40px ${color}15`,
          }}
        >
          {/* Title bar */}
          <div
            style={{
              height: 36 * s,
              background: "#161b22",
              borderBottom: `2px solid ${color}40`,
              display: "flex",
              alignItems: "center",
              padding: `0 ${12 * s}px`,
              gap: "8px",
            }}
          >
            <div
              style={{
                width: 12 * s,
                height: 12 * s,
                borderRadius: "50%",
                background: "#ff5f57",
                boxShadow: "0 0 10px #ff5f5780",
              }}
            />
            <div
              style={{
                width: 12 * s,
                height: 12 * s,
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: 12 * s,
                height: 12 * s,
                borderRadius: "50%",
                background: "#28ca42",
              }}
            />
            <div
              style={{
                marginLeft: "auto",
                fontSize: `${11 * s}px`,
                color: "#8b949e",
                fontFamily: "monospace",
              }}
            >
              alex@portfolio:~$
            </div>
          </div>

          {/* Terminal content */}
          <TerminalScreen color={color} />
        </div>
      </div>
    </motion.div>
  );
}

export function PixelTools({
  className,
  color = "#2563EB"
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
      <PixelComputer color={color} size={100} />
      <PixelLaptop color={color} size={100} />
      <PixelPhone color={color} size={70} />
    </div>
  );
}