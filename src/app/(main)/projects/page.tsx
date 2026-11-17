"use client";

import Link from "next/link";
import { ProjectAnimation } from "@/components/project-animation";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem, HoverLift } from "@/components/animations";
import { projects, getFeaturedProjects, getAllProjects } from "@/content/projects";
import { ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects();
  const allProjects = getAllProjects();

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:py-32">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-16">
            <span className="font-sans text-sm font-medium text-accent uppercase tracking-wider">
              Projects
            </span>
            <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground mt-4 text-balance">
              My Projects
            </h1>
            <p className="font-sans text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
              Explore my work in AI reliability, observability, local document search, and data analysis.
            </p>
          </ScrollReveal>

          {/* Featured Projects */}
          <StaggerContainer staggerDelay={0.1} className="mb-20">
            <ScrollReveal className="mb-10">
              <h2 className="font-display font-medium text-2xl text-foreground">Featured</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <StaggerItem key={project.slug} delay={index * 0.05}>
                  <ScrollReveal delay={index * 0.1}>
                    <Link href={`/projects/${project.slug}`} className="group block">
                      <HoverLift className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300">
                        {project.animation ? (
                          <ProjectAnimation animation={project.animation} decorative />
                        ) : (
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
                              <span className="font-display font-light text-6xl text-accent/30">{project.category === "mobile" ? "📱" : project.category === "web" ? "🌐" : project.category === "research" ? "🔬" : project.category === "creative" ? "🎨" : "🔧"}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">{project.year}</span>
                            <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium capitalize">{project.category}</span>
                          </div>
                          <h3 className="font-display font-medium text-xl md:text-2xl text-foreground mb-3 group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>
                          <p className="font-sans text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {project.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                            <span>Read the story</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </HoverLift>
                    </Link>
                  </ScrollReveal>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* All Projects */}
          <StaggerContainer staggerDelay={0.1}>
            <ScrollReveal className="mb-10">
              <h2 className="font-display font-medium text-2xl text-foreground">All Projects</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, index) => (
                <StaggerItem key={project.slug} delay={index * 0.03}>
                  <ScrollReveal delay={index * 0.05}>
                    <Link href={`/projects/${project.slug}`} className="group block">
                      <HoverLift className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 h-full">
                        {project.animation ? (
                          <ProjectAnimation animation={project.animation} decorative />
                        ) : (
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
                              <span className="font-display font-light text-5xl text-accent/30">{project.category === "mobile" ? "📱" : project.category === "web" ? "🌐" : project.category === "research" ? "🔬" : project.category === "creative" ? "🎨" : "🔧"}</span>
                            </div>
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">{project.year}</span>
                            <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium capitalize">{project.category}</span>
                          </div>
                          <h3 className="font-display font-medium text-lg md:text-xl text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {project.shortDescription}
                          </p>
                        </div>
                      </HoverLift>
                    </Link>
                  </ScrollReveal>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}