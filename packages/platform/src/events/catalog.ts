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

  // ─── Organizational Intelligence (Sprint 2 Phase A.2 — ADR-015–022) ─
  "organizational-dna.updated": {
    version: 1,
    category: "organization",
    description: "Organizational DNA record updated or approved",
  },
  "organizational-dna.proposed": {
    version: 1,
    category: "organization",
    description: "Organizational DNA change proposed pending approval",
  },
  "founder-dna.evidence.recorded": {
    version: 1,
    category: "organization",
    description: "Founder DNA updated with evidence",
  },
  "organizational-emotion.observed": {
    version: 1,
    category: "organization",
    description: "Organizational emotional metric observed",
  },
  "organizational-cognitive.evidence.recorded": {
    version: 1,
    category: "organization",
    description: "Organizational cognitive profile updated with evidence",
  },
  "organizational-learning.recorded": {
    version: 1,
    category: "organization",
    description: "Organizational learning record captured",
  },
  "organizational-learning.linked": {
    version: 1,
    category: "organization",
    description: "Learning record linked to memory/graph/strategy",
  },
  "organizational-wisdom.proposed": {
    version: 1,
    category: "organization",
    description: "Wisdom principle proposed",
  },
  "organizational-wisdom.approved": {
    version: 1,
    category: "organization",
    description: "Wisdom principle approved",
  },
  "organizational-culture.observed": {
    version: 1,
    category: "organization",
    description: "Culture dimension observed",
  },
  "organizational-reputation.signal.recorded": {
    version: 1,
    category: "organization",
    description: "Reputation signal recorded (manual/evidence)",
  },
  "organizational-adaptation.metric.recorded": {
    version: 1,
    category: "organization",
    description: "Adaptation metric recorded",
  },

  // ─── Context Runtime (Sprint 2 Phase A.4 — ADR-023–027) ────────
  "intent.proposed": { version: 1, category: "organization", description: "Intent record proposed" },
  "intent.approved": { version: 1, category: "organization", description: "Intent record approved" },
  "intent.updated": { version: 1, category: "organization", description: "Intent hierarchy updated" },
  "intent.snapshot.captured": { version: 1, category: "organization", description: "Intent snapshot captured" },
  "context-runtime.assembled": { version: 1, category: "operations", description: "Immutable CompanyContext assembled" },
  "context-runtime.cache.invalidated": { version: 1, category: "operations", description: "Context cache invalidated" },
  "runtime.heartbeat.completed": { version: 1, category: "operations", description: "Organizational heartbeat cycle completed" },
  "runtime.orchestration.started": { version: 1, category: "operations", description: "Runtime orchestration started" },
  "runtime.orchestration.completed": { version: 1, category: "operations", description: "Runtime orchestration completed" },
  "runtime.certified": { version: 1, category: "operations", description: "Organizational runtime certification passed" },
  "temporal.snapshot.captured": { version: 1, category: "organization", description: "Temporal snapshot captured" },
  "temporal.trend.detected": { version: 1, category: "organization", description: "Historical trend detected" },
  "temporal.pattern.detected": { version: 1, category: "organization", description: "Historical pattern detected" },
  "organizational-snapshot.captured": { version: 1, category: "organization", description: "Full organizational snapshot captured" },
  "organizational-signal.emitted": { version: 1, category: "organization", description: "Organizational signal emitted" },
  "organizational-signal.consumed": { version: 1, category: "organization", description: "Organizational signal consumed" },
  "organizational-insight.generated": { version: 1, category: "organization", description: "Explainable observation generated" },

  // ─── Executive Notebook & Curiosity (Sprint 2 Phase B — ADR-028–030) ─
  "executive.notebook.recorded": { version: 1, category: "executive", description: "Executive notebook entry recorded" },
  "executive.notebook.versioned": { version: 1, category: "executive", description: "Executive notebook entry version appended" },
  "executive.curiosity.question.asked": { version: 1, category: "executive", description: "Curiosity question generated" },
  "executive.curiosity.investigation.started": { version: 1, category: "executive", description: "Curiosity investigation started" },
  "executive.curiosity.investigation.completed": { version: 1, category: "executive", description: "Curiosity investigation completed" },
  "executive.skeptic.pass.completed": { version: 1, category: "executive", description: "Skeptic pass completed on recommendation draft" },
  "athena.discovery.completed": { version: 1, category: "executive", description: "Athena discovery pipeline completed" },
  "athena.recommendation.drafted": { version: 1, category: "executive", description: "Athena recommendation draft with full explainability" },

  // ─── Executive Council Runtime (Sprint 3 Phase B — ADR-037) ───
  "council.session.started": { version: 1, category: "council", description: "Council session started" },
  "council.session.closed": { version: 1, category: "council", description: "Council session closed" },
  "council.issue.opened": { version: 1, category: "council", description: "Council issue opened with decision classification" },
  "council.issue.classified": { version: 1, category: "council", description: "Decision class assigned before deliberation" },
  "council.evidence.submitted": { version: 1, category: "council", description: "Council evidence submitted" },
  "council.deliberation.recorded": { version: 1, category: "council", description: "Structured deliberation recorded via bus" },
  "council.vote.cast": { version: 1, category: "council", description: "Council vote cast with evidence" },
  "council.consensus.measured": { version: 1, category: "council", description: "Consensus measured deterministically" },
  "council.resolution.proposed": { version: 1, category: "council", description: "Council resolution proposed" },
  "council.decision.approved": { version: 1, category: "council", description: "Council decision approved" },
  "council.founder.escalated": { version: 1, category: "council", description: "Issue escalated to Founder" },
  "council.founder.override": { version: 1, category: "council", description: "Founder override recorded" },
  "council.audit.recorded": { version: 1, category: "council", description: "Council audit entry recorded" },
  "attention.snapshot.captured": { version: 1, category: "organization", description: "Organizational attention snapshot captured" },

  // ─── Living Organizational Twin (Sprint 3 Phase C — ADR-039–041) ───
  "twin.state.updated": { version: 1, category: "twin", description: "Living Organizational Twin state updated" },
  "twin.snapshot.captured": { version: 1, category: "twin", description: "Twin snapshot captured at milestone" },
  "twin.timeline.entry": { version: 1, category: "twin", description: "Twin timeline entry recorded" },
  "twin.replay.completed": { version: 1, category: "twin", description: "Twin replay reconstruction completed" },
  "twin.learning.recorded": { version: 1, category: "twin", description: "Twin learning entry recorded" },
  "twin.reality.compared": { version: 1, category: "twin", description: "Reality compared against forecast/simulation" },
  "simulation.session.created": { version: 1, category: "simulation", description: "Simulation session created" },
  "simulation.session.completed": { version: 1, category: "simulation", description: "Simulation session completed" },
  "simulation.session.rolled_back": { version: 1, category: "simulation", description: "Simulation rolled back — reality preserved" },
  "forecast.generated": { version: 1, category: "forecast", description: "Organizational forecast generated as hypothesis" },
  "forecast.superseded": { version: 1, category: "forecast", description: "Forecast superseded by newer hypothesis" },
  "forecast.validated": { version: 1, category: "forecast", description: "Forecast validated against reality" },

  // ─── Multi-Executive Organization (Sprint 3 Phase D) ───
  "executive.registered": { version: 1, category: "executive", description: "Executive identity registered" },
  "executive.network.collaboration": { version: 1, category: "executive", description: "Executive network collaboration recorded" },
  "atlas.discovery.completed": { version: 1, category: "executive", description: "Atlas discovery completed via twin" },
  "atlas.recommendation.drafted": { version: 1, category: "executive", description: "Atlas twin-centric recommendation drafted" },
  "ledger.discovery.completed": { version: 1, category: "executive", description: "Ledger discovery completed via twin" },
  "ledger.recommendation.drafted": { version: 1, category: "executive", description: "Ledger twin-centric recommendation drafted" },
  "mercury.discovery.completed": { version: 1, category: "executive", description: "Mercury discovery completed via twin" },
  "mercury.recommendation.drafted": { version: 1, category: "executive", description: "Mercury twin-centric recommendation drafted" },
  "sentinel.discovery.completed": { version: 1, category: "executive", description: "Sentinel discovery completed via twin" },
  "sentinel.recommendation.drafted": { version: 1, category: "executive", description: "Sentinel twin-centric recommendation drafted" },
  "navigator.discovery.completed": { version: 1, category: "executive", description: "Navigator discovery completed via twin" },
  "navigator.recommendation.drafted": { version: 1, category: "executive", description: "Navigator twin-centric recommendation drafted" },
  "forge.discovery.completed": { version: 1, category: "executive", description: "Forge discovery completed via twin" },
  "forge.recommendation.drafted": { version: 1, category: "executive", description: "Forge twin-centric recommendation drafted" },
  "council.collaboration.recorded": { version: 1, category: "council", description: "Council collaboration session metrics recorded" },

  // ─── Executive Collaboration (Sprint 4 Phase B) ───
  "council.scheduled": { version: 1, category: "council", description: "Council session scheduled by organizational runtime" },
  "council.deliberation.started": { version: 1, category: "council", description: "Executive deliberation proposal started" },
  "council.deliberation.stage.advanced": { version: 1, category: "council", description: "Deliberation stage advanced deterministically" },
  "council.deliberation.completed": { version: 1, category: "council", description: "All 12 deliberation stages completed" },
  "collaboration.request.sent": { version: 1, category: "executive", description: "Executive collaboration request sent via network" },
  "collaboration.request.responded": { version: 1, category: "executive", description: "Executive collaboration request responded" },
  "collaboration.certified": { version: 1, category: "council", description: "Executive collaboration certification passed" },
  "council.memory.appended": { version: 1, category: "council", description: "Immutable council memory entry appended" },

  // ─── Organizational Attention Budget (Sprint 4 Phase C) ───
  "attention-budget.allocated": { version: 1, category: "organization", description: "Organizational attention allocated" },
  "attention-budget.certified": { version: 1, category: "organization", description: "Attention budget certification passed" },
  "attention-budget.debt.recorded": { version: 1, category: "organization", description: "Attention debt recorded" },
  "attention-budget.recovery.assessed": { version: 1, category: "organization", description: "Attention recovery assessed" },
  "autonomy.governance.validated": { version: 1, category: "organization", description: "Autonomous execution governance validated (not enabled)" },

  // ─── Organizational Evolution (Sprint 4 — ADR-046–051) ───
  "memory-evolution.layer.created": { version: 1, category: "organization", description: "Memory evolution layer added without mutating source memory" },
  "organizational-learning.validated": { version: 1, category: "organization", description: "Organizational learning validated with evidence" },
  "organizational-wisdom.institutionalized": { version: 1, category: "organization", description: "Wisdom promoted to institutional principle" },
  "strategy-evolution.proposed": { version: 1, category: "organization", description: "Strategy evolution proposal created" },
  "strategy-evolution.reviewed": { version: 1, category: "organization", description: "Strategy evolution proposal reviewed" },
  "organizational-reflection.completed": { version: 1, category: "organization", description: "Periodic organizational reflection completed" },
  "organizational-autonomy.policy.approved": { version: 1, category: "organization", description: "Autonomy policy approved by Founder" },
  "organizational-autonomy.action.recorded": { version: 1, category: "organization", description: "Autonomous action recorded with audit" },
  "org-intelligence-graph.updated": { version: 1, category: "organization", description: "Organizational intelligence graph updated" },
  "organizational-evolution.certified": { version: 1, category: "organization", description: "Organizational evolution certification completed" },
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
