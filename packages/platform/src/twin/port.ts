import type {
  OrganizationalTwin,
  TwinComparison,
  TwinEvolution,
  TwinHealth,
  TwinHistoricalState,
  TwinIntegrity,
  TwinLearning,
  TwinMetrics,
  TwinPresentState,
  TwinReplay,
  TwinRealityComparison,
  TwinSnapshot,
  TwinSynchronization,
  TwinTimeline,
  TwinVersion,
} from "./twin-model.js";

/** Living Organizational Twin port — Sprint 3 Phase C */
export interface OrganizationalTwinPort {
  assemble(companyId: string, options?: { correlationId?: string; pointInTime?: string }): Promise<OrganizationalTwin>;
  getPresentState(companyId: string): Promise<TwinPresentState>;
  getHistoricalState(companyId: string, pointInTime: string): Promise<TwinHistoricalState>;
  captureSnapshot(companyId: string, milestone?: string): Promise<TwinSnapshot>;
  getTimeline(companyId: string, filters?: { from?: string; to?: string }): Promise<TwinTimeline>;
  replay(companyId: string, versionId: string): Promise<TwinReplay>;
  compareVersions(companyId: string, versionA: string, versionB: string): Promise<TwinComparison>;
  getEvolution(companyId: string): Promise<TwinEvolution>;
  getHealth(companyId: string): Promise<TwinHealth>;
  getMetrics(companyId: string): Promise<TwinMetrics>;
  getIntegrity(companyId: string): Promise<TwinIntegrity>;
  getSynchronization(companyId: string): Promise<TwinSynchronization>;
  recordLearning(input: Omit<TwinLearning, "learnedAt">): Promise<TwinLearning>;
  compareReality(input: Omit<TwinRealityComparison, "comparedAt" | "realityWins">): Promise<TwinRealityComparison>;
  listVersions(companyId: string): Promise<TwinVersion[]>;
}

/** Sprint 3 Phase B/ONS — alias naming */
export type TwinRuntimePort = OrganizationalTwinPort;

/** Assembles twin from CompanyContext without direct storage access */
export interface TwinAssemblerPort {
  assembleFromContext(
    companyId: string,
    context: import("../executive/context.js").CompanyContext,
    options?: { correlationId?: string; versionId?: string },
  ): Promise<OrganizationalTwin>;
}
