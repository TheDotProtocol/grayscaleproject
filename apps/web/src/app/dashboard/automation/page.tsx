"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchEvolution } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function AutomationPage() {
  const policies = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/autonomy"));
  const readiness = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/autonomy/readiness"));

  return (
    <WorkspacePageShell title="Automation" subtitle="Constitutional autonomy — Founder-approved policies only">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Autonomy Policies" data={policies.data} loading={policies.loading} />
        <ApiPanel title="Autonomy Readiness" data={readiness.data} loading={readiness.loading} />
      </div>
    </WorkspacePageShell>
  );
}
