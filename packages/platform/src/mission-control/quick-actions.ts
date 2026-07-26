/** Quick Actions — reusable operational shortcuts */

export const QUICK_ACTION_TARGETS = [
  "projects",
  "goals",
  "notes",
  "meetings",
  "plugins",
  "integrations",
  "reports",
  "sync",
  "simulation",
  "forecasts",
  "council",
] as const;

export type QuickActionTarget = (typeof QUICK_ACTION_TARGETS)[number];

export interface QuickActionDefinition {
  id: string;
  name: string;
  target: QuickActionTarget;
  actionId: string;
  icon?: string;
  permission: string;
  description?: string;
}

export interface QuickActionsPort {
  list(): QuickActionDefinition[];
}
