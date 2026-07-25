/** Platform Governance — AIP-39 */

export const GOVERNANCE_ENTRY_TYPES = [
  "architecture_decision",
  "configuration_change",
  "policy_change",
  "permission_change",
  "feature_flag_change",
  "plugin_lifecycle",
  "executive_capability",
  "system_configuration",
] as const;

export type GovernanceEntryType = (typeof GOVERNANCE_ENTRY_TYPES)[number];

export interface GovernanceEntry {
  id: string;
  type: GovernanceEntryType;
  title: string;
  description: string;
  actorId?: string;
  correlationId: string;
  eventId?: string;
  metadata: Record<string, unknown>;
  recordedAt: string;
}

export interface GovernancePort {
  record(entry: Omit<GovernanceEntry, "id" | "recordedAt" | "correlationId"> & { correlationId?: string }): Promise<GovernanceEntry>;
  search(q?: string, type?: GovernanceEntryType, limit?: number): Promise<GovernanceEntry[]>;
}
