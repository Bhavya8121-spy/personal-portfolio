"use client";

import { profile } from "@/content/profile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Now", href: "/now" },
];

export function Navigation() {
  // The static export uses trailing slashes ("/projects/"), so normalize before comparing.
  const pathname = usePathname().replace(/(.)\/$/, "$1");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6" aria-label="Main navigation">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0d0f14]/75 pl-4 pr-1.5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <Link
          href="/"
          className="font-display text-[15px] font-medium tracking-tight text-foreground transition-colors duration-200 hover:text-accent"
          aria-label="Go to homepage"
        >
          {profile.name}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-sans text-[13px] font-medium transition-colors duration-200",
                  active
                    ? "bg-white/[0.06] text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <Link
          href="/contact"
          className="inline-flex h-9 items-center rounded-xl bg-[#f2f3f6] px-4 text-[13px] font-semibold text-[#07080a] shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset] transition-colors duration-200 hover:bg-white"
        >
          Get in touch
        </Link>
      </div>
    </nav>
  );
}
