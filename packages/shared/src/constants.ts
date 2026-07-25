/** Project Grayscale platform constants */
export const PLATFORM = {
  name: "Project Grayscale",
  tagline: "Run Your Company Like You Already Have an Executive Team.",
  mission:
    "Give every founder access to an AI Executive Team capable of organizing, planning, coordinating and accelerating startup execution.",
} as const;

export const DEVELOPMENT_PHASES = {
  FOUNDER_MEMORY: 1,
  FOUNDER_OS: 2,
  COMPANY_OS: 3,
  AUTONOMOUS_COMPANY: 4,
} as const;

export const APPROVAL_ACTIONS = ["approve", "amend", "reject"] as const;
export type ApprovalAction = (typeof APPROVAL_ACTIONS)[number];

/** Phase 1.5E — executive runtime freeze gate (default: disabled) */
export const EXECUTIVES_ENABLED_DEFAULT = false;

export function isExecutivesEnabled(envValue?: string): boolean {
  return envValue === "true" || envValue === "1";
}

export * from "./events/index.js";
export * from "./executives/index.js";
export * from "./schemas/index.js";
export * from "./pulse/index.js";
export * from "./plugins/index.js";
