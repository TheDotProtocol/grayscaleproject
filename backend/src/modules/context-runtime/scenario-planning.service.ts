import { Injectable } from "@nestjs/common";
import type { ScenarioComparison, ScenarioPlanningCase, ScenarioPlanningCaseType, ScenarioPlanningSnapshot } from "@grayscale/platform";
import { SCENARIO_PLANNING_VERSION } from "@grayscale/platform";
import { HomeostasisEngineService } from "./homeostasis-engine.service";
import { ForesightEngineService } from "./foresight-engine.service";
import { deterministicUnit } from "./organizational-reasoning.util";

const CASE_DEFINITIONS: Array<{ type: ScenarioPlanningCaseType; label: string; description: string; stressMult: number }> = [
  { type: "best_case", label: "Best Case", description: "Optimistic organizational trajectory", stressMult: -0.15 },
  { type: "worst_case", label: "Worst Case", description: "Pessimistic organizational trajectory", stressMult: 0.35 },
  { type: "expected_case", label: "Expected Case", description: "Baseline expected trajectory", stressMult: 0 },
  { type: "competitive_attack", label: "Competitive Attack", description: "Competitive pressure scenario", stressMult: 0.25 },
  { type: "founder_absence", label: "Founder Absence", description: "Founder unavailability scenario", stressMult: 0.3 },
  { type: "economic_downturn", label: "Economic Downturn", description: "Economic contraction scenario", stressMult: 0.4 },
  { type: "rapid_growth", label: "Rapid Growth", description: "Accelerated growth scenario", stressMult: 0.2 },
  { type: "hiring_expansion", label: "Hiring Expansion", description: "Team expansion scenario", stressMult: 0.18 },
  { type: "funding", label: "Funding", description: "Funding event scenario", stressMult: -0.1 },
  { type: "product_launch", label: "Product Launch", description: "Product launch scenario", stressMult: 0.15 },
  { type: "market_shift", label: "Market Shift", description: "Market condition change", stressMult: 0.22 },
  { type: "black_swan", label: "Black Swan", description: "Low-probability high-impact event", stressMult: 0.5 },
];

/** Deterministic scenario planning — inherits twin, ONS, simulation, homeostasis */
@Injectable()
export class ScenarioPlanningService {
  constructor(
    private readonly homeostasis: HomeostasisEngineService,
    private readonly foresight: ForesightEngineService,
  ) {}

  listCaseTypes(): ScenarioPlanningCaseType[] {
    return CASE_DEFINITIONS.map((c) => c.type);
  }

  async plan(companyId: string, options?: { twinVersionId?: string }): Promise<ScenarioPlanningSnapshot> {
    const [homeo, foresightSnap] = await Promise.all([
      this.homeostasis.assess(companyId),
      this.foresight.assemble(companyId),
    ]);

    const baseStress = homeo.stressIndex.value;
    const baseStability = homeo.stability.score;

    const cases: ScenarioPlanningCase[] = CASE_DEFINITIONS.map((def) => {
      const seed = `${companyId}:${def.type}:${options?.twinVersionId ?? "default"}`;
      const unit = deterministicUnit(seed);
      const stress = Math.min(1, Math.max(0, baseStress + def.stressMult));
      const stability = Math.min(1, Math.max(0, baseStability - def.stressMult));

      return {
        caseId: `case-${def.type}-${companyId.slice(0, 6)}`,
        type: def.type,
        label: def.label,
        description: def.description,
        assumptions: [`baseline_stress:${baseStress.toFixed(2)}`, `foresight_confidence:${foresightSnap.confidence.overall.toFixed(2)}`],
        constraints: ["reality_preserved", "twin_synchronized"],
        projectedMetrics: {
          organizational_stress: stress,
          stability,
          resilience: homeo.resilienceIndex.score - def.stressMult * 0.3,
          alignment_risk: def.stressMult > 0 ? def.stressMult : 0,
          scenario_weight: unit,
        },
        confidence: Math.max(0.3, foresightSnap.confidence.overall - Math.abs(def.stressMult) * 0.2),
        evidence: [`homeostasis:${homeo.version}`, `foresight:${foresightSnap.version}`],
      };
    });

    const expected = cases.find((c) => c.type === "expected_case")!;
    const worst = cases.find((c) => c.type === "worst_case")!;
    const comparisons: ScenarioComparison[] = [
      this.compareCases(expected, worst),
    ];

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: SCENARIO_PLANNING_VERSION,
      twinVersionId: options?.twinVersionId,
      cases,
      comparisons,
      inheritedSources: ["twin", "ons", "simulation", "homeostasis", "signals", "insights", "intent", "temporal", "organizational-intelligence"],
    };
  }

  async compare(companyId: string, caseA: string, caseB: string): Promise<ScenarioComparison> {
    const plan = await this.plan(companyId);
    const a = plan.cases.find((c) => c.caseId === caseA || c.type === caseA);
    const b = plan.cases.find((c) => c.caseId === caseB || c.type === caseB);
    if (!a || !b) throw new Error("Scenario case not found");
    return this.compareCases(a, b);
  }

  private compareCases(a: ScenarioPlanningCase, b: ScenarioPlanningCase): ScenarioComparison {
    const deltas: Record<string, number> = {};
    for (const key of Object.keys(a.projectedMetrics)) {
      deltas[key] = (b.projectedMetrics[key] ?? 0) - (a.projectedMetrics[key] ?? 0);
    }
    return {
      baselineCaseId: a.caseId,
      comparedCaseId: b.caseId,
      deltas,
      preferred: (b.projectedMetrics.stability ?? 0) > (a.projectedMetrics.stability ?? 0) ? b.caseId : a.caseId,
    };
  }
}
