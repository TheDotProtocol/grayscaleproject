/** Realistic dashboard mockups for landing page — demo data only */

import type { ReactNode } from "react";

export function HeroMissionControlPreview() {
  return (
    <div className="landing-mission-preview overflow-hidden">
      <div className="flex">
        {/* Mini sidebar */}
        <div className="hidden w-44 shrink-0 border-r border-white/5 bg-black/30 p-3 md:block">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary/20" />
            <span className="text-[10px] font-medium text-white/70">Grayscale</span>
          </div>
          {["Command Bridge", "Mission Control", "Council", "Digital Twin", "Policy Engine"].map((item, i) => (
            <div
              key={item}
              className={`mb-1 rounded-lg px-2 py-1.5 text-[10px] ${i === 1 ? "bg-primary/15 text-primary" : "text-white/40"}`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="landing-mission-preview-bar flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-400/60" />
              <span className="h-2 w-2 rounded-full bg-amber-400/60" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
              <span className="ml-2 text-xs text-white/50">Mission Control · Acme Ventures</span>
            </div>
            <span className="text-[10px] text-primary/80">Live</span>
          </div>

          <div className="p-4 md:p-5">
            {/* Platform health banner — matches real MC page */}
            <div className="mb-4 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 to-primary/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-primary">Platform Health</p>
                  <p className="text-2xl font-light text-white">94%</p>
                  <p className="mt-1 text-[10px] text-white/45">Event store · Memory · Graph · Intelligence</p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-sm font-medium text-emerald-400">healthy</p>
                    <p className="text-lg font-light text-white">87%</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/40">Readiness</p>
                  </div>
                  <div>
                    <p className="text-lg font-light text-white">92%</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/40">Completeness</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <McWidget title="Organizational Health" value="94" suffix="/100" badge="Stable" />
              <McWidget title="Policy Compliance" value="100" suffix="%" badge="Certified" />
              <McWidget title="Attention Budget" value="72" suffix="%" badge="Optimal" />
              <McWidget title="Council Sessions" value="3" suffix=" active" badge="Scheduled" wide />
              <McWidget title="Twin Alignment" value="88" suffix="%" badge="+2 today" wide />
            </div>

            <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Recent Timeline</p>
              <div className="mt-2 space-y-1.5">
                {[
                  { t: "Policy evaluated", d: "Executive action → permitted", time: "2m" },
                  { t: "Council deliberation", d: "Q3 strategy — stage 7/12", time: "18m" },
                  { t: "Goal alignment updated", d: "Series A readiness +4%", time: "1h" },
                ].map((e) => (
                  <div key={e.t} className="flex items-center justify-between text-[10px]">
                    <span className="text-white/70">{e.t}</span>
                    <span className="text-white/35">{e.d}</span>
                    <span className="text-primary/60">{e.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function McWidget({
  title,
  value,
  suffix,
  badge,
  wide,
}: {
  title: string;
  value: string;
  suffix: string;
  badge: string;
  wide?: boolean;
}) {
  return (
    <div className={`landing-preview-widget ${wide ? "sm:col-span-2 lg:col-span-1" : ""}`}>
      <p className="text-[10px] font-medium uppercase tracking-wide text-white/45">{title}</p>
      <p className="mt-1 font-light text-white">
        <span className="text-xl">{value}</span>
        <span className="text-xs text-white/45">{suffix}</span>
      </p>
      <span className="mt-1.5 inline-block rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] text-primary">
        {badge}
      </span>
    </div>
  );
}

export function FeatureDashboardPreview({ id }: { id: string }) {
  const previews: Record<string, ReactNode> = {
    intelligence: <IntelligencePreview />,
    "mission-control": <MissionControlWidgetsPreview />,
    "digital-twin": <TwinPreview />,
    simulation: <SimulationPreview />,
    council: <CouncilPreview />,
    governance: <GovernancePreview />,
    founder: <FounderPreview />,
    security: <SecurityPreview />,
    enterprise: <EnterprisePreview />,
  };

  return (
    <div className="landing-feature-visual">
      <div className="landing-feature-visual-header flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider landing-gold-70 uppercase">
          {id.replace(/-/g, " ")}
        </span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400">Demo</span>
      </div>
      <div className="p-4">{previews[id] ?? <GenericPreview />}</div>
    </div>
  );
}

function IntelligencePreview() {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-white/40">Executive Recommendations</p>
      {[
        { exec: "Athena", title: "Prioritize enterprise pipeline", conf: "High evidence", status: "Pending founder" },
        { exec: "Atlas", title: "Constraint: hiring freeze active", conf: "Hard limit", status: "Acknowledged" },
        { exec: "Council", title: "Deliberation: pricing model v2", conf: "12-stage", status: "In progress" },
      ].map((r) => (
        <div key={r.title} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-primary">{r.exec}</span>
            <span className="text-[9px] text-white/35">{r.status}</span>
          </div>
          <p className="mt-1 text-xs text-white/80">{r.title}</p>
          <p className="mt-0.5 text-[10px] text-white/40">{r.conf}</p>
        </div>
      ))}
    </div>
  );
}

function MissionControlWidgetsPreview() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { l: "Platform Health", v: "94%", c: "text-emerald-400" },
        { l: "Readiness", v: "87%", c: "text-primary" },
        { l: "Integrations", v: "3/3", c: "text-white/70" },
        { l: "Events Today", v: "1,284", c: "text-white/70" },
        { l: "Memory Index", v: "2,410", c: "text-white/70" },
        { l: "Graph Nodes", v: "186", c: "text-white/70" },
      ].map((w) => (
        <div key={w.l} className="rounded-lg border border-white/5 p-2.5">
          <p className="text-[9px] uppercase text-white/40">{w.l}</p>
          <p className={`text-sm font-light ${w.c}`}>{w.v}</p>
        </div>
      ))}
    </div>
  );
}

function TwinPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div>
          <p className="text-[10px] text-white/45">Twin Health</p>
          <p className="text-xl font-light text-white">88%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/45">Alignment</p>
          <p className="text-sm text-emerald-400">Stable</p>
        </div>
      </div>
      {["Signal correlation: 0.91", "Homeostasis: balanced", "Goals tracked: 12/14"].map((s) => (
        <div key={s} className="flex items-center gap-2 text-[10px] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {s}
        </div>
      ))}
    </div>
  );
}

function SimulationPreview() {
  return (
    <div className="space-y-2">
      {[
        { name: "Series A delay scenario", status: "Completed", outcome: "Runway −2mo" },
        { name: "Hiring expansion", status: "Running", outcome: "Stage 4/8" },
        { name: "Market downturn", status: "Queued", outcome: "—" },
      ].map((s) => (
        <div key={s.name} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-[10px]">
          <span className="text-white/75">{s.name}</span>
          <span className="text-primary/70">{s.status}</span>
          <span className="text-white/35">{s.outcome}</span>
        </div>
      ))}
    </div>
  );
}

function CouncilPreview() {
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-white/40">Continuous Council · Session #47</p>
      <div className="rounded-lg border border-white/5 p-3">
        <p className="text-xs text-white/80">Q3 Strategic Priorities</p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < 7 ? "bg-primary" : "bg-white/10"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-white/40">Stage 7 — Evidence review · 3 votes recorded</p>
      </div>
    </div>
  );
}

function GovernancePreview() {
  return (
    <div className="space-y-2">
      {[
        { action: "executive_action:athena:strategy", verdict: "requires_founder_approval", queue: "Founder" },
        { action: "automation:workflow:deploy", verdict: "prohibited", queue: "—" },
        { action: "integration:github:sync", verdict: "permitted", queue: "—" },
      ].map((p) => (
        <div key={p.action} className="rounded-lg border border-white/5 p-2.5 text-[10px]">
          <p className="truncate text-white/60">{p.action}</p>
          <div className="mt-1 flex justify-between">
            <span className={p.verdict === "permitted" ? "text-emerald-400" : p.verdict === "prohibited" ? "text-red-400" : "text-amber-400"}>
              {p.verdict.replace(/_/g, " ")}
            </span>
            {p.queue !== "—" && <span className="text-primary">{p.queue} queue</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FounderPreview() {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase text-white/40">Founder Constitution</p>
      {[
        "Final authority retained",
        "Overrides → organizational learning",
        "Automation explicit & auditable",
        "Executive certification required",
      ].map((item) => (
        <div key={item} className="flex items-center gap-2 rounded-lg border border-white/5 px-3 py-2 text-[10px] text-white/70">
          <span className="text-primary">✓</span>
          {item}
        </div>
      ))}
    </div>
  );
}

function SecurityPreview() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { l: "Company Guard", v: "Active" },
        { l: "Credential Vault", v: "3 keys" },
        { l: "Sandbox Gates", v: "Enforced" },
        { l: "Audit Events", v: "12.4k" },
      ].map((s) => (
        <div key={s.l} className="rounded-lg border border-white/5 p-2.5 text-center">
          <p className="text-[9px] text-white/40">{s.l}</p>
          <p className="text-xs text-emerald-400">{s.v}</p>
        </div>
      ))}
    </div>
  );
}

function EnterprisePreview() {
  return (
    <div className="space-y-2 text-[10px]">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="text-white/70">Portfolio · 4 organizations</p>
        <p className="mt-1 text-white/40">Federation-ready · SSO · Private cloud</p>
      </div>
      {["Custom policies", "Dedicated deployment", "Compliance packs"].map((f) => (
        <div key={f} className="flex items-center gap-2 text-white/55">
          <span className="h-1 w-1 rounded-full bg-primary" />
          {f}
        </div>
      ))}
    </div>
  );
}

function GenericPreview() {
  return <p className="text-xs text-white/40">Dashboard preview</p>;
}
