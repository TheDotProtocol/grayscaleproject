/** Executive lifecycle states — every executive follows the same lifecycle */

export const EXECUTIVE_LIFECYCLE_STATES = [
  "created",
  "initializing",
  "idle",
  "waiting",
  "thinking",
  "blocked",
  "needs_approval",
  "executing",
  "monitoring",
  "completed",
  "failed",
  "paused",
  "archived",
] as const;

export type ExecutiveLifecycleState = (typeof EXECUTIVE_LIFECYCLE_STATES)[number];

export const VALID_LIFECYCLE_TRANSITIONS: Record<
  ExecutiveLifecycleState,
  ExecutiveLifecycleState[]
> = {
  created: ["initializing", "archived"],
  initializing: ["idle", "failed", "archived"],
  idle: ["waiting", "thinking", "executing", "paused", "archived"],
  waiting: ["idle", "thinking", "blocked", "archived"],
  thinking: ["idle", "needs_approval", "executing", "blocked", "failed"],
  blocked: ["idle", "waiting", "failed"],
  needs_approval: ["executing", "idle", "failed", "archived"],
  executing: ["monitoring", "completed", "failed", "blocked"],
  monitoring: ["completed", "idle", "failed"],
  completed: ["idle", "archived"],
  failed: ["idle", "archived"],
  paused: ["idle", "archived"],
  archived: [],
};

export function canTransition(
  from: ExecutiveLifecycleState,
  to: ExecutiveLifecycleState,
): boolean {
  return VALID_LIFECYCLE_TRANSITIONS[from]?.includes(to) ?? false;
}
