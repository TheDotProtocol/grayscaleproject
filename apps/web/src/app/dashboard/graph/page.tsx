"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchGraphSummary, fetchEvolution } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function GraphPage() {
  const graph = useWorkspaceQuery((id, t) => fetchGraphSummary(id, t));
  const orgGraph = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/intelligence-graph"));

  return (
    <WorkspacePageShell title="Knowledge Graph" subtitle="Organizational concepts and relationships">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Graph Summary" data={graph.data} loading={graph.loading} />
        <ApiPanel title="Organizational Intelligence Graph" data={orgGraph.data} loading={orgGraph.loading} />
      </div>
    </WorkspacePageShell>
  );
}
