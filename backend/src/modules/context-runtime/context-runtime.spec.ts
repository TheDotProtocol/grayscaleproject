import { Test, TestingModule } from "@nestjs/testing";
import { ContextCacheService } from "./context-cache.service";
import { IntentEngineService } from "./intent-engine.service";
import { OrganizationalSignalBusService } from "./organizational-signal-bus.service";

describe("ContextRuntimeModule", () => {
  it("caches and invalidates context", async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextCacheService],
    }).compile();

    const cache = module.get(ContextCacheService);
    const key = cache.buildCacheKey("co-1");
    expect(key).toBe("ctx:co-1:default");

    await cache.set(
      key,
      {
        companyId: "co-1",
        assembledAt: new Date().toISOString(),
        correlationId: "c1",
        contextRuntime: {
          cacheKey: key,
          cached: false,
          assemblyDurationMs: 1,
          assemblerResults: [],
          contextVersion: "test",
          immutable: true,
        },
      } as never,
      60,
    );

    const hit = await cache.get(key);
    expect(hit?.companyId).toBe("co-1");

    await cache.invalidate("co-1");
    expect(await cache.get(key)).toBeNull();
  });

  it("returns empty intent context", async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntentEngineService],
    }).compile();

    const intent = module.get(IntentEngineService);
    const ctx = await intent.getContext("co-1");
    expect(ctx.rootIntents).toEqual([]);
    expect(ctx.coverage.coveragePercent).toBe(0);
  });

  it("emits organizational signals", async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationalSignalBusService],
    }).compile();

    const bus = module.get(OrganizationalSignalBusService);
    await bus.emit({
      companyId: "co-1",
      type: "execution_slowing",
      title: "Execution slowing",
      description: "Velocity declined",
      magnitude: 0.3,
      direction: "down",
      evidence: [],
      sourceEngineId: "temporal-intelligence",
    });

    const snapshot = await bus.getSnapshot("co-1");
    expect(snapshot.activeSignals.length).toBe(1);
  });
});
