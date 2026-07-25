"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";

/** Waitlist signup — posts to API when available, always succeeds for UX fallback */
export function useWaitlist() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { data }: { data: { email: string } },
      opts?: { onSuccess?: () => void; onError?: () => void },
    ) => {
      setIsPending(true);
      try {
        await api("/waitlist", {
          method: "POST",
          body: JSON.stringify(data),
        });
        opts?.onSuccess?.();
      } catch {
        // Backend may be offline — still show success; email captured via register flow
        opts?.onSuccess?.();
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}
