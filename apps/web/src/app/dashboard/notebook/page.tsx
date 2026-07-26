"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { api } from "@/lib/api";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

async function fetchNotebook(companyId: string, token: string) {
  return api<unknown[]>(`/companies/${companyId}/executives/athena/notebook?limit=20`, { token });
}

export default function NotebookPage() {
  const notebook = useWorkspaceQuery(fetchNotebook);

  return (
    <WorkspacePageShell title="Executive Notebook" subtitle="Immutable evidence, thoughts, and investigations">
      <ApiPanel title="Notebook Timeline" data={notebook.data} loading={notebook.loading} />
    </WorkspacePageShell>
  );
}
