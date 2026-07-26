"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Panel, LoadingState, ErrorState } from "@/components/workspace/panel";
import { GenericDataView } from "@/components/workspace/data-display";

export function WorkspacePageShell({
  title,
  subtitle,
  loading,
  error,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader title={title} subtitle={subtitle} actions={actions} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : children}
    </>
  );
}

export function ApiPanel({
  title,
  subtitle,
  data,
  loading,
}: {
  title: string;
  subtitle?: string;
  data: unknown;
  loading?: boolean;
}) {
  return (
    <Panel title={title} subtitle={subtitle}>
      {loading ? <LoadingState /> : <GenericDataView data={data} />}
    </Panel>
  );
}
