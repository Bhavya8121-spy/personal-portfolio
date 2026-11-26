import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const categoryLabels: Record<Project["category"], string> = {
  web: "Web app",
  mobile: "Mobile app",
  research: "Research",
  creative: "Creative",
  tool: "Developer tool",
};

/**
 * Datasheet-style summary of a project: monospace labels on the left,
 * values on the right, separated by hairlines.
 */
export function ProjectSpecs({
  project,
  maxStack = 3,
  wrap = false,
  className,
}: {
  project: Project;
  /** How many tags to list under Stack before collapsing the rest into "+N". */
  maxStack?: number;
  /** Let long values wrap instead of truncating (for roomy layouts such as the project page). */
  wrap?: boolean;
  className?: string;
}) {
  const shown = project.tags.slice(0, maxStack);
  const hidden = project.tags.length - shown.length;

  const rows: [string, string][] = [
    ["Type", categoryLabels[project.category]],
    ["Stack", hidden > 0 ? `${shown.join(", ")} +${hidden}` : shown.join(", ")],
    ["Year", String(project.year)],
    ["Source", project.github ? "Public repo" : project.link ? "Live demo" : "Private"],
  ];

  return (
    <dl className={cn("font-mono text-[11px] uppercase tracking-[0.08em]", className)}>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-baseline justify-between gap-6 border-t border-white/[0.07] py-2 first:border-t-0"
        >
          <dt className="shrink-0 text-[#8a91a0]">{label}</dt>
          <dd className={cn("text-right text-[#d3d7e0]", wrap ? "text-pretty" : "truncate")}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
