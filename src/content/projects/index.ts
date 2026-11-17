export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  animation?: { asset: string; description: string };
  featured: boolean;
  year: number;
  category: "web" | "mobile" | "research" | "creative" | "tool";
}

export const projects: Project[] = [
  {
    slug: "agentshield",
    animation: {
      asset: "agentshield",
      description: "A branching checkpoint allows a read request, blocks a delete request, and logs the decision.",
    },
    title: "AgentShield",
    shortDescription: "AI agent authorization and reliability platform.",
    description: "<p>Designed policy checks for tool execution using role-based access control and tenant isolation. In résumé-reported testing, AgentShield matched expected authorization decisions across 100 synthetic scenarios and recorded zero unauthorized executions across 20 live OCI Generative AI evaluations.</p>",
    tags: [
      "Python",
      "OCI Generative AI",
      "Oracle AI Database",
      "Docker",
      "Pytest"
    ],
    github: "https://github.com/Bhavya8121-spy/agentshield",
    featured: true,
    year: 2026,
    category: "tool"
  },
  {
    slug: "log-tunnel",
    animation: {
      asset: "log-tunnel",
      description: "A simulated payment timeout sends glowing error events down a wireframe tunnel as the queue count grows.",
    },
    title: "Log Tunnel",
    shortDescription: "A real-time observability dashboard for a simulated e-commerce system.",
    description: "<p>Log Tunnel streams logs from a mock e-commerce API to a dashboard over WebSockets. The simulator lets visitors observe the effects of common service failures in a controlled environment. Docker Compose runs the log shipper, database, mock API, and dashboard together.</p>",
    tags: [
      "Python",
      "PostgreSQL",
      "WebSockets",
      "Docker",
      "Three.js"
    ],
    github: "https://github.com/Bhavya8121-spy/Log-Tunnel-Chaos-Monkey-Simulator",
    featured: true,
    year: 2026,
    category: "web"
  },
  {
    slug: "personal-finance-forecaster",
    animation: {
      asset: "statement-reader",
      description: "A bank statement resolves messy transaction names and reveals a spending breakdown.",
    },
    title: "Personal Finance Forecaster",
    shortDescription: "An AI-assisted app for importing bank statements and understanding spending.",
    description: "<p>The app detects CSV schemas across 29 banking header aliases and categorizes transactions using rules, merchant matching, saved corrections, and a Gemini fallback. It also flags low-confidence matches for review and detects recurring expenses. The résumé reports adoption by more than 100 users.</p>",
    tags: [
      "Python",
      "Streamlit",
      "SQLite",
      "Gemini API"
    ],
    github: "https://github.com/Bhavya8121-spy/Personal_Finance",
    featured: true,
    year: 2025,
    category: "web",
    link: "https://personalfinance01.streamlit.app/"
  },
  {
    slug: "rag-engine",
    title: "RAG Engine",
    shortDescription: "Offline question answering, summaries, and quizzes from local PDFs.",
    description: "<p>The CLI extracts and chunks PDF text, stores embeddings locally in ChromaDB, and retrieves relevant passages for a local Ollama model. It runs without an external API.</p>",
    tags: [
      "Python",
      "Ollama",
      "ChromaDB",
      "PyMuPDF"
    ],
    github: "https://github.com/Bhavya8121-spy/RAGEngine",
    featured: false,
    year: 2026,
    category: "tool"
  },
  {
    slug: "transfer-pathway-optimizer",
    title: "Transfer Pathway Optimizer",
    shortDescription: "A semester planner built around transfer credits and course prerequisites.",
    description: "<p>The Flask app parses community college program reports for course codes, completion status, and elective groupings. The planner orders courses by prerequisites and accounts for workload limits and seasonal scheduling constraints.</p>",
    tags: [
      "Python",
      "Flask",
      "Pandas",
      "pdfplumber"
    ],
    github: "https://github.com/Bhavya8121-spy/Transfer-Pathway",
    featured: false,
    year: 2025,
    category: "web"
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return projects.filter((p) => p.category === category);
}