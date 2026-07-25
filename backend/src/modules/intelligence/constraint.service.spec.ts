import { ConstraintService } from "./constraint.service";
import type { StrategicConstraint } from "@grayscale/platform";

describe("ConstraintService", () => {
  const service = new ConstraintService({} as never);

  const constraints: StrategicConstraint[] = [
    {
      id: "c1",
      companyId: "co1",
      type: "budget",
      limit: 10000,
      unit: "USD",
      currentUsage: 8000,
      isHard: true,
    },
    {
      id: "c2",
      companyId: "co1",
      type: "engineering_capacity",
      limit: 1,
      unit: "FTE",
      currentUsage: 0.8,
      isHard: true,
    },
  ];

  it("flags budget constraint violations", () => {
    const violations = service.evaluateConstraints(constraints, {
      estimatedCostCents: 500_000,
    });
    expect(violations.some((v) => v.includes("budget"))).toBe(true);
  });

  it("passes when within limits", () => {
    const violations = service.evaluateConstraints(constraints, {
      estimatedCostCents: 50_000,
      engineeringCost: 0.1,
    });
    expect(violations).toHaveLength(0);
  });
});
