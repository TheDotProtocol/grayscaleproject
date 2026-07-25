/**
 * Platform Event Catalog — single source of truth for all domain events.
 * Each entry includes schema version for evolution without breaking consumers.
 */
export const EVENT_CATALOG = {
  // ─── Project ───────────────────────────────────────────────
  "project.created": {
    version: 1,
    category: "project",
    description: "A new project was created",
  },
  "project.updated": {
    version: 1,
    category: "project",
    description: "Project metadata or status changed",
  },

  // ─── Task ──────────────────────────────────────────────────
  "task.created": { version: 1, category: "task", description: "Task created" },
  "task.completed": { version: 1, category: "task", description: "Task marked complete" },

  // ─── Memory ────────────────────────────────────────────────
  "memory.created": { version: 1, category: "memory", description: "Memory item created" },
  "memory.updated": { version: 1, category: "memory", description: "Memory item updated" },
  "memory.deleted": { version: 1, category: "memory", description: "Memory item deleted" },
  "idea.captured": { version: 1, category: "memory", description: "Founder idea captured" },
  "journal.entry.created": {
    version: 1,
    category: "memory",
    description: "Daily journal entry created",
  },

  // ─── Billing ───────────────────────────────────────────────
  "bill.due": { version: 1, category: "billing", description: "Bill is due or overdue" },
  "bill.paid": { version: 1, category: "billing", description: "Bill marked paid" },
  "billing.bill.due_soon": {
    version: 1,
    category: "billing",
    description: "Bill due within reminder window (legacy)",
  },
  "billing.bill.overdue": {
    version: 1,
    category: "billing",
    description: "Bill past due date (legacy)",
  },

  // ─── Meeting ───────────────────────────────────────────────
  "meeting.scheduled": { version: 1, category: "meeting", description: "Meeting scheduled" },

  // ─── Git ───────────────────────────────────────────────────
  "git.commit.received": {
    version: 1,
    category: "git",
    description: "Git commit ingested from integration",
  },

  // ─── Recommendation ────────────────────────────────────────
  "recommendation.generated": {
    version: 1,
    category: "recommendation",
    description: "New recommendation created",
  },
  "agent.recommendation.created": {
    version: 1,
    category: "recommendation",
    description: "Agent recommendation (legacy alias)",
  },

  // ─── Architecture ──────────────────────────────────────────
  "architecture.decision.recorded": {
    version: 1,
    category: "architecture",
    description: "ADR or architecture decision recorded",
  },

  // ─── Notification ──────────────────────────────────────────
  "notification.sent": { version: 1, category: "notification", description: "Notification delivered" },
  "notification.created": {
    version: 1,
    category: "notification",
    description: "Notification created (legacy)",
  },
  "briefing.ready": { version: 1, category: "notification", description: "Daily briefing ready" },

  // ─── Integration ───────────────────────────────────────────
  "integration.connected": {
    version: 1,
    category: "integration",
    description: "External integration connected",
  },
  "integration.sync.completed": {
    version: 1,
    category: "integration",
    description: "Integration sync succeeded (legacy)",
  },
  "integration.sync.failed": {
    version: 1,
    category: "integration",
    description: "Integration sync failed",
  },

  // ─── Plugin ────────────────────────────────────────────────
  "plugin.installed": { version: 1, category: "plugin", description: "Plugin installed for company" },
  "plugin.uninstalled": { version: 1, category: "plugin", description: "Plugin removed" },

  // ─── Timeline ──────────────────────────────────────────────
  "timeline.updated": { version: 1, category: "timeline", description: "Company timeline updated" },
  "timeline.event.created": {
    version: 1,
    category: "timeline",
    description: "Timeline entry created (legacy)",
  },

  // ─── Pulse ─────────────────────────────────────────────────
  "pulse.updated": { version: 1, category: "pulse", description: "Operational pulse heartbeat emitted" },

  // ─── Documentation ─────────────────────────────────────────
  "documentation.generated": {
    version: 1,
    category: "documentation",
    description: "Documentation artifact generated",
  },

  // ─── Sprint ────────────────────────────────────────────────
  "sprint.completed": { version: 1, category: "sprint", description: "Sprint milestone completed" },

  // ─── Knowledge Graph ───────────────────────────────────────
  "knowledge.node.created": { version: 1, category: "knowledge", description: "Knowledge node created" },
  "knowledge.edge.created": { version: 1, category: "knowledge", description: "Knowledge relationship created" },
  "knowledge.relationship.created": {
    version: 1,
    category: "knowledge",
    description: "Entity relationship established",
  },

  // ─── Strategic Intelligence (Phase 1.5D) ───────────────────
  "goal.created": { version: 1, category: "strategy", description: "Strategic goal created" },
  "objective.created": { version: 1, category: "strategy", description: "Goal objective created" },
  "decision.recorded": { version: 1, category: "strategy", description: "Decision recorded" },
  "risk.assessed": { version: 1, category: "strategy", description: "Risk assessment created" },
  "opportunity.identified": { version: 1, category: "strategy", description: "Opportunity identified" },
  "recommendation.approved": { version: 1, category: "recommendation", description: "Recommendation approved" },
  "recommendation.rejected": { version: 1, category: "recommendation", description: "Recommendation rejected" },
  "priority.computed": { version: 1, category: "strategy", description: "Priority score computed" },
  "operating_mode.changed": { version: 1, category: "strategy", description: "Company operating mode changed" },

  // ─── Executive Runtime (Phase 1.5E) ────────────────────────
  "executive.instance.initialized": { version: 1, category: "executive", description: "Executive runtime instance initialized" },
  "executive.lifecycle.changed": { version: 1, category: "executive", description: "Executive lifecycle state changed" },
  "executive.message.sent": { version: 1, category: "executive", description: "Executive bus message sent" },
  "executive.execution.requested": { version: 1, category: "executive", description: "Executive execution request queued" },
  "executive.output.recorded": { version: 1, category: "executive", description: "Executive structured output recorded" },

  // ─── Agent (framework only — execution frozen Sprint 1.5) ──
  "agent.run.started": { version: 1, category: "agent", description: "Agent run started" },
  "agent.run.completed": { version: 1, category: "agent", description: "Agent run completed" },
  "agent.approval.required": { version: 1, category: "agent", description: "Approval required" },
  "agent.approval.resolved": { version: 1, category: "agent", description: "Approval resolved" },

  // ─── Mission Control (Phase 1.5G) ──────────────────────────
  "mission-control.action.requested": {
    version: 1,
    category: "operations",
    description: "Mission Control action job queued",
  },
  "mission-control.action.completed": {
    version: 1,
    category: "operations",
    description: "Mission Control action job completed",
  },
  "mission-control.action.failed": {
    version: 1,
    category: "operations",
    description: "Mission Control action job failed",
  },
  "mission-control.widget.refreshed": {
    version: 1,
    category: "operations",
    description: "Widget data refreshed",
  },

  // ─── Platform Operations (Phase 1.5H) ──────────────────────
  "platform.governance.recorded": {
    version: 1,
    category: "operations",
    description: "Governance entry recorded",
  },
  "platform.readiness.generated": {
    version: 1,
    category: "operations",
    description: "Platform readiness report generated",
  },
  "platform.recovery.completed": {
    version: 1,
    category: "operations",
    description: "Recovery operation completed",
  },
  "slo.breach": { version: 1, category: "operations", description: "SLO breach detected" },

  // ─── Executive Discovery (Sprint 2 Phase A.1 — ADR-014, reserved) ─
  "identity.updated": {
    version: 1,
    category: "executive",
    description: "Operator identity profile updated",
  },
  "cognitive-model.evidence.recorded": {
    version: 1,
    category: "executive",
    description: "ECM evidence recorded — behavioural update applied",
  },
  "discovery.started": {
    version: 1,
    category: "executive",
    description: "Executive entered discovery mode",
  },
  "discovery.stage.completed": {
    version: 1,
    category: "executive",
    description: "Discovery pipeline stage completed",
  },
  "discovery.eligible": {
    version: 1,
    category: "executive",
    description: "Discovery complete — recommendation mode eligible",
  },
  "trust.score.updated": {
    version: 1,
    category: "executive",
    description: "Executive trust score recalculated",
  },
  "recommendation.lifecycle.transitioned": {
    version: 1,
    category: "recommendation",
    description: "Recommendation lifecycle state transition",
  },
  "executive.council.message": {
    version: 1,
    category: "executive",
    description: "Executive council message sent",
  },
} as const;

export type PlatformEventType = keyof typeof EVENT_CATALOG;

export type EventCategory = (typeof EVENT_CATALOG)[PlatformEventType]["category"];

/** Legacy alias — existing code uses DOMAIN_EVENTS */
export const DOMAIN_EVENTS = {
  MEMORY_CREATED: "memory.created",
  MEMORY_UPDATED: "memory.updated",
  MEMORY_DELETED: "memory.deleted",
  JOURNAL_ENTRY_CREATED: "journal.entry.created",
  TIMELINE_EVENT_CREATED: "timeline.event.created",
  SPRINT_COMPLETED: "sprint.completed",
  AGENT_RUN_STARTED: "agent.run.started",
  AGENT_RUN_COMPLETED: "agent.run.completed",
  AGENT_RECOMMENDATION_CREATED: "agent.recommendation.created",
  AGENT_APPROVAL_REQUIRED: "agent.approval.required",
  AGENT_APPROVAL_RESOLVED: "agent.approval.resolved",
  BILL_DUE_SOON: "billing.bill.due_soon",
  BILL_OVERDUE: "billing.bill.overdue",
  NOTIFICATION_CREATED: "notification.created",
  BRIEFING_READY: "briefing.ready",
  INTEGRATION_SYNC_COMPLETED: "integration.sync.completed",
  INTEGRATION_SYNC_FAILED: "integration.sync.failed",
  INTEGRATION_CONNECTED: "integration.connected",
  GIT_COMMIT_RECEIVED: "git.commit.received",
  PLUGIN_INSTALLED: "plugin.installed",
  KNOWLEDGE_NODE_CREATED: "knowledge.node.created",
  KNOWLEDGE_EDGE_CREATED: "knowledge.edge.created",
} as const;

export type DomainEventType = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export function getEventVersion(type: string): number {
  const entry = EVENT_CATALOG[type as PlatformEventType];
  return entry?.version ?? 1;
}

export function isKnownEventType(type: string): type is PlatformEventType {
  return type in EVENT_CATALOG;
}

export function listEventsByCategory(category: EventCategory): PlatformEventType[] {
  return (Object.entries(EVENT_CATALOG) as [PlatformEventType, (typeof EVENT_CATALOG)[PlatformEventType]][])
    .filter(([, meta]) => meta.category === category)
    .map(([type]) => type);
}
