import { describe, it, expect, beforeEach } from "vitest";
import { RuntimeStoreService } from "./runtime-store.service";
import { RuntimeSchedulerService } from "./runtime-scheduler.service";
import { RuntimeCoordinatorService } from "./runtime-coordinator.service";
import { RuntimeHeartbeatService } from "./runtime-heartbeat.service";
import { RuntimeExplainabilityService } from "./runtime-explainability.service";
import { RuntimeResourceManagerService } from "./runtime-resource-manager.service";

describe("OrganizationalRuntime", () => {
  let coordinator: RuntimeCoordinatorService;
  let heartbeat: RuntimeHeartbeatService;

  beforeEach(() => {
    const store = new RuntimeStoreService();
    const scheduler = new RuntimeSchedulerService(store);
    const explainability = new RuntimeExplainabilityService(store);
    const resources = new RuntimeResourceManagerService(scheduler, store);
    heartbeat = new RuntimeHeartbeatService(store, { invalidateCache: async () => {}, assemble: async () => ({}) } as never, { publish: async () => ({}) } as never, explainability);
    coordinator = new RuntimeCoordinatorService(heartbeat, scheduler, resources, store);
  });

  it("returns runtime snapshot without business logic", async () => {
    const snapshot = await coordinator.getSnapshot("co-1");
    expect(snapshot.version).toBe("1.0.0");
    expect(snapshot.activeRuntimes.length).toBeGreaterThan(10);
    expect(snapshot.heartbeat.enabled).toBe(true);
  });

  it("runs deterministic heartbeat cycle", async () => {
    const cycle = await coordinator.runHeartbeat("co-1");
    expect(cycle.steps.length).toBe(10);
    expect(cycle.correlationId).toBeDefined();
  });

  it("scheduler supports all required modes", () => {
    const store = new RuntimeStoreService();
    const scheduler = new RuntimeSchedulerService(store);
    expect(scheduler.supportedModes()).toContain("event_driven");
    expect(scheduler.supportedModes()).toContain("priority");
  });
});
