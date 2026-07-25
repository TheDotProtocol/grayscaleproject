import { Injectable } from "@nestjs/common";
import type {
  ReadinessScoringPort,
  CompanyReadinessSnapshot,
  ReadinessDimension,
  ReadinessDimensionId,
} from "@grayscale/platform";
import { READINESS_DIMENSIONS } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { PulseEngineService } from "../pulse/pulse-engine.service";
import { IntegrationHealthService } from "../integration-platform/integration-health.service";
import { PlatformHealthService } from "./platform-health.service";

const DIMENSION_NAMES: Record<ReadinessDimensionId, string> = {
  engineering: "Engineering",
  operations: "Operations",
  finance: "Finance",
  security: "Security",
  marketing: "Marketing",
  growth: "Growth",
  infrastructure: "Infrastructure",
  hiring: "Hiring",
  product: "Product",
  legal: "Legal",
  platform: "Platform",
  customer_success: "Customer Success",
  ai_readiness: "AI Readiness",
  innovation: "Innovation",
};

const UNKNOWN_DIMENSIONS: ReadinessDimensionId[] = ["hiring", "legal", "marketing"];

@Injectable()
export class ReadinessScoringService implements ReadinessScoringPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pulse: PulseEngineService,
    private readonly integrationHealth: IntegrationHealthService,
    private readonly platformHealth: PlatformHealthService,
  ) {}

  async compute(companyId: string): Promise<CompanyReadinessSnapshot> {
    const [
      gitCommits,
      memoryCount,
      goals,
      recommendations,
      bills,
      integrations,
      aiProviders,
      knowledgeNodes,
      decisions,
      pulseHealth,
      platformHealth,
      integrationSummary,
      credentialAudits,
    ] = await Promise.all([
      this.prisma.normalizedEntityRecord.count({ where: { companyId, entityType: "development_activity" } }),
      this.prisma.memoryRecord.count({ where: { companyId } }),
      this.prisma.goal.count({ where: { companyId } }),
      this.prisma.recommendation.count({ where: { companyId, status: { in: ["pending_approval", "approved"] } } }),
      this.prisma.bill.findMany({ where: { companyId } }),
      this.prisma.integration.count({ where: { companyId } }),
      this.prisma.aiProviderConfig.count({ where: { companyId } }),
      this.prisma.graphNode.count({ where: { companyId, nodeType: "knowledge_article" } }),
      this.prisma.decision.count({ where: { companyId } }),
      this.pulse.getHealth(companyId),
      this.platformHealth.computePlatformHealth(companyId),
      this.integrationHealth.aggregateSummary(companyId),
      this.prisma.credentialAuditLog.count({ where: { companyId } }),
    ]);

    const paidBills = bills.filter((b) => b.isPaid).length;
    const overdueBills = bills.filter((b) => !b.isPaid && b.dueDate < new Date()).length;

    const builders: Partial<Record<ReadinessDimensionId, () => ReadinessDimension>> = {
      engineering: () => this.dim("engineering", gitCommits > 0 || memoryCount > 5 ? Math.min(100, 40 + gitCommits * 5) : 20, [
        { id: "commits", label: "Git commits synced", value: gitCommits, weight: 0.5 },
        { id: "memory", label: "Memory records", value: memoryCount, weight: 0.5 },
      ]),
      operations: () => this.dim("operations", pulseHealth.score, [
        { id: "pulse", label: "Pulse health score", value: pulseHealth.score, weight: 1 },
      ]),
      finance: () => this.dim("finance", bills.length === 0 ? 30 : Math.round((paidBills / bills.length) * 100), [
        { id: "paid", label: "Bills paid ratio", value: bills.length ? paidBills / bills.length : 0, weight: 0.6 },
        { id: "overdue", label: "Overdue bills", value: overdueBills, weight: 0.4 },
      ]),
      security: () => this.dim("security", integrations > 0 && credentialAudits > 0 ? 75 : integrations > 0 ? 50 : 40, [
        { id: "credentials", label: "Credential audit entries", value: credentialAudits, weight: 0.5 },
        { id: "integrations", label: "Connected integrations", value: integrations, weight: 0.5 },
      ]),
      growth: () => this.dim("growth", goals > 0 ? Math.min(100, 30 + goals * 15) : 15, [
        { id: "goals", label: "Active goals", value: goals, weight: 0.5 },
        { id: "recommendations", label: "Open recommendations", value: recommendations, weight: 0.5 },
      ]),
      infrastructure: () => this.dim("infrastructure", integrationSummary.healthy > 0 ? 70 : 30, [
        { id: "healthy", label: "Healthy integrations", value: integrationSummary.healthy, weight: 1 },
      ]),
      product: () => this.dim("product", knowledgeNodes > 0 || decisions > 0 ? Math.min(100, 40 + knowledgeNodes * 10) : 20, [
        { id: "knowledge", label: "Knowledge nodes", value: knowledgeNodes, weight: 0.5 },
        { id: "decisions", label: "Decisions recorded", value: decisions, weight: 0.5 },
      ]),
      platform: () => this.dim("platform", platformHealth.score, [
        { id: "health", label: "Platform health score", value: platformHealth.score, weight: 1 },
      ]),
      customer_success: () => this.dim("customer_success", 0, [], "unknown"),
      ai_readiness: () => this.dim("ai_readiness", aiProviders > 0 ? Math.min(100, 50 + aiProviders * 25) : 10, [
        { id: "providers", label: "AI providers configured", value: aiProviders, weight: 1 },
      ]),
      innovation: () => this.dim("innovation", recommendations > 0 ? Math.min(100, 30 + recommendations * 10) : 15, [
        { id: "recommendations", label: "Recommendations generated", value: recommendations, weight: 1 },
      ]),
    };

    const dimensions: ReadinessDimension[] = READINESS_DIMENSIONS.map((id) => {
      if (UNKNOWN_DIMENSIONS.includes(id)) {
        return this.dim(id, 0, [], "unknown");
      }
      return builders[id]?.() ?? this.dim(id, 0, [], "unknown");
    });

    const known = dimensions.filter((d) => d.status !== "unknown");
    const overallScore =
      known.length === 0
        ? 0
        : Math.round(known.reduce((sum, d) => sum + d.score, 0) / known.length);

    const snapshot: CompanyReadinessSnapshot = {
      companyId,
      overallScore,
      dimensions,
      dataCompleteness: known.length / dimensions.length,
      computedAt: new Date().toISOString(),
    };

    await this.prisma.readinessSnapshot.create({
      data: {
        companyId,
        overallScore,
        dataCompleteness: snapshot.dataCompleteness,
        dimensions: dimensions as unknown as object,
      },
    });

    return snapshot;
  }

  private dim(
    id: ReadinessDimensionId,
    score: number,
    signals: ReadinessDimension["signals"],
    forceStatus?: ReadinessDimension["status"],
  ): ReadinessDimension {
    const status =
      forceStatus ??
      (score >= 70 ? "ready" : score >= 40 ? "developing" : signals.length === 0 ? "unknown" : "at_risk");
    return {
      id,
      name: DIMENSION_NAMES[id],
      score: forceStatus === "unknown" ? 0 : Math.max(0, Math.min(100, score)),
      status,
      signals,
    };
  }
}
