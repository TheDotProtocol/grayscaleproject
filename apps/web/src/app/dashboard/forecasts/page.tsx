"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchTwin } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function ForecastsPage() {
  const forecasts = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/forecasts"));
  const metrics = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/metrics"));

  return (
    <WorkspacePageShell title="Forecasts" subtitle="Hypotheses only — reality supersedes forecasts">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Forecast Dashboard" data={forecasts.data} loading={forecasts.loading} />
        <ApiPanel title="Twin Metrics" subtitle="Reality vs forecast tracked via twin metrics" data={metrics.data} loading={metrics.loading} />
      </div>
    </WorkspacePageShell>
  );
}
