import { describe, it, expect, beforeEach } from "vitest";
import { PolicyEngineStoreService } from "./policy-engine-store.service";
import { PolicyEvaluationService } from "./policy-evaluation.service";
import { GovernanceKernelService } from "./governance-kernel.service";
import { GovernanceCertificationService } from "./governance-certification.service";
import { PolicyAuditService } from "./policy-audit.service";
import { PolicyHistoryService } from "./policy-history.service";
import { PolicyApprovalService } from "./policy-approval.service";
import { PolicyEngineConstraintService } from "./policy-engine-constraint.service";

describe("PolicyEngine", () => {
  let kernel: GovernanceKernelService;
  let certification: GovernanceCertificationService;

  beforeEach(() => {
    const store = new PolicyEngineStoreService();
    const bedrockPolicies = {
      listActive: async () => [{ id: "p1", name: "Test", category: "approval", rules: [], isActive: true, companyId: "co-1", createdAt: "" }],
      evaluatePolicies: () => [],
    };
    const bedrockConstraints = {
      list: async () => [],
      evaluateConstraints: () => [],
    };
    const audit = new PolicyAuditService(store);
    const history = new PolicyHistoryService(store);
    const evaluation = new PolicyEvaluationService(
      bedrockPolicies as never,
      bedrockConstraints as never,
      store,
      audit,
      history,
      { publish: async () => ({}) } as never,
    );
    const approvals = new PolicyApprovalService(store);
    const constraints = new PolicyEngineConstraintService(bedrockConstraints as never);
    kernel = new GovernanceKernelService(evaluation, approvals, constraints, bedrockPolicies as never, store, { publish: async () => ({}) } as never);
    certification = new GovernanceCertificationService(kernel, evaluation, audit);
  });

  it("evaluates with default deny when no explicit allow", async () => {
    const store = new PolicyEngineStoreService();
    const evaluation = new PolicyEvaluationService(
      { listActive: async () => [], evaluatePolicies: () => [] } as never,
      { list: async () => [], evaluateConstraints: () => [] } as never,
      store,
      new PolicyAuditService(store),
      new PolicyHistoryService(store),
      { publish: async () => ({}) } as never,
    );
    const decision = await evaluation.evaluate({
      companyId: "co-1",
      actionKind: "executive_action",
      actionRef: "test-action",
      correlationId: "corr-1",
    });
    expect(decision.verdict).toBe("unknown_denied");
  });

  it("permits when policies pass", async () => {
    const result = await kernel.evaluate({
      companyId: "co-1",
      actionKind: "api_call",
      actionRef: "read-context",
      correlationId: "corr-2",
    });
    expect(result.checkpointPassed).toBe(true);
  });

  it("certifies policy and governance gates", async () => {
    const policyCert = await certification.certifyPolicy("co-1");
    const govCert = await certification.certifyGovernance("co-1");
    expect(policyCert.checks.length).toBe(15);
    expect(govCert.checks.length).toBe(12);
    expect(policyCert.score).toBeGreaterThanOrEqual(90);
  });
});
