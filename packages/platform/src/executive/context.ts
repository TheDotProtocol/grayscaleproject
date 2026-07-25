import type { PlatformEvent } from "../events/envelope.js";
import type { OperatorIdentityProfile } from "./identity-engine.js";
import type { ExecutiveCognitiveProfile } from "./cognitive-model.js";
import type { DiscoverySnapshot } from "./discovery-engine.js";
import type { MemoryRecord } from "../memory/types.js";
import type { GraphSummary } from "../graph/ports.js";
import type { StrategicIntelligenceContext } from "../intelligence/context.js";
import type { CompanyOperatingMode } from "../intelligence/types.js";

/** Unified company context — the only input future executives receive */

export interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
  stage: string;
  industry?: string;
  metadata: Record<string, unknown>;
}

export interface FounderProfileContext {
  userId: string;
  name: string;
  email: string;
  bio?: string;
  timezone: string;
  preferences: Record<string, unknown>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  source: "graph" | "legacy";
}

export interface TaskSummary {
  id: string;
  title: string;
  status: string;
  projectId?: string;
}

export interface BillSummary {
  id: string;
  name: string;
  amountCents: number;
  currency: string;
  dueDate: string;
  isPaid: boolean;
  category?: string;
}

export interface CashPosition {
  totalUnpaidCents: number;
  totalOverdueCents: number;
  currency: string;
  runwayMonths?: number;
}

export interface PulseSummary {
  recentCount: number;
  healthScore: number;
  categories: Record<string, number>;
}

export interface MissionStatus {
  activeGoals: number;
  openRecommendations: number;
  pendingDecisions: number;
  blockedObjectives: number;
  criticalRisks: number;
}

export interface PluginStatus {
  id: string;
  name: string;
  version: string;
  hooks: string[];
  source: string;
}

export interface InfrastructureStatus {
  databaseConnected: boolean;
  eventStoreHealthy: boolean;
  graphNodeCount: number;
  memoryRecordCount: number;
}

export interface SecurityStatus {
  executivesEnabled: boolean;
  activeIntegrations: number;
  disconnectedIntegrations: number;
}

export interface IntegrationStatus {
  id: string;
  provider: string;
  status: string;
  lastSyncAt?: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description?: string;
  occurredAt: string;
  category?: string;
}

export interface CompanyContext {
  companyId: string;
  assembledAt: string;
  correlationId: string;

  company: CompanyProfile;
  founder?: FounderProfileContext;
  operatingMode: CompanyOperatingMode;

  goals: StrategicIntelligenceContext["goals"];
  objectives: StrategicIntelligenceContext["objectives"];
  projects: ProjectSummary[];
  tasks: TaskSummary[];

  timeline: TimelineEntry[];
  memory: MemoryRecord[];
  graph: GraphSummary;
  strategy: StrategicIntelligenceContext;

  recommendations: StrategicIntelligenceContext["openRecommendations"];
  decisions: StrategicIntelligenceContext["pendingDecisions"];
  risks: StrategicIntelligenceContext["topRisks"];
  opportunities: StrategicIntelligenceContext["topOpportunities"];

  bills: BillSummary[];
  cashPosition: CashPosition;

  pulse: PulseSummary;
  missionStatus: MissionStatus;
  plugins: PluginStatus[];

  infrastructure: InfrastructureStatus;
  security: SecurityStatus;
  integrations: IntegrationStatus[];

  recentEvents: PlatformEvent[];

  /** Sprint 2 — assembled by platform, read-only to executives (ADR-014) */
  identity?: OperatorIdentityProfile;
  cognitiveModel?: ExecutiveCognitiveProfile;
  discovery?: DiscoverySnapshot;
}

export interface CompanyContextAssemblerPort {
  assemble(companyId: string, options?: { correlationId?: string; founderUserId?: string }): Promise<CompanyContext>;
}
