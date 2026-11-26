"use client";

import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { getNowItems, categoryLabels, categoryOrder, getLastUpdated } from "@/content/now";
import { BookOpen, Lightbulb, Compass, Sparkles, CheckCircle } from "lucide-react";
import { MicrobotSwarm } from "@/components/microbot-swarm";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "working-on": CheckCircle,
  "learning": Lightbulb,
  "reading": BookOpen,
  "exploring": Compass,
  "excited-about": Sparkles,
};

const categoryColors: Record<string, string> = {
  "working-on": "bg-blue-900/30 text-blue-300",
  "learning": "bg-purple-900/30 text-purple-300",
  "reading": "bg-green-900/30 text-green-300",
  "exploring": "bg-orange-900/30 text-orange-300",
  "excited-about": "bg-pink-900/30 text-pink-300",
};

export default function NowPage() {
  const items = getNowItems();
  const lastUpdated = getLastUpdated();

  return (
    <div className="min-h-screen">
      {/* Microbot swarm - hero */}
      <section className="relative overflow-hidden px-6 pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <MicrobotSwarm className="h-[520px] md:h-[620px] lg:h-[700px]" />
        </div>
      </section>

      {/* Now Content */}
      <section className="py-20 px-6 md:py-32">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="mb-16">
            <span className="font-mono text-xs font-medium text-accent uppercase tracking-[0.18em]">
              Now
            </span>
            <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground mt-4 text-balance">
              Recent project activity
            </h1>
            <p className="font-sans text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
              A snapshot of recent updates across my public GitHub projects.
            </p>
            <p className="font-sans text-sm text-muted-foreground mt-4">
              Latest repository update {lastUpdated}
            </p>
          </ScrollReveal>

          {categoryOrder.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            const Icon = categoryIcons[category];
            const colorClass = categoryColors[category];

            if (categoryItems.length === 0) return null;

            return (
              <StaggerContainer key={category} staggerDelay={0.08} className="mb-16">
                <ScrollReveal className="mb-8 flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${colorClass}`}>
                    {categoryLabels[category]}
                  </div>
                  <div className="h-px w-full bg-border" />
                </ScrollReveal>
                {categoryItems.map((item, index) => (
                  <StaggerItem key={item.id} delay={index * 0.03}>
                    <ScrollReveal delay={index * 0.05}>
                      <motion.div
                        className="bg-card border border-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-accent/50"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-medium text-xl text-foreground mb-2">
                              {item.title}
                            </h3>
                            <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                              {item.description}
                            </p>
                            <time dateTime={item.updatedAt} className="font-sans text-xs text-muted-foreground/70">
                              Updated {formatDate(item.updatedAt)}
                            </time>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-3 font-sans text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                              >
                                View on GitHub
                                <motion.span
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  →
                                </motion.span>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </ScrollReveal>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            );
          })}

        </div>
      </section>
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}