"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchEvolution } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function ReflectionPage() {
  const reflections = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/reflection"));
  const metrics = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/reflection/metrics"));

  return (
    <WorkspacePageShell title="Organizational Reflection" subtitle="Observations only — never recommendations">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Reflection Reports" data={reflections.data} loading={reflections.loading} />
        <ApiPanel title="Reflection Metrics" data={metrics.data} loading={metrics.loading} />
      </div>
    </WorkspacePageShell>
  );
}
