"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function useWorkspaceQuery<T>(fetcher: (companyId: string, token: string) => Promise<T>, deps: unknown[] = []) {
  const { token, company } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!company?.id || !token || token === "dev-session-token") {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await fetcher(company.id, token);
      setData(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [company?.id, token, fetcher, ...deps]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh, companyId: company?.id, token };
}
