"use client";

import { profile } from "@/content/profile";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { Mail, GitBranch, Link2 } from "lucide-react";

const contactLinks = [
  {
    name: "Email",
    href: `mailto:${profile.email}`,
    icon: Mail,
    description: "Questions and collaboration",
    color: "bg-blue-900/30 text-blue-300",
  },
  {
    name: "GitHub",
    href: profile.github,
    icon: GitBranch,
    description: "Code, projects, contributions",
    color: "bg-gray-800/30 text-gray-300",
  },
  {
    name: "LinkedIn",
    href: profile.linkedin,
    icon: Link2,
    description: "Professional background",
    color: "bg-blue-900/30 text-blue-300",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:py-32">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="mb-16 text-center">
            <span className="font-sans text-sm font-medium text-accent uppercase tracking-wider">
              Contact
            </span>
            <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground mt-4 text-balance">
              Let&apos;s Connect
            </h1>
            <p className="font-sans text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              Have an idea, a question, or just want to say hello? My inbox is always open.
              Email me directly or connect on LinkedIn.
            </p>
          </ScrollReveal>

          {/* Contact Links */}
          <StaggerContainer staggerDelay={0.1} className="mb-20">
            <ScrollReveal className="mb-10 text-center">
              <h2 className="font-display font-medium text-2xl text-foreground">Quick Links</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {contactLinks.map((link, index) => (
                <StaggerItem key={link.name} delay={index * 0.05}>
                  <ScrollReveal delay={index * 0.1}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group block bg-card border border-border rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:border-accent/50 hover:shadow-lg"
                    >
                      <div className={`mx-auto mb-4 w-14 h-14 rounded-xl ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <link.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-display font-medium text-xl text-foreground mb-2">
                        {link.name}
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </a>
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
