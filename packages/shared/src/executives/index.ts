/** The eight AI executives — each owns a department */
export const EXECUTIVES = {
  ATHENA: {
    id: "athena",
    name: "Athena",
    title: "Chief Executive Strategist",
    department: "operations",
    description: "Reference executive — strategic discovery, recommendation, and council governance.",
  },
  ATLAS: {
    id: "atlas",
    name: "Atlas",
    title: "Chief Operations Executive",
    department: "operations",
    description: "Operations, execution, capacity, workflow, and delivery.",
  },
  LEDGER: {
    id: "ledger",
    name: "Ledger",
    title: "Chief Financial Executive",
    department: "finance",
    description: "Finance, cash, revenue, forecasting, and budget.",
  },
  MERCURY: {
    id: "mercury",
    name: "Mercury",
    title: "Chief Communications Executive",
    department: "communications",
    description: "Communication, stakeholders, narratives, and brand.",
  },
  SENTINEL: {
    id: "sentinel",
    name: "Sentinel",
    title: "Chief Risk & Security Executive",
    department: "risk",
    description: "Risk, compliance, security, and governance.",
  },
  NAVIGATOR: {
    id: "navigator",
    name: "Navigator",
    title: "Chief Strategy Executive",
    department: "strategy",
    description: "Long-term strategy, scenario comparison, and trade-offs.",
  },
  FORGE: {
    id: "forge",
    name: "Forge",
    title: "Chief Innovation Executive",
    department: "innovation",
    description: "Innovation, experiments, opportunity discovery, transformation.",
  },
  NOVA: {
    id: "nova",
    name: "Nova",
    title: "Executive Assistant",
    department: "personal_ops",
    description: "Calendar, tasks, daily briefings, reminders.",
  },
  HACKBOX: {
    id: "hackbox",
    name: "HackBox",
    title: "Chief Security Officer",
    department: "security",
    description: "Security posture, compliance, threat monitoring.",
  },
  MARKET_INTELLIGENCE: {
    id: "market-intelligence",
    name: "Market Intelligence",
    title: "Chief Intelligence Officer",
    department: "intelligence",
    description: "Competitive landscape, market signals, research.",
  },
  BOUNCE_BOX: {
    id: "bounce-box",
    name: "Bounce Box",
    title: "Chief Strategy Officer",
    department: "strategy",
    description: "Strategic options, pivots, long-range planning.",
  },
} as const;

export type ExecutiveId =
  (typeof EXECUTIVES)[keyof typeof EXECUTIVES]["id"];

export const EXECUTIVE_LIST = Object.values(EXECUTIVES);

export const DEPARTMENTS = [
  "operations",
  "engineering",
  "finance",
  "growth",
  "personal_ops",
  "security",
  "intelligence",
  "strategy",
  "marketing",
  "hr",
  "legal",
  "customer_success",
  "sales",
  "vendor_management",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
