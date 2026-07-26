/** Simulation Runtime ports — Sprint 3 Phase C */

import type {
  SimulationAuditEntry,
  SimulationComparison,
  SimulationEnginePort,
  SimulationHistoryEntry,
  SimulationMetrics,
  SimulationReplay,
  SimulationRollback,
  SimulationSession,
} from "./simulation-engine.js";
import type { SimulationCertificationReport } from "./simulation-certification.js";

export type SimulationRuntimePort = SimulationEnginePort;

export interface SimulationRunnerPort {
  runPipeline(sessionId: string): Promise<SimulationSession>;
}

export interface SimulationSnapshotPort {
  captureSnapshot(sessionId: string): Promise<{ sessionId: string; snapshotAt: string; twinVersionId: string; stateHash: string }>;
}

export interface SimulationAuditPort {
  getAuditTrail(sessionId: string): Promise<SimulationAuditEntry[]>;
  appendAudit(entry: Omit<SimulationAuditEntry, "entryId">): Promise<SimulationAuditEntry>;
}

export interface SimulationHistoryPort {
  getHistory(companyId: string): Promise<SimulationHistoryEntry[]>;
}

export interface SimulationComparisonPort {
  compareOutcomes(sessionId: string, baselineId: string, alternativeId: string): Promise<SimulationComparison>;
  compareToTwin(sessionId: string): Promise<{ sessionId: string; twinVersionId: string; deltas: Record<string, number> }>;
}

export interface SimulationReplayPort {
  replay(sessionId: string): Promise<SimulationReplay>;
}

export interface SimulationMetricsPort {
  getMetrics(sessionId: string): Promise<SimulationMetrics>;
  getAggregateMetrics(companyId: string): Promise<{ totalSessions: number; completedSessions: number; averageDurationMs: number }>;
}

export interface SimulationVersionPort {
  getVersion(sessionId: string): Promise<{ sessionId: string; engineVersion: string; pipelineVersion: string }>;
}

export interface SimulationHealth {
  companyId: string;
  status: "healthy" | "degraded" | "unavailable";
  activeSessionCount: number;
  lastCompletedAt?: string;
  certificationScore?: number;
  assessedAt: string;
}

export interface SimulationCapabilities {
  scenarioTypes: string[];
  maxConcurrentSessions: number;
  replayEnabled: boolean;
  certificationEnabled: boolean;
  twinSynchronizationRequired: true;
}

export interface SimulationContextSnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  activeSimulations: SimulationHistoryEntry[];
  recentSessions: SimulationHistoryEntry[];
  simulationHealth: SimulationHealth;
  simulationCapabilities: SimulationCapabilities;
  latestCertification?: SimulationCertificationReport;
}

export interface SimulationContextPort {
  assemble(companyId: string): Promise<SimulationContextSnapshot>;
}
