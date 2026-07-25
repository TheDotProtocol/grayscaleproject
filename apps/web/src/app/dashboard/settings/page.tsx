"use client";

import { useEffect, useState } from "react";
import { Cpu, Cloud, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";

interface AiProviderConfig {
  id: string;
  provider: string;
  model: string;
  isDefault: boolean;
  isEnabled: boolean;
}

export default function SettingsPage() {
  const { token, company } = useAuth();
  const [providers, setProviders] = useState<AiProviderConfig[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token || !company?.id) return;
    api<AiProviderConfig[]>(`/companies/${company.id}/ai-providers`, { token }).then(setProviders);
  }, [token, company?.id]);

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
