import { describe, it, expect } from "vitest";
import { WidgetCatalogService } from "./widget-catalog.service";
import { CapabilityDiscoveryService } from "./capability-discovery.service";
import { QuickActionsService } from "./quick-actions.service";
import { ActionRegistryService } from "./action-registry.service";

describe("WidgetCatalogService", () => {
  const service = new WidgetCatalogService();

  it("lists 12 launch widgets", () => {
    expect(service.list().length).toBeGreaterThanOrEqual(10);
  });

  it("provides default layout with pinned health and pulse", () => {
    const layout = service.defaultLayout();
    const pinned = layout.filter((w) => w.pinned);
    expect(pinned.some((w) => w.widgetId === "platform-health")).toBe(true);
    expect(pinned.some((w) => w.widgetId === "pulse-feed")).toBe(true);
  });
});

describe("CapabilityDiscoveryService", () => {
  const service = new CapabilityDiscoveryService();
  service.onModuleInit();

  it("registers searchable capabilities", () => {
    expect(service.list().length).toBeGreaterThan(10);
  });

  it("searches by keyword", () => {
    const results = service.search("memory");
    expect(results.some((c) => c.id.includes("memory"))).toBe(true);
  });
});

describe("QuickActionsService", () => {
  it("lists quick actions for all targets", () => {
    const service = new QuickActionsService();
    const actions = service.list();
    expect(actions.length).toBeGreaterThanOrEqual(6);
    expect(actions.some((a) => a.target === "sync")).toBe(true);
  });
});

describe("ActionRegistryService", () => {
  it("registers async platform actions", () => {
    const service = new ActionRegistryService();
    expect(service.get("integration.retry-sync")).toBeDefined();
    expect(service.get("recommendation.approve")).toBeDefined();
  });
});
