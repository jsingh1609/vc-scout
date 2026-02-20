export interface Company {
  id: string;
  name: string;
  website: string;
  stage: string;
  sector: string;
  hq: string;
  founded: number;
  employees: string;
  description: string;
  tags: string[];
  score: number;
  signals: Signal[];
  fundingTotal: string;
  lastRound: string;
  lastRoundDate: string;
}

export interface Signal {
  id: string;
  type: 'hiring' | 'funding' | 'product' | 'press' | 'founder';
  title: string;
  date: string;
  source?: string;
}

export const companies: Company[] = [
  {
    id: "linear-app",
    name: "Linear",
    website: "https://linear.app",
    stage: "Series B",
    sector: "Dev Tools",
    hq: "San Francisco, CA",
    founded: 2019,
    employees: "51-200",
    description: "Issue tracking and project management for high-performance software teams. Built for speed.",
    tags: ["B2B SaaS", "Dev Tools", "Productivity"],
    score: 94,
    fundingTotal: "$52M",
    lastRound: "$35M Series B",
    lastRoundDate: "2022-04",
    signals: [
      { id: "s1", type: "hiring", title: "Hiring 12 engineers across backend and infra", date: "2024-01-15" },
      { id: "s2", type: "product", title: "Launched Linear Insights — AI project analytics", date: "2024-01-08" },
      { id: "s3", type: "press", title: "Featured in YC's top B2B tools of 2023", date: "2023-12-20" },
    ],
  },
  {
    id: "retool",
    name: "Retool",
    website: "https://retool.com",
    stage: "Series C",
    sector: "Dev Tools",
    hq: "San Francisco, CA",
    founded: 2017,
    employees: "201-500",
    description: "Low-code platform for building internal tools. Used by 7000+ companies.",
    tags: ["Low-Code", "Internal Tools", "B2B"],
    score: 88,
    fundingTotal: "$145M",
    lastRound: "$45M Series C",
    lastRoundDate: "2021-07",
    signals: [
      { id: "s4", type: "product", title: "Released Retool AI — LLM-powered app builder", date: "2024-01-10" },
      { id: "s5", type: "hiring", title: "Expanding sales team in EMEA", date: "2023-12-18" },
    ],
  },
  {
    id: "descript",
    name: "Descript",
    website: "https://www.descript.com",
    stage: "Series C",
    sector: "AI / Media",
    hq: "San Francisco, CA",
    founded: 2017,
    employees: "51-200",
    description: "AI-powered audio and video editing. Edit media like a document.",
    tags: ["AI", "Media", "Creator Tools"],
    score: 82,
    fundingTotal: "$100M",
    lastRound: "$50M Series C",
    lastRoundDate: "2023-03",
    signals: [
      { id: "s6", type: "product", title: "Launched Underlord — AI video production suite", date: "2024-01-20" },
    ],
  },
  {
    id: "loom",
    name: "Loom",
    website: "https://www.loom.com",
    stage: "Acquired",
    sector: "Productivity",
    hq: "San Francisco, CA",
    founded: 2016,
    employees: "201-500",
    description: "Async video messaging for work. Acquired by Atlassian for $975M.",
    tags: ["Video", "Async", "Productivity"],
    score: 76,
    fundingTotal: "$203M",
    lastRound: "Acquired by Atlassian",
    lastRoundDate: "2023-10",
    signals: [
      { id: "s7", type: "funding", title: "Acquired by Atlassian for $975M", date: "2023-10-12" },
    ],
  },
  {
    id: "cal-com",
    name: "Cal.com",
    website: "https://cal.com",
    stage: "Seed",
    sector: "Productivity",
    hq: "Remote",
    founded: 2021,
    employees: "11-50",
    description: "Open-source scheduling infrastructure. The Stripe of scheduling.",
    tags: ["Open Source", "Scheduling", "Infrastructure"],
    score: 79,
    fundingTotal: "$25M",
    lastRound: "$25M Series A",
    lastRoundDate: "2022-10",
    signals: [
      { id: "s8", type: "product", title: "Cal.com v4 with real-time video built-in", date: "2024-01-05" },
      { id: "s9", type: "hiring", title: "Hiring founding GTM team", date: "2023-12-01" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    website: "https://www.perplexity.ai",
    stage: "Series B",
    sector: "AI",
    hq: "San Francisco, CA",
    founded: 2022,
    employees: "11-50",
    description: "AI-powered answer engine. Real-time web search meets LLMs.",
    tags: ["AI", "Search", "LLM"],
    score: 97,
    fundingTotal: "$165M",
    lastRound: "$73.6M Series B",
    lastRoundDate: "2024-01",
    signals: [
      { id: "s10", type: "funding", title: "Raised $73.6M at $520M valuation", date: "2024-01-04" },
      { id: "s11", type: "product", title: "Perplexity Pro launched with unlimited searches", date: "2023-12-15" },
      { id: "s12", type: "hiring", title: "Scaling engineering team 3x in 2024", date: "2024-01-10" },
    ],
  },
  {
    id: "resend",
    name: "Resend",
    website: "https://resend.com",
    stage: "Seed",
    sector: "Dev Infrastructure",
    hq: "Remote",
    founded: 2023,
    employees: "1-10",
    description: "Email API for developers. Build, test, and send transactional email with ease.",
    tags: ["Email", "API", "Developer Tools"],
    score: 85,
    fundingTotal: "$3M",
    lastRound: "$3M Seed",
    lastRoundDate: "2023-06",
    signals: [
      { id: "s13", type: "product", title: "Launched Broadcasts for marketing emails", date: "2024-01-18" },
      { id: "s14", type: "press", title: "Reached 50K developer signups in 6 months", date: "2023-12-01" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    website: "https://cursor.sh",
    stage: "Series A",
    sector: "AI / Dev Tools",
    hq: "San Francisco, CA",
    founded: 2022,
    employees: "11-50",
    description: "The AI-first code editor. Built on VSCode with deeply integrated AI pair programming.",
    tags: ["AI", "IDE", "Developer Tools"],
    score: 96,
    fundingTotal: "$60M",
    lastRound: "$60M Series A",
    lastRoundDate: "2024-01",
    signals: [
      { id: "s15", type: "funding", title: "Raised $60M Series A led by a16z", date: "2024-01-17" },
      { id: "s16", type: "product", title: "Cursor Tab — full line AI autocomplete", date: "2024-01-08" },
    ],
  },
  {
    id: "fig",
    name: "Fig",
    website: "https://fig.io",
    stage: "Acquired",
    sector: "Dev Tools",
    hq: "San Francisco, CA",
    founded: 2020,
    employees: "1-10",
    description: "Autocomplete for the terminal. Acquired by AWS.",
    tags: ["CLI", "Developer Experience", "Terminal"],
    score: 70,
    fundingTotal: "$10M",
    lastRound: "Acquired by AWS",
    lastRoundDate: "2023-08",
    signals: [
      { id: "s17", type: "funding", title: "Acquired by Amazon Web Services", date: "2023-08-09" },
    ],
  },
  {
    id: "posthog",
    name: "PostHog",
    website: "https://posthog.com",
    stage: "Series B",
    sector: "Analytics",
    hq: "San Francisco, CA",
    founded: 2020,
    employees: "51-200",
    description: "Open-source product analytics. Self-host or cloud. Feature flags, session recording, A/B testing.",
    tags: ["Open Source", "Analytics", "Product Intelligence"],
    score: 89,
    fundingTotal: "$27M",
    lastRound: "$15M Series B",
    lastRoundDate: "2022-03",
    signals: [
      { id: "s18", type: "product", title: "Launched PostHog AI — natural language analytics", date: "2024-01-12" },
      { id: "s19", type: "hiring", title: "Doubling EU-based engineering", date: "2023-12-20" },
    ],
  },
];

export const sectors = Array.from(new Set(companies.map(c => c.sector)));
export const stages = Array.from(new Set(companies.map(c => c.stage)));