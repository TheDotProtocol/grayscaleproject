import { describe, it, expect } from "vitest";
import { defineManifest } from "./index.js";

describe("defineManifest", () => {
  it("returns manifest when required fields are present", () => {
    const manifest = defineManifest({
      id: "io.grayscale.github",
      name: "GitHub",
      version: "1.0.0",
      minPlatformVersion: "0.1.0",
      category: "development",
      securityClassification: "first_party",
      capabilities: ["sync"],
      permissions: [],
      eventsPublished: [],
      eventsConsumed: [],
      commands: [],
      requiredConnectors: [],
      settingsSchema: {},
      resourceLimits: {
        maxStorageBytes: 1_048_576,
        maxApiCallsPerHour: 100,
        maxSyncFrequencyMinutes: 15,
      },
      hooks: [],
      connectorId: "github",
    });

    expect(manifest.requiredConnectors).toEqual(["github"]);
  });

  it("throws when manifest is incomplete", () => {
    expect(() =>
      defineManifest({
        id: "",
        name: "Bad",
        version: "1.0.0",
        minPlatformVersion: "0.1.0",
        category: "development",
        securityClassification: "standard",
        capabilities: [],
        permissions: [],
        eventsPublished: [],
        eventsConsumed: [],
        commands: [],
        requiredConnectors: [],
        settingsSchema: {},
        resourceLimits: {
          maxStorageBytes: 0,
          maxApiCallsPerHour: 0,
          maxSyncFrequencyMinutes: 60,
        },
        hooks: [],
      }),
    ).toThrow(/requires id/);
  });
});
