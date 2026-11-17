import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectAnimation({
  animation,
  className,
  decorative = false,
}: {
  animation: NonNullable<Project["animation"]>;
  className?: string;
  decorative?: boolean;
}) {
  const path = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media/projects/${animation.asset}`;

  return (
    <picture className={cn("block aspect-video overflow-hidden bg-background", className)}>
      <source media="(prefers-reduced-motion: reduce)" srcSet={`${path}.png`} />
      {/* Native picture selects the still before loading the animation. */}
      <img
        src={`${path}.gif`}
        alt={decorative ? "" : animation.description}
        width={960}
        height={540}
        loading="lazy"
        decoding="async"
        className="block size-full object-contain"
      />
    </picture>
  );
}
