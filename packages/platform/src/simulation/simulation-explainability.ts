/** Simulation Explainability — constitutional contracts (Sprint 3 Phase C) */

import type {
  SimulationAssumption,
  SimulationConstraint,
  SimulationEvidence,
  SimulationOutcome,
} from "./simulation-engine.js";

export const SIMULATION_EXPLAINABILITY_VERSION = "1.0.0";

export interface SimulationHomeostasisChange {
  metric: string;
  before: number;
  after: number;
  delta: number;
  reason: string;
}

export interface SimulationStressChange {
  before: number;
  after: number;
  contributors: string[];
}

export interface SimulationCapacityChange {
  metric: string;
  before: number;
  after: number;
}

export interface SimulationExplainability {
  sessionId: string;
  companyId: string;
  version: string;
  assembledAt: string;
  summary: string;
  startingAssumptions: SimulationAssumption[];
  evidenceUsed: SimulationEvidence[];
  policiesApplied: string[];
  constraintsRespected: SimulationConstraint[];
  signalsConsumed: string[];
  twinStateSummary: string;
  twinVersionId: string;
  homeostasisChanges: SimulationHomeostasisChange[];
  stressChanges: SimulationStressChange;
  capacityChanges: SimulationCapacityChange[];
  confidence: number;
  unknowns: string[];
  alternativeOutcomes: SimulationOutcome[];
  rollbackAssumptions: string[];
  pipelineStagesCompleted: string[];
}

export interface SimulationExplainabilityPort {
  explain(sessionId: string): Promise<SimulationExplainability>;
}
