"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem, FadeIn, SlideUp } from "@/components/animations";
import { StackedWaveforms } from "@/components/stacked-waveforms";

const aboutSections = [
  {
    title: "Education",
    content: "I am pursuing a B.S. in Computer Science at Vanderbilt University in Nashville, Tennessee. My GPA is 4.0 and I expect to graduate in May 2028."
  },
  {
    title: "What I build",
    content: "My projects cover AI agent authorization, real-time logging, and offline document search. I also build applications that turn unstructured inputs, such as bank statements and academic reports, into information people can use."
  },
  {
    title: "Technical skills",
    content: "I work with Python, C++, JavaScript, React, Flask, PostgreSQL, and Docker. My AI projects use tools such as Ollama, ChromaDB, vector embeddings, and the Gemini API."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Exploration Section with Stacked Waveforms */}
      <section className="py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-16 border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Stacked Particle Waveforms */}
            <div className="relative">
              <div className="relative h-72 md:h-96 max-w-md mx-auto">
                <StackedWaveforms />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center">
                  <p className="font-sans text-xs text-muted-foreground">
                    Move across the waves to scatter the particles
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Personal Statement */}
            <div className="lg:pl-8">
              <StaggerContainer staggerDelay={0.1}>
                <StaggerItem delay={0}>
                  <FadeIn delay={0.1} className="mb-4">
                    <span className="font-sans text-sm font-medium text-[var(--accent)] uppercase tracking-wider">
                      02 / Exploration
                    </span>
                  </FadeIn>
                </StaggerItem>

                <StaggerItem delay={1}>
                  <SlideUp delay={0.2} distance={20} className="mb-6">
                    <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] text-balance">
                      Curiosity as a compass.
                    </h2>
                  </SlideUp>
                </StaggerItem>

                <StaggerItem delay={2}>
                  <SlideUp delay={0.3} distance={16} className="mb-8 max-w-lg">
                    <p className="font-sans text-base md:text-lg text-[var(--muted)] leading-relaxed">
                      I build software that helps people make sense of complex systems and data.
                    </p>
                  </SlideUp>
                </StaggerItem>

                <StaggerItem delay={3}>
                  <SlideUp delay={0.4} distance={16} className="mb-8 max-w-lg">
                    <p className="font-sans text-base md:text-lg text-[var(--muted)] leading-relaxed">
                      My project work spans AI reliability, real-time observability, and local document retrieval.
                    </p>
                  </SlideUp>
                </StaggerItem>

                <StaggerItem delay={4}>
                  <SlideUp delay={0.5} distance={16} className="flex items-center gap-4">
                    <Link href="/projects" className="inline-flex items-center gap-2 px-7 py-2.5 border border-[var(--border)] rounded-full font-sans font-medium text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all">
                      Explore my work
                    </Link>
                    <Link href="/now" className="inline-flex items-center gap-2 px-7 py-2.5 border border-[var(--border)] rounded-full font-sans font-medium text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all">
                      What I&apos;m up to
                    </Link>
                  </SlideUp>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* About Sections */}
      <section className="py-20 px-6 md:py-32">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="mb-16 text-center">
            <span className="font-sans text-sm font-medium text-[var(--accent)] uppercase tracking-wider">
              About
            </span>
            <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-[var(--foreground)] mt-4 text-balance">
              About me
            </h1>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1}>
            {aboutSections.map((section, index) => (
              <StaggerItem key={section.title} delay={index * 0.05}>
                <ScrollReveal delay={index * 0.1} className="mb-16 last:mb-0">
                  <h2 className="font-display font-medium text-2xl md:text-3xl text-[var(--foreground)] mb-6 pb-4 border-b border-[var(--border)]">
                    {section.title}
                  </h2>
                  <div className="font-sans text-lg text-[var(--muted)] leading-relaxed prose prose-neutral max-w-none">
                    {section.content}
                  </div>
                </ScrollReveal>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.8} className="mt-20 pt-12 border-t border-[var(--border)] text-center">
            <p className="font-sans text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
              Reach out if you would like to discuss a project or an opportunity.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 font-sans text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              Get in touch
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}