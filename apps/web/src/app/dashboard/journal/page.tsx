"use client";

import { useCallback, useEffect, useState } from "react";
import { FileDown, Sparkles, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/header";
import { exportJournalDocx, exportJournalPdf } from "@/lib/export";
import { cn, formatDate } from "@/lib/utils";

interface JournalEntry {
  id: string;
  content: string;
  mood: string | null;
  summary: string | null;
  entryDate: string;
  createdAt: string;
}

export default function JournalPage() {
  const { token, company } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token || !company?.id) return;
    const data = await api<JournalEntry[]>(
      `/companies/${company.id}/memory/journal/entries`,
      { token },
    );
    setEntries(data);
    if (data[0]) setSelected(data[0]);
  }, [token, company?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function createEntry() {
    if (!token || !company?.id || !content.trim()) return;
    setSaving(true);
    try {
      const entry = await api<JournalEntry>(
        `/companies/${company.id}/memory/journal/entries`,
        {
        method: "POST",
        token,
        body: JSON.stringify({ content, mood: mood || undefined }),
      },
      );
      setContent("");
      setMood("");
      await load();
      setSelected(entry);
    } finally {
      setSaving(false);
    }
  }

  async function summarize(id: string) {
    if (!token) return;
    setSummarizing(true);
    try {
      const updated = await api<JournalEntry>(
        `/companies/${company!.id}/memory/journal/entries/${id}/summarize`,
        {
        method: "POST",
        token,
      },
      );
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setSelected(updated);
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Daily Journal"
        subtitle="Founder log with AI-powered reflection"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card lg:col-span-1 p-5">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">New entry</h2>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What happened today? Wins, blockers, decisions…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Mood (optional) — focused, stressed, energized…"
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
          />
          <button
            type="button"
            onClick={createEntry}
            disabled={saving || !content.trim()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : "Save entry"}
          </button>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">History</h3>
            <ul className="max-h-64 space-y-1 overflow-y-auto">
              {entries.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(e)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                      selected?.id === e.id ? "bg-blue-600/15 text-blue-200" : "hover:bg-white/[0.04] text-slate-400",
                    )}
                  >
                    {formatDate(e.entryDate)}
                    {e.summary && <span className="ml-2 text-[10px] text-emerald-400">AI</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass-card lg:col-span-2 p-6">
          {selected ? (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{formatDate(selected.entryDate)}</p>
                  {selected.mood && <p className="text-sm text-slate-500">Mood: {selected.mood}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => summarize(selected.id)}
                    disabled={summarizing}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-600/40 bg-purple-600/10 px-3 py-1.5 text-xs font-medium text-purple-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {summarizing ? "Summarizing…" : "AI Summary"}
                  </button>
                  <button
                    type="button"
                    onClick={() => exportJournalPdf(selected)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-blue-500/40"
                  >
                    <FileDown className="h-3.5 w-3.5" /> PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => exportJournalDocx(selected)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-blue-500/40"
                  >
                    <FileDown className="h-3.5 w-3.5" /> DOCX
                  </button>
                </div>
              </div>

              {selected.summary && (
                <div className="mb-6 rounded-xl border border-purple-600/20 bg-purple-600/5 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-purple-400">
                    <Sparkles className="h-3 w-3" /> AI Summary
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">{selected.summary}</p>
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{selected.content}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-slate-500">
              Select an entry or write your first journal log
            </div>
          )}
        </div>
      </div>
    </>
  );
}
