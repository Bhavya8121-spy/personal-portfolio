"use client";

import { profile } from "@/content/profile";
import Link from "next/link";
import { ProjectAnimation } from "@/components/project-animation";
import { getFeaturedProjects } from "@/content/projects";
import { ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem, FadeIn, SlideUp } from "@/components/animations";
import { CubeHeroAnimation } from "@/components/cube-hero-animation";
import { StackedWaveforms } from "@/components/stacked-waveforms";
import { InteractiveTerminal } from "@/components/interactive-terminal";
import { ProjectSpecs } from "@/components/project-specs";
import { IntroOverlay } from "@/components/intro-overlay";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[var(--background)]">
      <IntroOverlay />
      <CubeHeroAnimation />

      <div className="flex-1">
        {/* Interactive Terminal Section */}
        <section id="home-terminal" className="scroll-mt-16 py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-16 border-y border-[var(--border)]">
          <div className="max-w-[1440px] mx-auto">
            <ScrollReveal className="mb-12 text-center">
              <span className="font-mono text-xs font-medium text-[var(--accent)] uppercase tracking-[0.18em]">
                Interactive
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mt-2 text-balance">
                Try the terminal
              </h2>
              <p className="font-sans text-lg text-[var(--muted)] mt-4 max-w-2xl mx-auto leading-relaxed">
                Type <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">help</code> to see commands, or try <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">home</code>, <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">scroll</code>, <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">projects</code>, <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">contact</code>, <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">about</code>. Press <code className="bg-[var(--muted)]/50 px-2 py-0.5 rounded font-mono text-sm text-[var(--accent)]">Tab</code> for autocomplete.
              </p>
            </ScrollReveal>

            <div className="max-w-2xl mx-auto">
              <ScrollReveal delay={0.2}>
                <InteractiveTerminal autoRun="help" />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Selected Work Section */}
        <section className="py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-16 border-y border-[var(--border)]">
          <div className="max-w-[1440px] mx-auto">
            <ScrollReveal className="mb-16">
              <span className="font-mono text-xs font-medium text-[var(--accent)] uppercase tracking-[0.18em]">
                01 / Selected Work
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mt-2 text-balance">
                Selected Projects
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFeaturedProjects().map((project, index) => (
                <ScrollReveal key={project.title} delay={index * 0.1} className="group">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="block h-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                  >
                    {project.animation && (
                      <ProjectAnimation animation={project.animation} className="mb-5 rounded-lg" decorative />
                    )}
                    <h3 className="font-display font-medium text-xl md:text-2xl tracking-tight text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-sans text-[var(--muted)] leading-relaxed mb-6 line-clamp-3 flex-1">
                      {project.shortDescription}
                    </p>
                    <ProjectSpecs project={project} className="mb-6" />
                    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between mt-auto">
                      <span className="font-sans text-sm font-medium text-[var(--accent)]">
                        View project
                      </span>
                      <ArrowRight className="w-4 h-4 text-[var(--accent)]/50 group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--border)] rounded-full font-sans font-medium text-base text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] hover:bg-[var(--muted)]/10 transition-all"
              >
                View all projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* About / Exploration Section - Stacked Particle Waveforms */}
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
                      <span className="font-mono text-xs font-medium text-[var(--accent)] uppercase tracking-[0.18em]">
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
                    <SlideUp delay={0.3} distance={16} className="mb-8 max-w-xl">
                      <p className="font-sans text-lg md:text-xl leading-relaxed tracking-tight text-pretty">
                        <span className="text-[var(--foreground)]">I build tools that make complex systems easier to inspect and use, from tracing service failures to searching documents with a local language model.</span>{" "}
                        <span className="text-[#8a91a0]">My projects span AI agent authorization, real-time observability, and practical tools for financial analysis and course planning.</span>
                      </p>
                    </SlideUp>
                  </StaggerItem>

                  <StaggerItem delay={4}>
                    <SlideUp delay={0.5} distance={16} className="flex items-center gap-4">
                      <Link href="/about" className="inline-flex items-center gap-2 px-7 py-2.5 border border-[var(--border)] rounded-full font-sans font-medium text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all">
                        Read my story
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

        {/* Experience & Skills Section */}
        <section className="py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-16 border-y border-[var(--border)]">
          <div className="max-w-[1440px] mx-auto">
            <ScrollReveal className="mb-16">
              <span className="font-mono text-xs font-medium text-[var(--accent)] uppercase tracking-[0.18em]">
                03 / Experience & Skills
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mt-2 text-balance">
                Technical skills
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl">
              {[
                {
                  title: "Languages",
                  items: ["Python", "C++", "JavaScript", "HTML", "CSS"],
                },
                {
                  title: "Frameworks",
                  items: ["React", "Flask", "Streamlit", "REST APIs", "WebSockets"],
                },
                {
                  title: "Tools & Platforms",
                  items: ["Git", "Docker Compose", "Linux", "PostgreSQL", "SQLite", "Pandas"],
                },
                {
                  title: "AI & Retrieval",
                  items: ["Ollama", "Gemini API", "ChromaDB", "Vector Embeddings", "RAG"],
                },
              ].map((category, index) => (
                <ScrollReveal key={category.title} delay={index * 0.1}>
                  <div>
                    <h3 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--foreground)] mb-3">
                      {category.title}
                    </h3>
                    <ul className="font-mono text-xs uppercase tracking-[0.08em]">
                      {category.items.map((item, i) => (
                        <li
                          key={item}
                          className="flex items-baseline justify-between gap-6 border-t border-white/[0.07] py-2.5"
                        >
                          <span className="text-[#d3d7e0]">{item}</span>
                          <span className="text-[#8a91a0] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-16 border-y border-[var(--border)]">
          <div className="max-w-[1440px] mx-auto text-center">
            <ScrollReveal className="mb-12">
              <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] text-balance mb-6">
                Let&apos;s connect.
              </h2>
              <p className="font-sans text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
                Have an idea, a question, or just want to say hello? My inbox is always open.
              </p>
            </ScrollReveal>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-full font-sans font-medium text-base hover:bg-[var(--accent)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-all"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--border)] rounded-full font-sans font-medium text-base text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] hover:bg-[var(--muted)]/10 transition-all"
              >
                Email directly
              </a>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}