"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, X, ChevronDown, Sparkles, Terminal, BookOpen, Lightbulb, Heart, Code } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatSuggestion {
  id: string;
  label: string;
  query: string;
  icon: React.ReactNode;
}

const SUGGESTIONS: Record<string, ChatSuggestion[]> = {
  about: [
    { id: "1", label: "What drives you?", query: "What motivates you to create things?", icon: <Heart className="w-4 h-4" /> },
    { id: "2", label: "Your background", query: "Tell me about your journey to CS", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "3", label: "Current interests", query: "What are you exploring right now?", icon: <Sparkles className="w-4 h-4" /> },
    { id: "4", label: "Perfect Sunday", query: "Describe your ideal Sunday", icon: <BookOpen className="w-4 h-4" /> },
  ],
  projects: [
    { id: "1", label: "Mindful Moments", query: "Tell me about Mindful Moments", icon: <Terminal className="w-4 h-4" /> },
    { id: "2", label: "Campus Roots", query: "How did Campus Roots start?", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "3", label: "Ink to Code", query: "What was the Ink to Code experiment?", icon: <Code className="w-4 h-4" /> },
    { id: "4", label: "All projects", query: "Show me all your projects", icon: <Sparkles className="w-4 h-4" /> },
  ],
  writing: [
    { id: "1", label: "Learning to Pause", query: "Summarize 'Learning to Pause'", icon: <BookOpen className="w-4 h-4" /> },
    { id: "2", label: "Building for Myself", query: "What's 'Building for Myself First' about?", icon: <Heart className="w-4 h-4" /> },
    { id: "3", label: "Arboretum Walks", query: "Tell me about the arboretum walks", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "4", label: "Reading list", query: "What are you reading lately?", icon: <Sparkles className="w-4 h-4" /> },
  ],
  now: [
    { id: "1", label: "Current focus", query: "What are you working on right now?", icon: <Terminal className="w-4 h-4" /> },
    { id: "2", label: "Learning Rust", query: "How's Rust going?", icon: <Code className="w-4 h-4" /> },
    { id: "3", label: "Reading", query: "What books are you reading?", icon: <BookOpen className="w-4 h-4" /> },
    { id: "4", label: "Excited about", query: "What are you excited about?", icon: <Sparkles className="w-4 h-4" /> },
  ],
  default: [
    { id: "1", label: "Who are you?", query: "Tell me about yourself", icon: <Heart className="w-4 h-4" /> },
    { id: "2", label: "Projects", query: "What have you built?", icon: <Terminal className="w-4 h-4" /> },
    { id: "3", label: "Writing", query: "What do you write about?", icon: <BookOpen className="w-4 h-4" /> },
    { id: "4", label: "Now", query: "What are you up to?", icon: <Sparkles className="w-4 h-4" /> },
  ],
};

const RESPONSES: Record<string, string[]> = {
  "who are you": [
    "I'm Alex Chen, a CS student at Vanderbilt. I build things because I want them to exist — not for resumes, but because the act of making helps me understand the world better.",
    "I'm the person who stops to learn the name of a tree on campus, then builds an app so others can too. I'm the one who writes Sunday reflections instead of scrolling. I'm curious, and I try to let that curiosity lead."
  ],
  "what drives you": [
    "Personal frustration, mostly. Mindful Moments exists because every meditation app felt like a guilt trip. Campus Roots started because I couldn't name the trees I walked past daily. The best projects solve your own problem first — then you discover others have it too.",
    "There's a particular satisfaction in making something that didn't exist before. Not for users, not for metrics — just because the idea wouldn't leave you alone. That's the only motivation that sustains."
  ],
  "mindful moments": [
    "Mindful Moments began as a personal need — I'd go hours without a conscious breath. Every meditation app had streaks, badges, 'don't break your chain!' I just wanted a quiet nudge to pause. So I built one. No streaks. No guilt. Just gentle reminders.",
    "A few hundred people use it now — mostly friends and students. The feedback that matters isn't about features. It's messages like 'this made my Tuesday better' or 'I didn't realize how much I needed this.' That's the metric."
  ],
  "campus roots": [
    "It started with a walk through the arboretum. I realized I couldn't name a single tree. That disconnect — from the place I live, from the history in its soil — stuck with me. Now 200+ species are documented, professors use it in labs, groundskeepers add historical notes. It's a living archive.",
    "The best technology here isn't the map or database — it's how it brings people together around something tangible and living. Students document, biology students review, groundskeepers add history. It's community infrastructure disguised as software."
  ],
  "ink to code": [
    "I love sketching interfaces on paper. There's a freedom in pen that no digital tool replicates. Ink to Code was a weekend experiment: photograph a wireframe, get React code. It worked... sort of. The hard part wasn't detection — it was ambiguity. A rectangle could be a card, modal, input, nav. Context matters.",
    "The project taught me more about the gap between human intention and machine interpretation than any course. Some frictions are valuable — the translation from sketch to code is where design thinking happens. Automating it entirely might lose something essential."
  ],
  "projects": [
    "I've built: Mindful Moments (gentle reminder app), Campus Roots (campus flora mapping), Ink to Code (wireframes→React), Weekly Rhythm (reflection practice), Focus Friend (menu-bar timer). Each started as a personal frustration or curiosity, not a resume item."
  ],
  "writing": [
    "I write to think, not just communicate. Essays on pausing, building for yourself, arboretum walks, reading lists. The writing section is as much for me as for you — it's where I work through ideas that won't leave me alone."
  ],
  "now": [
    "Right now: Senior capstone (research data platform), Campus Roots v2 (offline-first), learning Rust and Japanese, reading The Creative Act and Braiding Sweetgrass, exploring local-first software and analog photography. Excited for graduation and a Smokies hiking trip."
  ],
  "learning to pause": [
    "\"Learning to Pause\" is about the strange discomfort of doing nothing — sitting without phone, podcast, agenda — and why that discomfort might be the most productive thing you can do. It's about the voice that says you should be working, and what happens when you stop listening to it."
  ],
  "building for myself": [
    "\"Building for Myself First\" argues that the best projects start as selfish acts. When you build for an imagined audience, you compromise. When the only user is you, every decision is simple: does this serve the purpose? The paradox: building for yourself often creates something more valuable for others."
  ],
  "arboretum": [
    "The arboretum walks started as a biology requirement. Week one: I wrote 'Large tree. Rough bark. Green leaves.' My TA asked 'What do you notice about the leaves?' I looked. Really looked. Week by week, I learned to see — not generalize. This specific tree, this specific light, the moss only on the north side. Attention isn't talent. It's practice."
  ],
  "default": [
    "That's a great question. I'm Alex — CS student at Vanderbilt, builder of things like Mindful Moments and Campus Roots, writer of essays about pausing and paying attention. What specifically would you like to know?",
    "I'd love to help! You can ask me about my projects, writing, what I'm currently up to, or anything else. Try clicking one of the suggestions above, or type your own question."
  ]
};

function findResponse(query: string): string {
  const lower = query.toLowerCase();

  for (const [key, responses] of Object.entries(RESPONSES)) {
    if (key !== "default" && lower.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  const defaults = RESPONSES.default;
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function Chatbox({
  page = "default",
  className,
  title = "Ask me anything",
  subtitle = "I'll answer about my projects, writing, or whatever's on your mind",
}: {
  page?: keyof typeof SUGGESTIONS | "default";
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>(SUGGESTIONS[page] || SUGGESTIONS.default);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = findResponse(messageText);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    handleSend(suggestion.query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <motion.div
      className={cn("fixed bottom-6 right-6 z-50 w-full max-w-md", className)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Minimized state */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="minimized"
            onClick={toggleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-xl flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open chat"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="expanded"
            className="flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ width: "100%", maxHeight: "60vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
              <div>
                <h3 className="font-display font-medium text-foreground">{title}</h3>
                <p className="font-sans text-xs text-muted-foreground">{subtitle}</p>
              </div>
              <motion.button
                onClick={toggleOpen}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  className="p-4 border-b border-border"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="font-sans text-xs text-muted-foreground mb-3">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-muted border border-border rounded-full font-sans text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all whitespace-nowrap"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * suggestions.indexOf(suggestion) }}
                      >
                        <span className="flex items-center gap-1.5">
                          {suggestion.icon}
                          {suggestion.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[40vh]">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl",
                        message.role === "user"
                          ? "bg-accent text-accent-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      )}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <time className={cn(
                        "block text-xs mt-1 text-right opacity-60",
                        message.role === "user" ? "text-accent-foreground/70" : "text-muted-foreground"
                      )} dateTime={message.timestamp.toISOString()}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </motion.div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    key="typing"
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-xs text-muted-foreground">Alex is thinking</span>
                        <motion.span
                          className="w-1.5 h-1.5 bg-accent rounded-full"
                          animate={{ scale: [1, 0.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 bg-accent rounded-full"
                          animate={{ scale: [1, 0.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 bg-accent rounded-full"
                          animate={{ scale: [1, 0.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-muted/30">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none min-h-[44px] max-h-32"
                    rows={1}
                    disabled={isTyping}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}