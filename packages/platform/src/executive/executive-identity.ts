/** Immutable executive identity — canonical record (Manifesto §40, ADR-014) */

import type { ExecutiveIdentity } from "./runtime.js";

export const EXECUTIVE_ROSTER = [
  "athena",
  "atlas",
  "ledger",
  "mercury",
  "sentinel",
  "forge",
  "navigator",
] as const;

export type ExecutiveCanonicalId = (typeof EXECUTIVE_ROSTER)[number];

export interface ExecutiveIdentityRecord {
  /** Stable UUID — never changes */
  id: string;
  /** Canonical internal name — e.g. `athena` */
  canonicalName: ExecutiveCanonicalId | string;
  /** Human-readable title */
  title: string;
  /** Organizational department */
  department: string;
  /** Role mission statement */
  mission: string;
  /** Reports to: founder | executive id */
  reportsTo: string;
  /** Scoped responsibilities */
  responsibilities: string[];
  /** Explicit decision authority */
  authority: string[];
  /** Hard boundaries — what this executive must NOT do */
  limitations: string[];
  /** Declared capability IDs */
  capabilities: string[];
  /** Permission summary keys */
  permissions: string[];
  /** KPI definitions */
  kpis: ExecutiveKpi[];
  /** Mission Control widget IDs */
  missionControlWidgets: string[];
  /** Semver */
  version: string;
  /** Immutable after registration */
  registeredAt: string;
}

export interface ExecutiveKpi {
  id: string;
  name: string;
  description: string;
  target?: number;
  unit?: string;
}

export function toRuntimeIdentity(record: ExecutiveIdentityRecord): ExecutiveIdentity {
  return {
    id: record.id,
    name: record.canonicalName,
    title: record.title,
    department: record.department,
    description: record.mission,
  };
}

export interface ExecutiveIdentityPort {
  /** Register immutable identity — fails if ID exists */
  register(record: Omit<ExecutiveIdentityRecord, "registeredAt">): Promise<ExecutiveIdentityRecord>;
  get(canonicalName: string, companyId: string): Promise<ExecutiveIdentityRecord | null>;
  list(companyId: string): Promise<ExecutiveIdentityRecord[]>;
}
