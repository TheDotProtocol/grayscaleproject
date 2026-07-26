"use client";

import { useEffect, useState } from "react";
import { Cpu, Cloud, Check, Moon, Sun, Bell, LayoutGrid } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { fetchFounderPreferences, updateFounderPreferences } from "@/lib/api/workspace";
import { DashboardHeader } from "@/components/dashboard/header";
import { CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";
import { cn } from "@/lib/utils";

interface AiProviderConfig {
  id: string;
  provider: string;
  model: string;
  isDefault: boolean;
  isEnabled: boolean;
}

interface FounderPrefs {
  preferences: {
    theme: "dark" | "light" | "system";
    defaultExecutiveId?: string;
    notificationPreferences: Record<string, boolean>;
    pinnedWidgetIds: string[];
  };
}

export default function SettingsPage() {
  const { token, company } = useAuth();
  const [providers, setProviders] = useState<AiProviderConfig[]>([]);
  const [prefs, setPrefs] = useState<FounderPrefs["preferences"] | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token || !company?.id) return;
    api<AiProviderConfig[]>(`/companies/${company.id}/ai-providers`, { token }).then(setProviders);
    fetchFounderPreferences<FounderPrefs>(token).then((r) => setPrefs(r.preferences)).catch(() => undefined);
  }, [token, company?.id]);

  async function savePrefs(patch: Partial<FounderPrefs["preferences"]>) {
    if (!token) return;
    const next = await updateFounderPreferences<FounderPrefs["preferences"]>(token, patch);
    setPrefs(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (patch.theme === "light") document.documentElement.classList.add("light");
    else if (patch.theme === "dark") document.documentElement.classList.remove("light");
  }

  async function setDefault(provider: string, model: string) {
    if (!token || !company?.id) return;
    await api(`/companies/${company.id}/ai-providers`, {
      method: "PUT",
      token,
      body: JSON.stringify({ provider, model, isDefault: true, isEnabled: true }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    const data = await api<AiProviderConfig[]>(`/companies/${company.id}/ai-providers`, { token });
    setProviders(data);
  }

  const defaultProvider = providers.find((p) => p.isDefault);

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="AI provider routing — Ollama for dev, OpenAI for production demos"
      />

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <Check className="h-4 w-4" /> Settings saved
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            id: "ollama",
            name: "Ollama (Local)",
            icon: Cpu,
            model: "llama3.2",
            desc: "Free, private inference on your desktop. Recommended for development.",
            gradient: "from-emerald-500/20 to-teal-500/20",
          },
          {
            id: "openai",
            name: "OpenAI (Cloud)",
            icon: Cloud,
            model: "gpt-4o-mini",
            desc: "Faster iteration for demos. Set OPENAI_API_KEY in your .env file.",
            gradient: "from-blue-600/20 to-purple-600/20",
          },
        ].map(({ id, name, icon: Icon, model, desc, gradient }) => {
          const isDefault = defaultProvider?.provider === id;
          return (
            <div
              key={id}
              className={cn(
                "glass-card p-6 bg-gradient-to-br",
                gradient,
                isDefault && "ring-2 ring-blue-600/50",
              )}
            >
              <div className="mb-4 flex items-center gap-3">
                <Icon className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-xs text-slate-500">Model: {model}</p>
                </div>
              </div>
              <p className="mb-4 text-sm text-slate-400">{desc}</p>
              <button
                type="button"
                onClick={() => setDefault(id, model)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition",
                  isDefault
                    ? "bg-blue-600/30 text-blue-200"
                    : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.08]",
                )}
              >
                {isDefault ? "Default provider" : "Set as default"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 glass-card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <LayoutGrid className="h-5 w-5 text-blue-400" />
          Workspace Personalization
        </h3>
        {prefs && (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-slate-400">Theme</p>
              <div className="flex gap-2">
                {(["dark", "light", "system"] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => savePrefs({ theme })}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm capitalize",
                      prefs.theme === theme ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-white/10 text-slate-400",
                    )}
                  >
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-400">Default Executive</p>
              <select
                value={prefs.defaultExecutiveId ?? ""}
                onChange={(e) => savePrefs({ defaultExecutiveId: e.target.value || undefined })}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white"
              >
                <option value="">None</option>
                {CONSTITUTIONAL_EXECUTIVES.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Bell className="h-4 w-4" /> Notification Preferences
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(prefs.notificationPreferences).map(([key, enabled]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        savePrefs({
                          notificationPreferences: { ...prefs.notificationPreferences, [key]: e.target.checked },
                        })
                      }
                      className="rounded border-white/20"
                    />
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 glass-card p-6">
        <h3 className="mb-2 font-semibold">Routing behavior</h3>
        <p className="text-sm text-slate-400">
          The agent framework uses a fallback chain: OpenAI is tried first when an API key is
          configured, then Ollama. Journal summaries and executive agents respect your default
          provider preference.
        </p>
      </div>
    </>
  );
}
