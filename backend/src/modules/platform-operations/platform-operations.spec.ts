import { describe, it, expect, vi, beforeEach } from "vitest";
import { GovernanceService } from "./governance.service";
import { SecurityObservatoryService } from "./security-observatory.service";
import { PlatformEvolutionService } from "./platform-evolution.service";
import { PlatformCostObservatoryService } from "./platform-cost-observatory.service";
import { DiagnosticsEngineService } from "./diagnostics-engine.service";
import { PerformanceObservatoryService } from "./performance-observatory.service";
import { WidgetCatalogService } from "../mission-control/widget-catalog.service";

function mockPrisma() {
  return {
    governanceEntry: {
      create: vi.fn().mockResolvedValue({
        id: "gov-1",
        type: "architecture_decision",
        title: "Test ADR",
        description: "Test description",
        actorId: null,
        correlationId: "corr-1",
        eventId: "evt-1",
        metadata: {},
        recordedAt: new Date(),
      }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    integration: { count: vi.fn().mockResolvedValue(0) },
    integrationCredential: { count: vi.fn().mockResolvedValue(0) },
    credentialAuditLog: { count: vi.fn().mockResolvedValue(5) },
    securityFindingSnapshot: { create: vi.fn() },
    domainEvent: { count: vi.fn().mockResolvedValue(100) },
    memoryRecord: { count: vi.fn().mockResolvedValue(50) },
    platformJob: { count: vi.fn().mockResolvedValue(10) },
    agentRun: { count: vi.fn().mockResolvedValue(5) },
    installedPlugin: { count: vi.fn().mockResolvedValue(2) },
    integrationCostSnapshot: { findMany: vi.fn().mockResolvedValue([]) },
    platformInfraCostSnapshot: { upsert: vi.fn() },
    diagnosticSnapshot: { create: vi.fn() },
    decisionPolicy: { count: vi.fn().mockResolvedValue(1) },
    pluginSyncJob: { count: vi.fn().mockResolvedValue(0) },
    domainEventFailure: { count: vi.fn().mockResolvedValue(0) },
    platformMetricSnapshot: {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([
        { name: "heap_used", category: "memory_usage", value: 1000, unit: "bytes", labels: {}, recordedAt: new Date() },
      ]),
    },
    graphNode: { count: vi.fn().mockResolvedValue(0) },
  };
}

describe("GovernanceService", () => {
  it("records governance entry with event store integration", async () => {
    const prisma = mockPrisma();
    const events = { publish: vi.fn().mockResolvedValue({ id: "evt-1" }) };
    const service = new GovernanceService(prisma as never, events as never);

    const entry = await service.record({
      type: "architecture_decision",
      title: "Test ADR",
      description: "Test description",
    });

    expect(entry.title).toBe("Test ADR");
    expect(events.publish).toHaveBeenCalledWith(
      "platform.governance.recorded",
      "platform",
      expect.objectContaining({ title: "Test ADR" }),
      expect.any(Object),
    );
    expect(prisma.governanceEntry.create).toHaveBeenCalled();
  });
});

describe("SecurityObservatoryService", () => {
  it("returns secure status when no critical findings", async () => {
    const prisma = mockPrisma();
    const service = new SecurityObservatoryService(prisma as never);
    const snapshot = await service.assess();
    expect(snapshot.status).toBe("secure");
    expect(snapshot.score).toBeGreaterThanOrEqual(70);
  });

  it("returns compromised when plaintext tokens exist", async () => {
    const prisma = mockPrisma();
    prisma.integration.count.mockResolvedValue(3);
    const service = new SecurityObservatoryService(prisma as never);
    const snapshot = await service.assess();
    expect(snapshot.status).toBe("compromised");
    expect(snapshot.findings.some((f) => f.type === "secret_expiration")).toBe(true);
  });
});

describe("PlatformEvolutionService", () => {
  it("returns platform version info", async () => {
    const service = new PlatformEvolutionService();
    const info = await service.getCurrent();
    expect(info.platformVersion).toBe("0.1.0");
    expect(info.apiVersion).toBe("v1");
    expect(info.upgradePath).toBeTruthy();
    expect(info.rollbackPath).toBeTruthy();
  });
});

describe("PlatformCostObservatoryService", () => {
  it("computes cost breakdown", async () => {
    const prisma = mockPrisma();
    const service = new PlatformCostObservatoryService(prisma as never);
    const breakdown = await service.compute("2026-07");
    expect(breakdown.period).toBe("2026-07");
    expect(breakdown.totalEstimatedCents).toBeGreaterThanOrEqual(0);
    expect(breakdown.categories.infrastructure).toBeDefined();
    expect(prisma.platformInfraCostSnapshot.upsert).toHaveBeenCalled();
  });
});

describe("DiagnosticsEngineService", () => {
  it("runs all probes and returns summary", async () => {
    const prisma = mockPrisma();
    const config = { get: vi.fn().mockReturnValue("false") };
    const service = new DiagnosticsEngineService(prisma as never, config as never);
    const snapshot = await service.runAll("company-1");
    expect(snapshot.findings).toBeDefined();
    expect(snapshot.summary).toHaveProperty("critical");
    expect(prisma.diagnosticSnapshot.create).toHaveBeenCalled();
  });

  it("detects plaintext tokens in security probe", async () => {
    const prisma = mockPrisma();
    prisma.integration.count.mockResolvedValue(2);
    const config = { get: vi.fn().mockReturnValue("false") };
    const service = new DiagnosticsEngineService(prisma as never, config as never);
    const findings = await service.runSubsystem("security", "company-1");
    expect(findings.some((f) => f.severity === "critical")).toBe(true);
  });
});

describe("PerformanceObservatoryService", () => {
  it("collects and returns current metrics", async () => {
    const prisma = mockPrisma();
    const service = new PerformanceObservatoryService(prisma as never);
    const metrics = await service.getCurrent();
    expect(metrics.length).toBeGreaterThan(0);
    expect(prisma.platformMetricSnapshot.create).toHaveBeenCalled();
  });
});

describe("WidgetCatalogService — Phase 1.5H widgets", () => {
  const service = new WidgetCatalogService();

  it("includes platform operations widgets", () => {
    const ids = service.list().map((w) => w.id);
    expect(ids).toContain("reliability-dashboard");
    expect(ids).toContain("diagnostics-panel");
    expect(ids).toContain("performance-metrics");
    expect(ids).toContain("platform-cost");
    expect(ids).toContain("foundation-readiness");
    expect(ids).toContain("platform-evolution");
    expect(ids).toContain("security-health");
  });

  it("lists 18+ widgets total", () => {
    expect(service.list().length).toBeGreaterThanOrEqual(18);
  });
});
