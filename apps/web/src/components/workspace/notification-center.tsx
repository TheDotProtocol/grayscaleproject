"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchNotifications, markNotificationRead } from "@/lib/api/workspace";
import { cn } from "@/lib/utils";

interface OrgNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const { token, company } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrgNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!company?.id || !token || token === "dev-session-token") return;
    setLoading(true);
    try {
      const data = await fetchNotifications<OrgNotification[]>(company.id, token);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [company?.id, token]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  const unread = items.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    if (!company?.id || !token) return;
    await markNotificationRead(company.id, token, id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-muted-foreground transition hover:border-white/20 hover:text-foreground/90"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0A0A0F] shadow-2xl">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">Notification Center</p>
              <p className="text-xs text-muted-foreground">{unread} unread</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
              {!loading && items.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>
              )}
              {items.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "border-b border-white/5 px-4 py-3",
                    !n.isRead && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground/70">{n.category.replace(/_/g, " ")}</p>
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    </div>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(n.id)}
                        className="shrink-0 rounded p-1 text-muted-foreground hover:text-emerald-400"
                        aria-label="Mark read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
