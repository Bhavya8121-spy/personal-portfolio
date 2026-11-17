"use client";

import { profile } from "@/content/profile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Now", href: "/now" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display font-medium text-lg text-foreground hover:text-accent transition-colors duration-200"
            aria-label="Go to homepage"
          >
            {profile.name}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative font-sans text-sm font-medium transition-colors duration-200",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                <AnimatePresence mode="wait">
                  {pathname === item.href && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-[-4px] left-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent border border-accent rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}