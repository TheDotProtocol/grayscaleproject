/** Living Organizational Twin — core contracts (Sprint 3 Phase C, ADR-039) */

export const TWIN_ENGINE_VERSION = "1.0.0";

export type TwinTemporalScope = "past" | "present" | "future";

export interface TwinVersion {
  versionId: string;
  companyId: string;
  sequence: number;
  capturedAt: string;
  scope: TwinTemporalScope;
  parentVersionId?: string;
  correlationId: string;
}

export interface TwinIdentity {
  companyId: string;
  name: string;
  stage: string;
  industry?: string;
  persistedSince: string;
}

export interface TwinState {
  version: TwinVersion;
  identity: TwinIdentity;
  scope: TwinTemporalScope;
  assembledAt: string;
  confidence: number;
  evidenceCount: number;
}

export interface TwinSnapshot {
  snapshotId: string;
  companyId: string;
  versionId: string;
  capturedAt: string;
  scope: TwinTemporalScope;
  stateHash: string;
  milestone?: string;
}

export interface TwinTimelineEntry {
  entryId: string;
  companyId: string;
  occurredAt: string;
  eventType: string;
  label: string;
  versionId?: string;
  correlationId: string;
}

export interface TwinTimeline {
  companyId: string;
  entries: TwinTimelineEntry[];
  from: string;
  to: string;
}

export interface TwinReplayEvent {
  sequence: number;
  eventType: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface TwinReplay {
  companyId: string;
  versionId: string;
  events: TwinReplayEvent[];
  reconstructedAt: string;
}

export interface TwinHistoricalState extends TwinState {
  scope: "past";
  pointInTime: string;
}

export interface TwinPresentState extends TwinState {
  scope: "present";
}

export interface TwinFutureState extends TwinState {
  scope: "future";
  projectionHorizonDays: number;
  assumptions: string[];
}

export interface TwinProjection {
  projectionId: string;
  companyId: string;
  horizonDays: number;
  confidence: number;
  assumptions: string[];
  generatedAt: string;
}

export interface TwinEventStream {
  companyId: string;
  events: TwinReplayEvent[];
  fromSequence: number;
  toSequence: number;
}

export interface TwinComparison {
  companyId: string;
  versionA: string;
  versionB: string;
  differences: Array<{ field: string; before: unknown; after: unknown }>;
  comparedAt: string;
}

export interface TwinEvolution {
  companyId: string;
  versions: TwinVersion[];
  milestones: string[];
  evolutionScore: number;
}

export interface TwinLearning {
  companyId: string;
  predictionId: string;
  predictedOutcome: string;
  actualOutcome?: string;
  variance?: number;
  learnedAt: string;
}

export interface TwinMetrics {
  companyId: string;
  versionCount: number;
  snapshotCount: number;
  simulationCount: number;
  forecastCount: number;
  learningEntries: number;
  computedAt: string;
}

export interface TwinHealth {
  companyId: string;
  status: "healthy" | "degraded" | "critical";
  integrityScore: number;
  consistencyScore: number;
  synchronizationScore: number;
  checkedAt: string;
}

export interface TwinIntegrity {
  companyId: string;
  versionChainValid: boolean;
  replayConsistent: boolean;
  auditComplete: boolean;
  checkedAt: string;
}

export interface TwinConsistency {
  companyId: string;
  presentMatchesReality: boolean;
  simulationIsolated: boolean;
  forecastNotCommitted: boolean;
  checkedAt: string;
}

export interface TwinSynchronization {
  companyId: string;
  lastSyncedAt: string;
  sources: string[];
  lagMs: number;
  status: "synced" | "stale" | "drifting";
}

export interface TwinConfidence {
  overall: number;
  evidence: number;
  temporal: number;
  simulation?: number;
  forecast?: number;
}

export interface TwinEvidence {
  evidenceId: string;
  source: string;
  sourceType: "memory" | "graph" | "signal" | "insight" | "decision" | "attention" | "intent" | "temporal";
  summary: string;
  capturedAt: string;
}

export interface TwinRealityComparison {
  companyId: string;
  forecastId?: string;
  simulationId?: string;
  predicted: Record<string, unknown>;
  actual: Record<string, unknown>;
  variance: number;
  comparedAt: string;
  realityWins: true;
}

export interface TwinAttention {
  saturation: string;
  driftScore: number;
  congestionScore: number;
}

export interface TwinIntent {
  activeThemes: string[];
  priorityCount: number;
}

export interface TwinWisdom {
  insights: string[];
  learnedPatterns: string[];
}

export interface TwinDecisionHistory {
  decisionCount: number;
  recentDecisions: Array<{ id: string; title: string; decisionClass: string; decidedAt: string }>;
}

export interface TwinMemoryView {
  recordCount: number;
  recentThemes: string[];
}

export interface TwinGraphView {
  nodeCount: number;
  edgeCount: number;
  density: number;
}

export interface TwinStrategyView {
  activeGoals: number;
  openRecommendations: number;
  criticalRisks: number;
}

export interface TwinSignalView {
  signalCount: number;
  categories: Record<string, number>;
}

export interface TwinInsightView {
  insightCount: number;
  topInsights: string[];
}

export interface TwinOrganizationView {
  stage: string;
  operatingMode: string;
  missionStatus: Record<string, number>;
}

/** Canonical Living Organizational Twin — one model, all temporal scopes */
export interface OrganizationalTwin {
  companyId: string;
  version: string;
  assembledAt: string;
  correlationId: string;
  present: TwinPresentState;
  historical?: TwinHistoricalState;
  future?: TwinFutureState;
  identity: TwinIdentity;
  confidence: TwinConfidence;
  evidence: TwinEvidence[];
  attention?: TwinAttention;
  intent?: TwinIntent;
  wisdom?: TwinWisdom;
  decisionHistory?: TwinDecisionHistory;
  memoryView: TwinMemoryView;
  graphView: TwinGraphView;
  strategyView: TwinStrategyView;
  signalView: TwinSignalView;
  insightView: TwinInsightView;
  organizationView: TwinOrganizationView;
  timeline?: TwinTimeline;
  metrics?: TwinMetrics;
  health?: TwinHealth;
}
