"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TerminalLine {
  id: number;
  type: "input" | "output" | "prompt";
  content: string;
  isTyping?: boolean;
}

const QUICK_COMMANDS = [
  { cmd: "home", desc: "Go to main page", action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`) },
  { cmd: "scroll", desc: "Scroll down to explore", action: () => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }) },
  { cmd: "contact", desc: "Go to contact page", action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/contact`) },
  { cmd: "projects", desc: "View projects", action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/projects`) },
  { cmd: "about", desc: "Read about me", action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/about`) },
  { cmd: "now", desc: "What I'm up to", action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/now`) },
  { cmd: "help", desc: "Show available commands", action: null },
];

const HELP_OUTPUT = [
  "Available commands:",
  "",
  "  home      - Go to main page",
  "  scroll    - Scroll down to explore",
  "  contact   - Go to contact page",
  "  projects  - View my projects",
  "  about     - Read about me",
  "  now       - What I'm up to",
  "  clear     - Clear terminal",
  "  help      - Show this help",
];

const COMMANDS: Record<string, { output: string[], action?: () => void }> = {
  help: { output: HELP_OUTPUT },
  home: { output: ["Navigating to home..."], action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`) },
  scroll: { output: ["Scrolling down..."], action: () => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }) },
  contact: { output: ["Opening contact page..."], action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/contact`) },
  projects: { output: ["Loading projects..."], action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/projects`) },
  about: { output: ["Loading about page..."], action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/about`) },
  now: { output: ["Loading now page..."], action: () => window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/now`) },
  clear: { output: [], action: () => {} },
};

export function InteractiveTerminal({
  className,
  autoRun = "help",
}: {
  className?: string;
  autoRun?: string;
}) {
  const [lines, setLines] = useState<Array<{ id: number; type: "input" | "output"; content: string; isTyping?: boolean }>>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandCounter = useRef(0);

  const addLine = useCallback((line: { type: "input" | "output"; content: string; isTyping?: boolean }) => {
    setLines((prev) => [...prev, { ...line, id: Date.now() + Math.random() }]);
  }, []);

  const typeLines = useCallback(
    async (outputLines: string[], delay = 20) => {
      for (const line of outputLines) {
        if (line === "") {
          addLine({ type: "output", content: "" });
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        addLine({ type: "output", content: line, isTyping: true });
        await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * 30));
        // Update the last line to remove typing animation
        setLines((prev) => prev.map((l, i) => i === prev.length - 1 ? { ...l, isTyping: false } : l));
      }
    },
    []
  );

  const executeCommand = useCallback(
    async (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (!trimmed) return;

      addLine({ type: "input", content: `bhavya@portfolio:~$ ${cmd}` });
      setHistory((prev) => [...prev.slice(-50), cmd]);
      setHistoryIndex(-1);
      setInput("");

      const command = trimmed.split(" ")[0];
      const args = trimmed.split(" ").slice(1);

      if (COMMANDS[command]) {
        const { output, action } = COMMANDS[command];
        if (output.length > 0) {
          await typeLines(output);
        }
        if (action) {
          action();
        }
      } else if (command === "clear") {
        setLines([]);
      } else {
        await typeLines([
          `command not found: ${command}`,
          "Type 'help' for available commands",
        ]);
      }
    }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!isProcessing) {
        executeCommand(input);
      }
    }
  };

  // Auto-run initial command
  useEffect(() => {
    if (autoRun && lines.length === 0) {
      executeCommand(autoRun);
    }
  }, [autoRun, lines.length]);

  return (
    <div
      className={cn(
        "font-mono text-sm bg-[#0d1117] border border-[var(--border)] rounded-xl overflow-hidden",
        className
      )}
      onClick={() => document.activeElement instanceof HTMLInputElement || inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--muted)]/50 border-b border-[var(--border)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="font-sans text-xs text-[var(--muted)] ml-4">terminal</span>
        <span className="font-sans text-xs text-[var(--muted)]/50 ml-auto">Tab to complete • Click to focus</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 h-[400px] overflow-y-auto">
        <div className="space-y-1">
          {lines.map((line) => (
            <div
              key={line.id}
              className={cn(
                "whitespace-pre-wrap break-all transition-opacity",
                line.type === "input" && "text-green-400",
                line.type === "output" && "text-[var(--muted)]",
                line.isTyping && "animate-pulse"
              )}
            >
              {line.content}
            </div>
          ))}
        </div>

        {/* Input line */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-green-400 whitespace-nowrap">bhavya@portfolio:~$</span>
          <input
            ref={(el) => { inputRef.current = el; }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white caret-[var(--accent)]"
            placeholder={isProcessing ? "Processing..." : "Type 'help' for commands..."}
            disabled={isProcessing}
            spellCheck={false}
            autoComplete="off"
          />
          <span className="text-[var(--accent)] animate-pulse">▋</span>
        </div>
      </div>
    </div>
  );
}