import { PolicyService } from "./policy.service";
import type { DecisionPolicy, PolicyRule } from "@grayscale/platform";

describe("PolicyService", () => {
  const service = new PolicyService({} as never);

  const policies: DecisionPolicy[] = [
    {
      id: "p1",
      companyId: "c1",
      name: "Financial Controls",
      category: "financial",
      isActive: true,
      createdAt: new Date().toISOString(),
      rules: [
        {
          id: "r1",
          condition: "cost_exceeds_10000",
          action: "Requires CFO approval",
          severity: "blocking",
        } as PolicyRule,
      ],
    },
  ];

  it("flags policy violations for high-cost proposals", () => {
    const violations = service.evaluatePolicies(policies, {
      estimatedCostCents: 1_500_000,
      requiresApproval: true,
    });
    expect(violations).toContain("Financial Controls: Requires CFO approval");
  });

  it("passes when cost is below threshold", () => {
    const violations = service.evaluatePolicies(policies, {
      estimatedCostCents: 50_000,
    });
    expect(violations).toHaveLength(0);
  });
});
