"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 rounded-full",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-4 py-2":
              variant === "default" && size === "default",
            "bg-accent text-accent-foreground hover:bg-accent/90 h-9 px-3":
              variant === "default" && size === "sm",
            "bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8":
              variant === "default" && size === "lg",
            "border border-border bg-transparent hover:bg-muted h-10 px-4 py-2":
              variant === "outline" && size === "default",
            "border border-border bg-transparent hover:bg-muted h-9 px-3":
              variant === "outline" && size === "sm",
            "border border-border bg-transparent hover:bg-muted h-11 px-8":
              variant === "outline" && size === "lg",
            "bg-transparent hover:bg-muted h-10 px-4 py-2":
              variant === "ghost" && size === "default",
            "bg-transparent hover:bg-muted h-9 px-3":
              variant === "ghost" && size === "sm",
            "bg-transparent hover:bg-muted h-11 px-8":
              variant === "ghost" && size === "lg",
            "text-muted-foreground underline-offset-4 hover:underline":
              variant === "link",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";