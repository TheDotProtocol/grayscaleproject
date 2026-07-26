"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchEvolution, fetchMissionControl } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";
import { StatCard } from "@/components/workspace/panel";

export default function OrganizationPage() {
  const evolution = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/overview"));
  const health = useWorkspaceQuery((id, t) => fetchMissionControl(id, t, "/health"));

  return (
    <WorkspacePageShell title="Organization" subtitle="Organizational identity, health, and evolution" error={evolution.error}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Platform Health" value={`${(health.data as { score?: number })?.score ?? "—"}%`} />
        <StatCard label="Maturity" value={(evolution.data as { maturityScore?: number })?.maturityScore ?? "—"} hint="Evolution score" />
        <StatCard label="Institutional Knowledge" value={(evolution.data as { institutionalKnowledge?: unknown[] })?.institutionalKnowledge?.length ?? "—"} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Organizational Intelligence" data={evolution.data} loading={evolution.loading} />
        <ApiPanel title="Organizational Health" data={health.data} loading={health.loading} />
      </div>
    </WorkspacePageShell>
  );
}
