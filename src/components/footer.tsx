import { profile } from "@/content/profile";
import Link from "next/link";
import { cn } from "@/lib/utils";

const socialLinks = [
  { name: "Email", href: `mailto:${profile.email}`, ariaLabel: "Send an email" },
  { name: "GitHub", href: profile.github, ariaLabel: "View GitHub profile" },
  { name: "LinkedIn", href: profile.linkedin, ariaLabel: "View LinkedIn profile" },
];

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Now", href: "/now" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-display font-medium text-xl text-foreground hover:text-accent transition-colors duration-200 inline-block mb-4"
            >
              {profile.name}
            </Link>
            <p className="font-sans text-base text-muted-foreground max-w-xs leading-relaxed">
              Computer science student at Vanderbilt University, building AI systems and developer tools.
            </p>
          </div>

          <div>
            <h3 className="font-display font-medium text-sm uppercase tracking-wider text-foreground mb-4">
              Explore
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display font-medium text-sm uppercase tracking-wider text-foreground mb-4">
              Connect
            </h3>
            <ul className="space-y-3" role="list">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                    aria-label={link.ariaLabel}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-muted-foreground">
            © {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}