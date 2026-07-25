import { Injectable } from "@nestjs/common";
import type {
  ExecutiveSkepticEnginePort,
  SkepticPassInput,
  SkepticPassResult,
  SkepticChallenge,
} from "@grayscale/platform";

@Injectable()
export class ExecutiveSkepticService implements ExecutiveSkepticEnginePort {
  async runPass(input: SkepticPassInput): Promise<SkepticPassResult> {
    const challenges: SkepticChallenge[] = [];

    if (input.assumptions.length === 0) {
      challenges.push({
        type: "assumption",
        severity: "warning",
        summary: "No explicit assumptions documented",
        detail: "Recommendations without stated assumptions are harder to validate.",
      });
    }

    if (input.evidenceIds.length === 0) {
      challenges.push({
        type: "missing_evidence",
        severity: "blocking",
        summary: "No supporting evidence cited",
        detail: "Constitutional requirement: every recommendation requires evidence.",
      });
    }

    if (input.confidence < 0.5) {
      challenges.push({
        type: "low_confidence",
        severity: "warning",
        summary: "Confidence below 50%",
        detail: `Stated confidence: ${Math.round(input.confidence * 100)}%`,
      });
    }

    if ((input.constraintIds?.length ?? 0) === 0 && input.confidence > 0.7) {
      challenges.push({
        type: "constraint_violation",
        severity: "info",
        summary: "No constraints evaluated",
        detail: "High-confidence recommendations should cite evaluated constraints.",
      });
    }

    const blocking = challenges.some((c) => c.severity === "blocking");
    const adjustedConfidence = Math.max(
      0,
      input.confidence - challenges.filter((c) => c.severity !== "info").length * 0.05,
    );

    const whatCouldMakeThisWrong = this.buildWhatCouldMakeWrong(input, challenges);

    return {
      passed: !blocking,
      challenges,
      whatCouldMakeThisWrong,
      mandatoryQuestions: {
        whatCouldMakeThisWrong,
        contradictingEvidence: challenges.some((c) => c.type === "contradiction")
          ? "Contradictory evidence identified in challenge pass"
          : "No direct contradictions cited — monitor for new conflicting signals",
        weakAssumptions: input.assumptions.length > 0
          ? `Weakest assumption: ${input.assumptions[input.assumptions.length - 1]}`
          : "No assumptions documented — this itself is a weakness",
        missingInformation: challenges.some((c) => c.type === "missing_evidence")
          ? "Supporting evidence is insufficient or absent"
          : "Additional operational context may be needed for high-stakes decisions",
        bestAlternative: "Defer action until additional evidence is gathered",
      },
      adjustedConfidence,
      completedAt: new Date().toISOString(),
    };
  }

  private buildWhatCouldMakeWrong(
    input: SkepticPassInput,
    challenges: SkepticChallenge[],
  ): string {
    const parts = [
      "New contradictory evidence could invalidate this recommendation.",
      "Changes in founder priorities or organizational DNA non-negotiables could override this path.",
    ];
    if (input.assumptions.length > 0) {
      parts.push(`Key assumption at risk: ${input.assumptions[0]}`);
    }
    if (challenges.some((c) => c.type === "missing_evidence")) {
      parts.push("Insufficient evidence would make this recommendation unsound.");
    }
    return parts.join(" ");
  }
}
