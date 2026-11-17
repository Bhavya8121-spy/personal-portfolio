"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeTypingProps {
  code: string;
  language?: string;
  speed?: number;
  startDelay?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
}

export function CodeTyping({
  code,
  language = "typescript",
  speed = 30,
  startDelay = 0,
  loop = false,
  className,
  showCursor = true,
}: CodeTypingProps) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const runTyping = async () => {
      await new Promise((resolve) => setTimeout(resolve, startDelay));

      const typeNextChar = () => {
        if (indexRef.current < code.length) {
          setDisplayedCode(code.slice(0, indexRef.current + 1));
          indexRef.current++;
          timeoutRef.current = setTimeout(typeNextChar, speed + Math.random() * 50);
        } else {
          setIsComplete(true);
          if (loop) {
            setTimeout(() => {
              indexRef.current = 0;
              setDisplayedCode("");
              setIsComplete(false);
              typeNextChar();
            }, 2000);
          }
        }
      };

      typeNextChar();
    };

    runTyping();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [code, speed, startDelay, loop]);

  // Blinking cursor
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [showCursor]);

  const lines = displayedCode.split("\n");

  return (
    <div className={cn("font-mono text-sm leading-relaxed overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="font-sans text-xs text-muted-foreground ml-4">{language}</span>
      </div>
      <pre className="p-4 bg-background overflow-x-auto">
        <code className="text-foreground">
          {lines.map((line, i) => (
            <div key={i} className="relative">
              <span className="text-muted-foreground/40 mr-4 select-none w-6 text-right inline-block">{i + 1}</span>
              <span>{line}</span>
              {i === lines.length - 1 && isComplete && showCursor && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-1"
                >
                  ▋
                </motion.span>
              )}
              <br />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div className={cn("font-mono text-sm leading-relaxed overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          {filename && (
            <span className="font-sans text-xs text-muted-foreground ml-2">{filename}</span>
          )}
        </div>
        <span className="font-sans text-xs text-muted-foreground">{language}</span>
      </div>
      <pre className="p-4 bg-background overflow-x-auto">
        <code className="text-foreground">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "relative",
                highlightLines.includes(i + 1) && "bg-accent/10"
              )}
            >
              <span className="text-muted-foreground/40 mr-4 select-none w-6 text-right inline-block">{i + 1}</span>
              <span>{line}</span>
              <br />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// Sample code snippets for the typing animation
export const CODE_SNIPPETS = {
  hello: `function greet(name: string) {
  console.log(\`Hey, I'm \${name}.\`);
  console.log("A curious mind who enjoys building things.");
}

greet("Alex");`,

  mindful: `// Mindful Moments - A gentle reminder app
interface Reminder {
  id: string;
  time: Date;
  message: string;
}

function scheduleReminders(window: TimeWindow) {
  const reminders = generateGentleNudges(window);

  reminders.forEach((reminder) => {
    // No streaks. No badges. No guilt.
    // Just a quiet tap on the shoulder.
    scheduleLocalNotification(reminder);
  });
}`,

  campus: `// Campus Roots - Mapping native plants
interface PlantEntry {
  species: string;
  location: Coordinates;
  observer: string;
  notes: string;
  season: Season;
}

function addObservation(entry: PlantEntry) {
  // Students documenting flora
  // Groundskeepers adding history
  // Professors using in labs
  // A living archive, growing each semester
  return database.insert("plants", entry);
}`,

  weekly: `// Weekly Rhythm - A reflection practice
const questions = [
  "What gave me energy this week?",
  "What drained me?",
  "What did I learn?",
  "What matters next week?"
];

function sundayReflection() {
  // No app. No notifications.
  // Just a notebook, a pen, and honesty.
  return questions.map((q) => answerHonestly(q));
}`,

  now: `// Current focus (auto-updated)
const now = {
  workingOn: [
    "Senior capstone: research data platform",
    "Campus Roots v2: offline-first mobile app"
  ],
  learning: ["Rust", "Japanese (N5)"],
  reading: ["The Creative Act", "Braiding Sweetgrass"],
  exploring: ["Local-first software", "Analog photography"],
  excitedAbout: ["Graduation (May 2025)", "Smokies hiking trip"]
};

// This page makes the website feel alive.`,

  focus: `// Focus Friend - Menu bar timer
struct FocusSession {
  duration: TimeInterval
  startDate: Date
  endDate: Date
  gentleChime: Sound
}

func startSession(_ duration: TimeInterval) {
  // Lives in menu bar. No dock icon. No window.
  // Just a countdown and a bowl tone when done.
  timer = Timer.scheduledTimer(
    timeInterval: duration,
    target: self,
    selector: #selector(chime),
    userInfo: nil,
    repeats: false
  )
}`}