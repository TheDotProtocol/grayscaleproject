"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchEvolution } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function WisdomPage() {
  const history = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/wisdom"));
  const approved = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/wisdom/approved"));

  return (
    <WorkspacePageShell title="Organizational Wisdom" subtitle="Validated institutional truths">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Wisdom Timeline" data={history.data} loading={history.loading} />
        <ApiPanel title="Approved Principles" data={approved.data} loading={approved.loading} />
      </div>
    </WorkspacePageShell>
  );
}
