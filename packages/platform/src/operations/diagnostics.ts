/** Platform Diagnostics — AIP-34 */

export const DIAGNOSTIC_SUBSYSTEMS = [
  "memory_integrity",
  "graph_integrity",
  "strategy_rules",
  "executive_runtime",
  "plugin_sandbox",
  "integration_sync",
  "security",
  "storage",
  "queue_health",
  "event_store",
] as const;

export type DiagnosticSubsystem = (typeof DIAGNOSTIC_SUBSYSTEMS)[number];

export const DIAGNOSTIC_SEVERITIES = ["info", "warning", "error", "critical"] as const;
export type DiagnosticSeverity = (typeof DIAGNOSTIC_SEVERITIES)[number];

export interface DiagnosticFinding {
  id: string;
  subsystem: DiagnosticSubsystem;
  severity: DiagnosticSeverity;
  category: string;
  title: string;
  description: string;
  evidence: Record<string, unknown>;
  remediation?: string;
  detectedAt: string;
}

export interface DiagnosticSnapshot {
  findings: DiagnosticFinding[];
  summary: { info: number; warning: number; error: number; critical: number };
  computedAt: string;
}

export interface DiagnosticsPort {
  runAll(companyId?: string): Promise<DiagnosticSnapshot>;
  runSubsystem(subsystem: DiagnosticSubsystem, companyId?: string): Promise<DiagnosticFinding[]>;
}
