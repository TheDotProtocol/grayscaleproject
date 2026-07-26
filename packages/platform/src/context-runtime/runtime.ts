/** Context Runtime — immutable CompanyContext assembly (ADR-024) */

import type { CompanyContext } from "../executive/context.js";

export const CONTEXT_ASSEMBLER_IDS = [
  "organizational-intelligence",
  "founder",
  "operational",
  "financial",
  "strategic",
  "memory",
  "graph",
  "timeline",
  "integration",
  "plugin",
  "pulse",
  "readiness",
  "intent",
  "temporal",
  "signals",
  "insights",
  "platform-health",
  "platform-reliability",
  "security",
  "governance",
  "attention",
  "twin",
  "council",
  "homeostasis",
  "signal-correlation",
  "simulation",
  "foresight",
  "antifragility",
  "decision-economy",
  "alignment",
  "scenario-planning",
  "forecast",
  "organizational-runtime",
] as const;

export type ContextAssemblerId = (typeof CONTEXT_ASSEMBLER_IDS)[number];

export interface ContextAssemblerResult {
  assemblerId: ContextAssemblerId;
  durationMs: number;
  version: string;
  success: boolean;
  error?: string;
}

export interface ContextRuntimeMetadata {
  cacheKey: string;
  cached: boolean;
  cacheExpiresAt?: string;
  assemblyDurationMs: number;
  assemblerResults: ContextAssemblerResult[];
  contextVersion: string;
  immutable: true;
}

export interface ImmutableCompanyContext extends CompanyContext {
  contextRuntime: ContextRuntimeMetadata;
}

export interface ContextCacheEntry {
  key: string;
  context: ImmutableCompanyContext;
  expiresAt: string;
  createdAt: string;
}

export interface ContextCachePort {
  get(key: string): Promise<ImmutableCompanyContext | null>;
  set(key: string, context: ImmutableCompanyContext, ttlSeconds: number): Promise<void>;
  invalidate(companyId: string): Promise<void>;
  buildCacheKey(companyId: string, founderUserId?: string): string;
}

export interface ContextRuntimePort {
  assemble(companyId: string, options?: { correlationId?: string; founderUserId?: string; bypassCache?: boolean }): Promise<ImmutableCompanyContext>;
  invalidateCache(companyId: string): Promise<void>;
}

export interface ContextAssemblerPort {
  readonly assemblerId: ContextAssemblerId;
  readonly version: string;
  assemble(companyId: string, options?: { founderUserId?: string; correlationId?: string }): Promise<Partial<CompanyContext>>;
}
