"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PulseHeartbeat, CompanyPulseHealth } from "@grayscale/shared";

export function usePulse(companyId: string | undefined, token: string | null) {
  const [health, setHealth] = useState<CompanyPulseHealth | null>(null);
  const [recent, setRecent] = useState<PulseHeartbeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!companyId || !token || token === "dev-session-token") {
      setLoading(false);
      return;
    }
    try {
      const [h, r] = await Promise.all([
        api<CompanyPulseHealth>(`/companies/${companyId}/pulse/health`, { token }),
        api<PulseHeartbeat[]>(`/companies/${companyId}/pulse/recent`, { token }),
      ]);
      setHealth(h);
      setRecent(r);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pulse unavailable");
    } finally {
      setLoading(false);
    }
  }, [companyId, token]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { health, recent, loading, error, refresh };
}
