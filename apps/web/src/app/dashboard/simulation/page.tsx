"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchTwin } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function SimulationPage() {
  const scenarios = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/scenarios"));
  const simulations = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/simulations"));

  return (
    <WorkspacePageShell title="Simulation Center" subtitle="Scenarios isolated from reality — never become history">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Scenario Library" data={scenarios.data} loading={scenarios.loading} />
        <ApiPanel title="Simulation Results" data={simulations.data} loading={simulations.loading} />
        <ApiPanel title="Reality Comparison" subtitle="Reality always wins" data={null} />
      </div>
    </WorkspacePageShell>
  );
}
