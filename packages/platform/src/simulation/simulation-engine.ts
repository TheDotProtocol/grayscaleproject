/** Simulation Framework — contracts (Sprint 3 Phase C, ADR-040) */

export const SIMULATION_ENGINE_VERSION = "1.0.0";

export type SimulationStatus = "draft" | "running" | "completed" | "rolled_back" | "archived";

export interface SimulationAssumption {
  id: string;
  label: string;
  value: unknown;
  source: "founder" | "executive" | "twin" | "scenario";
}

export interface SimulationConstraint {
  id: string;
  label: string;
  enforced: boolean;
  source: string;
}

export interface SimulationEvidence {
  evidenceId: string;
  sourceType: string;
  summary: string;
  weight: number;
}

export interface SimulationBranch {
  branchId: string;
  label: string;
  parentBranchId?: string;
  probability: number;
}

export interface SimulationOutcome {
  outcomeId: string;
  label: string;
  metrics: Record<string, number>;
  confidence: number;
  explanation: string;
}

export interface SimulationComparison {
  baselineOutcomeId: string;
  alternativeOutcomeId: string;
  delta: Record<string, number>;
  preferred: "baseline" | "alternative" | "inconclusive";
}

export interface SimulationConfidence {
  overall: number;
  evidenceWeight: number;
  assumptionRisk: number;
}

export interface SimulationExplanation {
  sessionId: string;
  summary: string;
  assumptions: SimulationAssumption[];
  constraints: SimulationConstraint[];
  evidence: SimulationEvidence[];
  alternatives: string[];
  unknowns: string[];
}

export interface SimulationAuditEntry {
  entryId: string;
  action: string;
  actorId: string;
  recordedAt: string;
  details: Record<string, unknown>;
}

export interface SimulationMetrics {
  sessionId: string;
  durationMs: number;
  branchCount: number;
  outcomeCount: number;
  realityModified: false;
}

export interface SimulationHistoryEntry {
  sessionId: string;
  scenarioType: string;
  status: SimulationStatus;
  startedAt: string;
  completedAt?: string;
}

export interface SimulationReplay {
  sessionId: string;
  events: Array<{ sequence: number; type: string; payload: Record<string, unknown> }>;
}

export type SimulationLifecycleStage =
  | "created"
  | "assumptions_set"
  | "constraints_applied"
  | "running"
  | "outcomes_generated"
  | "compared"
  | "explained"
  | "archived";

export interface SimulationLifecycle {
  sessionId: string;
  currentStage: SimulationLifecycleStage;
  stages: Array<{ stage: SimulationLifecycleStage; completedAt?: string }>;
}

export interface SimulationScenario {
  scenarioId: string;
  type: SimulationScenarioType;
  label: string;
  description: string;
  assumptions: SimulationAssumption[];
  constraints: SimulationConstraint[];
}

export type SimulationScenarioType =
  | "growth"
  | "market_change"
  | "hiring"
  | "layoffs"
  | "budget_change"
  | "infrastructure_failure"
  | "security_incident"
  | "vendor_outage"
  | "revenue_decline"
  | "rapid_expansion"
  | "new_product_launch"
  | "regulatory_change"
  | "executive_loss"
  | "unknown_event"
  | "custom";

export interface SimulationSession {
  sessionId: string;
  companyId: string;
  twinVersionId: string;
  scenario: SimulationScenario;
  status: SimulationStatus;
  branches: SimulationBranch[];
  outcomes: SimulationOutcome[];
  confidence: SimulationConfidence;
  explanation?: SimulationExplanation;
  lifecycle: SimulationLifecycle;
  realityModified: false;
  correlationId: string;
  createdAt: string;
  completedAt?: string;
}

export interface SimulationRollback {
  sessionId: string;
  rolledBackAt: string;
  reason: string;
  realityPreserved: true;
}

/** TwinSimulation alias for constitutional cross-reference */
export type TwinSimulation = SimulationSession;

export interface SimulationEnginePort {
  createSession(input: {
    companyId: string;
    twinVersionId: string;
    scenario: Omit<SimulationScenario, "scenarioId">;
    correlationId?: string;
  }): Promise<SimulationSession>;
  runSession(sessionId: string): Promise<SimulationSession>;
  compareOutcomes(sessionId: string, baselineId: string, alternativeId: string): Promise<SimulationComparison>;
  explain(sessionId: string): Promise<SimulationExplanation>;
  rollback(sessionId: string, reason: string): Promise<SimulationRollback>;
  getHistory(companyId: string): Promise<SimulationHistoryEntry[]>;
  replay(sessionId: string): Promise<SimulationReplay>;
  getMetrics(sessionId: string): Promise<SimulationMetrics>;
}
