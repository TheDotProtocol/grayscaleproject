import { Injectable } from "@nestjs/common";
import type { OrganizationalForesight } from "@grayscale/platform";
import { FORESIGHT_ENGINE_VERSION } from "@grayscale/platform";
import { OrganizationalSignalBusService } from "./organizational-signal-bus.service";
import { AttentionEngineService } from "./attention-engine.service";
import { IntentEngineService } from "./intent-engine.service";
import { foresightMetric } from "./organizational-reasoning.util";

/** Organizational Foresight — emerging conditions, not prediction (deterministic) */
@Injectable()
export class ForesightEngineService {
  constructor(
    private readonly signals: OrganizationalSignalBusService,
    private readonly attention: AttentionEngineService,
    private readonly intent: IntentEngineService,
  ) {}

  async assemble(companyId: string): Promise<OrganizationalForesight> {
    const [signalSnap, attn, intentCtx] = await Promise.all([
      this.signals.getSnapshot(companyId),
      this.attention.assemble(companyId),
      this.intent.getContext(companyId),
    ]);

    const weak = signalSnap.activeSignals.filter((s) => s.magnitude < 0.35);
    const emerging = signalSnap.activeSignals.filter((s) => s.magnitude >= 0.35 && s.magnitude < 0.65);
    const evidence = weak.map((s) => s.id).slice(0, 5);

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: FORESIGHT_ENGINE_VERSION,
      weakSignals: {
        ...foresightMetric(weak.length / Math.max(1, signalSnap.activeSignals.length), "Weak signals below magnitude threshold", evidence, weak.length > 2 ? "emerging" : "stable"),
        signalIds: weak.map((s) => s.id),
        domains: [...new Set(weak.map((s) => s.sourceEngineId))],
      },
      trendEmergence: {
        ...foresightMetric(emerging.length / Math.max(1, signalSnap.activeSignals.length), "Emerging signal density", emerging.map((s) => s.id), emerging.length > 1 ? "rising" : "stable"),
        trendLabel: emerging.length > 0 ? "multi-domain-emergence" : "stable",
        domains: [...new Set(emerging.map((s) => s.sourceEngineId))],
      },
      strategicDrift: {
        ...foresightMetric(attn.drift?.driftScore ?? 0, "Declared vs actual focus divergence", attn.drift?.actualFocus ?? [], attn.drift ? "rising" : "stable"),
        declaredThemes: intentCtx.rootIntents.map((n) => n.intent.title),
        emergingThemes: attn.drift?.actualFocus ?? [],
        driftScore: attn.drift?.driftScore ?? 0,
      },
      opportunityWindows: [{
        ...foresightMetric(0.6, "Window inferred from low saturation + intent alignment", [`saturation:${attn.saturation.level}`], "stable"),
        windowLabel: "operational-capacity",
        estimatedDays: 30,
      }],
      competitiveMovement: {
        ...foresightMetric(signalSnap.activeSignals.some((s) => s.type.includes("momentum") || s.type.includes("reputation")) ? 0.5 : 0.2, "Market/momentum signal presence", signalSnap.activeSignals.filter((s) => s.type.includes("momentum")).map((s) => s.id), "stable"),
        indicators: signalSnap.activeSignals.filter((s) => s.type.includes("momentum") || s.type.includes("reputation")).map((s) => s.title),
      },
      capabilityEvolution: {
        ...foresightMetric(0.55, "Capability spread across attention domains", attn.allocations.map((a) => a.domain), "stable"),
        domains: attn.allocations.map((a) => a.domain),
      },
      founderBlindSpots: {
        ...foresightMetric(signalSnap.activeSignals.length === 0 ? 0.7 : 0.3, "Signal coverage gaps", signalSnap.activeSignals.length === 0 ? ["no_active_signals"] : [], "stable"),
        blindSpotAreas: signalSnap.activeSignals.length === 0 ? ["signal-perception"] : [],
      },
      marketPatterns: signalSnap.activeSignals.slice(0, 3).map((s, i) => ({
        ...foresightMetric(s.magnitude, `Pattern from signal ${s.id}`, [s.id], "emerging"),
        patternLabel: s.type ?? `pattern-${i}`,
      })),
      organizationalMomentum: {
        ...foresightMetric(attn.trends[0]?.delta ?? 0, "Attention trend momentum", attn.trends.map((t) => t.domain), attn.trends[0]?.direction === "increasing" ? "rising" : "stable"),
        direction: attn.trends[0]?.direction === "increasing" ? "accelerating" : attn.trends[0]?.direction === "decreasing" ? "decelerating" : "stable",
      },
      changeVelocity: {
        ...foresightMetric(attn.contextSwitching.switchesLast24h / 20, "Context switching rate as change proxy", [`switches:${attn.contextSwitching.switchesLast24h}`], "stable"),
        rate: attn.contextSwitching.switchesLast24h,
        periodDays: 1,
      },
      earlyWarnings: attn.saturation.status !== "healthy"
        ? [{ id: "ew-saturation", label: "Attention saturation elevated", severity: attn.saturation.status === "overload" ? "high" as const : "moderate" as const, evidence: [`level:${attn.saturation.level}`], detectedAt: new Date().toISOString() }]
        : [],
      confidence: {
        overall: Math.min(0.9, 0.4 + signalSnap.activeSignals.length * 0.05),
        evidenceWeight: Math.min(1, signalSnap.activeSignals.length / 10),
        signalCoverage: signalSnap.activeSignals.length > 0 ? 0.8 : 0.3,
      },
    };
  }
}
