"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface WidgetInstanceConfig {
  instanceId: string;
  widgetId: string;
  visible: boolean;
  order: number;
  collapsed: boolean;
  pinned: boolean;
  favorite: boolean;
  width: 1 | 2;
  height: "compact" | "standard" | "tall";
  config?: Record<string, unknown>;
}

export interface WidgetDataResult {
  instanceId: string;
  widgetId: string;
  status: "ok" | "empty" | "error";
  data: unknown;
  error?: string;
  fetchedAt: string;
}

export interface MissionControlDashboard {
  companyId: string;
  platformHealth: {
    score: number;
    status: string;
    breakdown: Record<string, number>;
  };
  readiness: {
    overallScore: number;
    dataCompleteness: number;
    dimensions: Array<{ id: string; name: string; score: number; status: string }>;
  };
  widgets: WidgetDataResult[];
  layout: { widgets: WidgetInstanceConfig[] };
  catalog: Array<{ id: string; name: string; emptyState?: string }>;
  assembledAt: string;
}

export function useMissionControl(companyId: string | undefined, token: string | null) {
  const [dashboard, setDashboard] = useState<MissionControlDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!companyId || !token || token === "dev-session-token") {
      setLoading(false);
      return;
    }
    try {
      const data = await api<MissionControlDashboard>(
        `/companies/${companyId}/mission-control/dashboard`,
        { token },
      );
      setDashboard(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mission Control unavailable");
    } finally {
      setLoading(false);
    }
  }, [companyId, token]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const dispatchAction = useCallback(
    async (actionId: string, payload: Record<string, unknown> = {}) => {
      if (!companyId || !token) return;
      await api(`/companies/${companyId}/mission-control/actions`, {
        method: "POST",
        token,
        body: JSON.stringify({ actionId, payload }),
      });
      await refresh();
    },
    [companyId, token, refresh],
  );

  const saveLayout = useCallback(
    async (widgets: WidgetInstanceConfig[]) => {
      if (!companyId || !token) return;
      const { saveWidgetLayout } = await import("@/lib/api/workspace");
      await saveWidgetLayout(companyId, token, widgets);
      await refresh();
    },
    [companyId, token, refresh],
  );

  return { dashboard, loading, error, refresh, dispatchAction, saveLayout };
}
