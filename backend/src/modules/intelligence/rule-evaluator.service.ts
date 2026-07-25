import { Injectable } from "@nestjs/common";
import type { Recommendation, CreateRecommendationInput } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { RecommendationEngineService } from "./recommendation-engine.service";
import { PolicyService } from "./policy.service";
import { ConstraintService } from "./constraint.service";
import { RiskEngineService } from "./risk-engine.service";
import { OpportunityEngineService } from "./opportunity-engine.service";

interface RuleMatch {
  ruleId: string;
  title: string;
  summary: string;
  reasoning: string;
  confidence: number;
  estimatedCostCents?: number;
  department?: string;
}

/** Deterministic rule evaluator — billing, integration, goal rules (AIP-12) */
@Injectable()
export class RuleEvaluatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recommendations: RecommendationEngineService,
    private readonly policies: PolicyService,
    private readonly constraints: ConstraintService,
    private readonly risks: RiskEngineService,
    private readonly opportunities: OpportunityEngineService,
  ) {}

  async evaluate(companyId: string): Promise<Recommendation[]> {
    const generated: Recommendation[] = [];
    const rules = await this.collectRules(companyId);

    for (const rule of rules) {
      const rec = await this.recommendations.create({
        companyId,
        title: rule.title,
        summary: rule.summary,
        reasoning: rule.reasoning,
        confidence: rule.confidence,
        source: "rule",
        sourceRef: rule.ruleId,
        requiresApproval: true,
        estimatedCostCents: rule.estimatedCostCents,
        department: rule.department,
        createdBy: "rule-evaluator",
        confidenceSources: [
          {
            type: "rule_evaluation",
            refId: rule.ruleId,
            summary: `Matched rule ${rule.ruleId}`,
            weight: rule.confidence,
          },
        ],
        tradeOff: {
          benefits: [rule.summary],
          costs: rule.estimatedCostCents
            ? [`Estimated cost: $${(rule.estimatedCostCents / 100).toFixed(2)}`]
            : [],
        },
      });

      const activePolicies = await this.policies.listActive(companyId);
      const policyViolations = this.policies.evaluatePolicies(activePolicies, {
        estimatedCostCents: rule.estimatedCostCents,
        requiresApproval: true,
        department: rule.department,
      });

      const activeConstraints = await this.constraints.list(companyId);
      const constraintViolations = this.constraints.evaluateConstraints(
        activeConstraints,
        { estimatedCostCents: rule.estimatedCostCents },
      );

      if (policyViolations.length || constraintViolations.length) {
        await this.prisma.recommendation.update({
          where: { id: rec.id },
          data: { policyViolations, constraintViolations },
        });
      }

      generated.push(rec);
    }

    return generated;
  }

  private async collectRules(companyId: string): Promise<RuleMatch[]> {
    const rules: RuleMatch[] = [];

    const now = new Date();
    const dueSoonWindow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const overdueBills = await this.prisma.bill.count({
      where: { companyId, isPaid: false, dueDate: { lt: now } },
    });
    if (overdueBills > 0) {
      rules.push({
        ruleId: "billing.overdue",
        title: "Resolve overdue bills",
        summary: `${overdueBills} bill(s) are overdue and may incur penalties.`,
        reasoning: `Rule billing.overdue: ${overdueBills} overdue bills detected.`,
        confidence: 0.95,
        department: "finance",
      });
    }

    const dueSoon = await this.prisma.bill.count({
      where: {
        companyId,
        isPaid: false,
        dueDate: { gte: now, lte: dueSoonWindow },
      },
    });
    if (dueSoon > 0) {
      rules.push({
        ruleId: "billing.due_soon",
        title: "Review bills due soon",
        summary: `${dueSoon} bill(s) due within the reminder window.`,
        reasoning: `Rule billing.due_soon: proactive payment review recommended.`,
        confidence: 0.85,
        department: "finance",
      });
    }

    const staleSyncThreshold = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const staleIntegrations = await this.prisma.integration.count({
      where: {
        companyId,
        status: { not: "connected" },
      },
    });
    const staleSyncs = await this.prisma.integration.count({
      where: {
        companyId,
        status: "connected",
        OR: [{ lastSyncAt: null }, { lastSyncAt: { lt: staleSyncThreshold } }],
      },
    });
    const integrationIssues = staleIntegrations + staleSyncs;
    if (integrationIssues > 0) {
      rules.push({
        ruleId: "integration.sync_failed",
        title: "Fix integration sync issues",
        summary: `${integrationIssues} integration(s) disconnected or stale.`,
        reasoning: `Rule integration.sync_failed: data freshness at risk.`,
        confidence: 0.9,
        department: "engineering",
      });
    }

    const atRiskGoals = await this.prisma.goal.count({
      where: { companyId, status: "active", health: "at_risk" },
    });
    if (atRiskGoals > 0) {
      rules.push({
        ruleId: "goal.at_risk",
        title: "Address at-risk goals",
        summary: `${atRiskGoals} active goal(s) marked at risk.`,
        reasoning: `Rule goal.at_risk: strategic alignment requires intervention.`,
        confidence: 0.8,
        department: "operations",
      });
    }

    const blockedObjectives = await this.prisma.objective.count({
      where: { companyId, status: "blocked" },
    });
    if (blockedObjectives > 0) {
      rules.push({
        ruleId: "objective.blocked",
        title: "Unblock objectives",
        summary: `${blockedObjectives} objective(s) are blocked.`,
        reasoning: `Rule objective.blocked: dependency resolution needed.`,
        confidence: 0.85,
      });
    }

    return rules;
  }
}
