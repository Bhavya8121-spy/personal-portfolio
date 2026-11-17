export interface NowItem {
  id: string;
  category: "working-on" | "learning" | "reading" | "exploring" | "excited-about";
  title: string;
  description: string;
  link?: string;
  updatedAt: string;
}

export const nowItems: NowItem[] = [
  {
    id: "agentshield",
    category: "working-on",
    title: "AgentShield",
    description: "AI agent authorization and reliability platform.",
    link: "https://github.com/Bhavya8121-spy/agentshield",
    updatedAt: "2026-11-12"
  },
  {
    id: "log-tunnel",
    category: "working-on",
    title: "Log Tunnel",
    description: "A real-time observability dashboard for a simulated e-commerce system.",
    link: "https://github.com/Bhavya8121-spy/Log-Tunnel-Chaos-Monkey-Simulator",
    updatedAt: "2026-07-25"
  },
  {
    id: "personal-finance-forecaster",
    category: "working-on",
    title: "Personal Finance Forecaster",
    description: "An AI-assisted app for importing bank statements and understanding spending.",
    link: "https://github.com/Bhavya8121-spy/Personal_Finance",
    updatedAt: "2026-10-27"
  }
];

export const categoryLabels: Record<NowItem["category"], string> = {
  "working-on": "Recently updated",
  "learning": "Learning",
  "reading": "Reading",
  "exploring": "Exploring",
  "excited-about": "Excited About",
};

export const categoryOrder: NowItem["category"][] = [
  "working-on",
  "learning",
  "reading",
  "exploring",
  "excited-about",
];

export function getNowItems(): NowItem[] {
  return [...nowItems].sort((a, b) => {
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function getLastUpdated(): string {
  const dates = nowItems.map((item) => new Date(item.updatedAt).getTime());
  const latest = new Date(Math.max(...dates));
  return latest.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}