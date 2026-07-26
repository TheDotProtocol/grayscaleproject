"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchGoals } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function GoalsPage() {
  const goals = useWorkspaceQuery((id, t) => fetchGoals(id, t));

  return (
    <WorkspacePageShell title="Goals" subtitle="Strategic goals from intelligence engine">
      <ApiPanel title="Active Goals" data={goals.data} loading={goals.loading} />
    </WorkspacePageShell>
  );
}
