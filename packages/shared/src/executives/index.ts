/** The eight AI executives — each owns a department */
export const EXECUTIVES = {
  ATHENA: {
    id: "athena",
    name: "Athena",
    title: "Chief of Staff",
    department: "operations",
    description: "Coordinates priorities, meetings, and founder focus.",
  },
  ATLAS: {
    id: "atlas",
    name: "Atlas",
    title: "Chief Technology Officer",
    department: "engineering",
    description: "Architecture, code quality, technical roadmap.",
  },
  LEDGER: {
    id: "ledger",
    name: "Ledger",
    title: "Chief Financial Officer",
    department: "finance",
    description: "Runway, burn rate, billing, financial planning.",
  },
  MERCURY: {
    id: "mercury",
    name: "Mercury",
    title: "Chief Growth Officer",
    department: "growth",
    description: "Acquisition, retention, marketing experiments.",
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
