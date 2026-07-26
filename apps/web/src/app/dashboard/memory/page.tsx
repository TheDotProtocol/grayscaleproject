"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn, formatDate } from "@/lib/utils";

interface Memory {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["strategy", "product", "finance", "people", "tech", "general"];

export default function MemoryPage() {
  const { token, company } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Memory | null>(null);
  const [form, setForm] = useState({ title: "", content: "", category: "general", tags: "" });

  const load = useCallback(async () => {
    if (!token || !company?.id) return;
    setLoading(true);
    try {
      const data = await api<Array<Memory & { metadata?: { category?: string } }>>(
        `/companies/${company.id}/memory`,
        { token },
      );
      setMemories(
        data.map((m) => ({
          ...m,
          category: m.metadata?.category ?? "general",
        })),
      );
    } finally {
      setLoading(false);
    }
  }, [token, company?.id]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm({ title: "", content: "", category: "general", tags: "" });
    setModal("create");
  }

  function openEdit(m: Memory) {
    setForm({
      title: m.title,
      content: m.content,
      category: m.category,
      tags: m.tags.join(", "),
    });
    setModal(m);
  }

  async function save() {
    if (!token || !company?.id) return;
    const body = {
      title: form.title,
      content: form.content,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (modal === "create") {
      await api(`/companies/${company.id}/memory`, {
        method: "POST",
        token,
        body: JSON.stringify(body),
      });
    } else if (modal && typeof modal === "object") {
      await api(`/companies/${company.id}/memory/${modal.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
      });
    }
    setModal(null);
    load();
  }

  async function remove(id: string) {
    if (!token || !company?.id || !confirm("Delete this memory?")) return;
    await api(`/companies/${company.id}/memory/${id}`, { method: "DELETE", token });
    load();
  }

  return (
    <>
      <DashboardHeader
        title="Company Memory"
        subtitle="Persistent knowledge for your AI executive team"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New memory
          </button>
        }
      />

      {loading ? (
        <div className="text-muted-foreground">Loading memories…</div>
      ) : memories.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
          <p className="text-lg font-medium">No memories yet</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Capture decisions, context, and institutional knowledge your executives can reference.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-xl bg-primary px-5 py-2 text-sm font-medium"
          >
            Create first memory
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {memories.map((m) => (
            <article key={m.id} className="glass-card group flex flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  {m.category}
                </span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button type="button" onClick={() => openEdit(m)} className="rounded-lg p-1.5 hover:bg-white/[0.06]">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button type="button" onClick={() => remove(m.id)} className="rounded-lg p-1.5 hover:bg-white/[0.06]">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold">{m.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-4">{m.content}</p>
              {m.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground/70">{formatDate(m.updatedAt)}</p>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modal === "create" ? "New memory" : "Edit memory"}
              </h2>
              <button type="button" onClick={() => setModal(null)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea
                placeholder="Content — decisions, context, lessons learned…"
                rows={6}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                placeholder="Tags (comma-separated)"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className="rounded-xl px-4 py-2 text-sm text-muted-foreground">
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!form.title || !form.content}
                className={cn(
                  "flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium",
                  (!form.title || !form.content) && "opacity-50",
                )}
              >
                <Check className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
