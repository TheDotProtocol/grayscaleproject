import { Injectable } from "@nestjs/common";
import type {
  DiagnosticsPort,
  DiagnosticSnapshot,
  DiagnosticFinding,
  DiagnosticSubsystem,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DiagnosticsEngineService implements DiagnosticsPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async runAll(companyId?: string): Promise<DiagnosticSnapshot> {
    const findings: DiagnosticFinding[] = [];
    for (const subsystem of [
      "memory_integrity", "graph_integrity", "strategy_rules", "executive_runtime",
      "plugin_sandbox", "integration_sync", "security", "storage", "queue_health", "event_store",
    ] as DiagnosticSubsystem[]) {
      findings.push(...(await this.runSubsystem(subsystem, companyId)));
    }

    const summary = {
      info: findings.filter((f) => f.severity === "info").length,
      warning: findings.filter((f) => f.severity === "warning").length,
      error: findings.filter((f) => f.severity === "error").length,
      critical: findings.filter((f) => f.severity === "critical").length,
    };

    const snapshot = { findings, summary, computedAt: new Date().toISOString() };
    await this.prisma.diagnosticSnapshot.create({
      data: { companyId, findings: findings as object, summary: summary as object },
    });
    return snapshot;
  }

  async runSubsystem(subsystem: DiagnosticSubsystem, companyId?: string): Promise<DiagnosticFinding[]> {
    switch (subsystem) {
      case "memory_integrity":
        return this.probeMemoryIntegrity(companyId);
      case "graph_integrity":
        return this.probeGraphIntegrity(companyId);
      case "strategy_rules":
        return this.probeStrategyRules(companyId);
      case "executive_runtime":
        return this.probeExecutiveRuntime();
      case "integration_sync":
        return this.probeIntegrationSync(companyId);
      case "security":
        return this.probeSecurity(companyId);
      case "storage":
        return this.probeStorage();
      case "queue_health":
        return this.probeQueueHealth();
      case "event_store":
        return this.probeEventStore(companyId);
      default:
        return [];
    }
  }

  private async probeMemoryIntegrity(companyId?: string): Promise<DiagnosticFinding[]> {
    const where = companyId ? { companyId } : {};
    const total = await this.prisma.memoryRecord.count({ where });
    if (total === 0 && companyId) {
      return [this.finding("memory_integrity", "info", "empty_index", "No memory records indexed", "Index is empty", {})];
    }
    return [];
  }

  private async probeGraphIntegrity(companyId?: string): Promise<DiagnosticFinding[]> {
    if (!companyId) return [];
    const orphans = await this.prisma.graphNode.count({
      where: { companyId, lifecycleStatus: "active", sourceTable: { not: null }, sourceId: { not: null } },
    });
    return orphans > 0 ? [] : [];
  }

  private async probeStrategyRules(companyId?: string): Promise<DiagnosticFinding[]> {
    if (!companyId) return [];
    const policies = await this.prisma.decisionPolicy.count({ where: { companyId, isActive: true } });
    return policies === 0
      ? [this.finding("strategy_rules", "info", "no_policies", "No active decision policies", "Consider defining policies", { policies })]
      : [];
  }

  private probeExecutiveRuntime(): DiagnosticFinding[] {
    const enabled = this.config.get("EXECUTIVES_ENABLED") === "true";
    return [{
      ...this.finding("executive_runtime", "info", "execution_gate", "Executive execution gate", enabled ? "Executives enabled" : "Executives disabled (expected for Foundation)", { enabled }),
    }];
  }

  private async probeIntegrationSync(companyId?: string): Promise<DiagnosticFinding[]> {
    const where = companyId ? { companyId, status: "failed" } : { status: "failed" };
    const failed = await this.prisma.pluginSyncJob.count({ where });
    if (failed > 0) {
      return [this.finding("integration_sync", "error", "failed_syncs", `${failed} failed sync jobs`, "Retry sync via Mission Control", { failed })];
    }
    return [];
  }

  private async probeSecurity(companyId?: string): Promise<DiagnosticFinding[]> {
    const plaintext = await this.prisma.integration.count({ where: { accessToken: { not: null }, ...(companyId ? { companyId } : {}) } });
    if (plaintext > 0) {
      return [this.finding("security", "critical", "plaintext_tokens", `${plaintext} plaintext tokens detected`, "Run credential migration", { count: plaintext })];
    }
    return [];
  }

  private async probeStorage(): Promise<DiagnosticFinding[]> {
    const tables = await this.prisma.domainEvent.count();
    return tables > 100000
      ? [this.finding("storage", "warning", "event_growth", "Large event store", "Consider archival policy", { eventCount: tables })]
      : [];
  }

  private async probeQueueHealth(): Promise<DiagnosticFinding[]> {
    const failed = await this.prisma.domainEventFailure.count();
    if (failed > 0) {
      return [this.finding("queue_health", "error", "event_failures", `${failed} event processing failures`, "Run recovery retry", { failed })];
    }
    return [];
  }

  private async probeEventStore(companyId?: string): Promise<DiagnosticFinding[]> {
    const where = companyId ? { companyId, status: "failed" } : { status: "failed" };
    const failed = await this.prisma.domainEvent.count({ where });
    if (failed > 0) {
      return [this.finding("event_store", "error", "failed_events", `${failed} failed domain events`, "Replay or retry failed events", { failed })];
    }
    return [];
  }

  private finding(
    subsystem: DiagnosticSubsystem,
    severity: DiagnosticFinding["severity"],
    category: string,
    title: string,
    description: string,
    evidence: Record<string, unknown>,
  ): DiagnosticFinding {
    return {
      id: `${subsystem}-${category}-${Date.now()}`,
      subsystem,
      severity,
      category,
      title,
      description,
      evidence,
      remediation: description,
      detectedAt: new Date().toISOString(),
    };
  }
}
