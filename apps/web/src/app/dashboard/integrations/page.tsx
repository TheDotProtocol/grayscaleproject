"use client";

import { useCallback, useEffect, useState } from "react";
import { Github, RefreshCw, Unplug, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn, formatDate } from "@/lib/utils";

interface Integration {
  id: string;
  provider: string;
  config: { owner?: string; repo?: string };
  lastSyncAt: string | null;
  createdAt: string;
}

export default function IntegrationsPage() {
  const { token, company } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [form, setForm] = useState({ accessToken: "", owner: "", repo: "" });
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!token || !company?.id) return;
    const data = await api<Integration[]>(`/companies/${company.id}/integrations`, { token });
    setIntegrations(data);
  }, [token, company?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const github = integrations.find((i) => i.provider === "github");

  async function connect() {
    if (!token || !company?.id) return;
    await api(`/companies/${company.id}/integrations/github`, {
      method: "POST",
      token,
      body: JSON.stringify(form),
    });
    setForm({ accessToken: "", owner: "", repo: "" });
    setMessage("GitHub connected successfully");
    load();
  }

  async function disconnect() {
    if (!token || !company?.id) return;
    await api(`/companies/${company.id}/integrations/github`, {
      method: "DELETE",
      token,
    });
    setMessage("GitHub disconnected");
    load();
  }

  async function sync() {
    if (!token || !company?.id) return;
    setSyncing(true);
    setMessage("");
    try {
      const result = await api<{ imported: number }>(
        `/companies/${company.id}/memory/sync/github`,
        { method: "POST", token },
      );
      setMessage(`Synced ${result.imported} new commit memories`);
      load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Integrations"
        subtitle="Connect external data sources into your Memory Engine"
      />

      {message && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      <div className="glass-card p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/[0.06] p-3">
              <Github className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">GitHub / Cursor</h2>
              <p className="text-sm text-muted-foreground">
                Import commits from your connected repo into company memory
              </p>
            </div>
          </div>
          {github && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </span>
          )}
        </div>

        {github ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.04] p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Repository:</span>{" "}
                {github.config.owner}/{github.config.repo}
              </p>
              {github.lastSyncAt && (
                <p className="mt-1 text-muted-foreground">
                  Last sync: {formatDate(github.lastSyncAt)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={sync}
                disabled={syncing}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
                {syncing ? "Syncing…" : "Sync commits to memory"}
              </button>
              <button
                type="button"
                onClick={disconnect}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Unplug className="h-4 w-4" /> Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="password"
              placeholder="GitHub personal access token"
              value={form.accessToken}
              onChange={(e) => setForm((f) => ({ ...f, accessToken: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
            />
            <input
              placeholder="Owner (username or org)"
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Repository name"
              value={form.repo}
              onChange={(e) => setForm((f) => ({ ...f, repo: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={connect}
              disabled={!form.accessToken || !form.owner || !form.repo}
              className="rounded-xl bg-primary py-2.5 text-sm font-medium disabled:opacity-50 sm:col-span-2"
            >
              Connect GitHub repository
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 glass-card p-6">
        <h3 className="mb-2 font-semibold">Coming soon</h3>
        <p className="text-sm text-muted-foreground">
          Cursor workspace sync, Slack notifications, and Google Calendar timeline import.
        </p>
      </div>
    </>
  );
}
