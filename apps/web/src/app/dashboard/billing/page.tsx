"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, FileDown, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/header";
import { exportBillsExcel, exportBillsPdf } from "@/lib/export";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface Bill {
  id: string;
  name: string;
  amountCents: number;
  currency: string;
  dueDate: string;
  recurrence: string;
  category: string | null;
  isPaid: boolean;
}

export default function BillingPage() {
  const { token, company } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
    recurrence: "monthly",
    category: "",
  });

  const load = useCallback(async () => {
    if (!token || !company?.id) return;
    const data = await api<Bill[]>(`/companies/${company.id}/bills`, { token });
    setBills(data);
  }, [token, company?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function createBill() {
    if (!token || !company?.id) return;
    await api(`/companies/${company.id}/bills`, {
      method: "POST",
      token,
      body: JSON.stringify({
        name: form.name,
        amountCents: Math.round(parseFloat(form.amount) * 100),
        dueDate: form.dueDate,
        recurrence: form.recurrence,
        category: form.category || undefined,
      }),
    });
    setShowForm(false);
    setForm({ name: "", amount: "", dueDate: "", recurrence: "monthly", category: "" });
    load();
  }

  async function togglePaid(bill: Bill) {
    if (!token || !company?.id) return;
    await api(`/companies/${company.id}/bills/${bill.id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ isPaid: !bill.isPaid }),
    });
    load();
  }

  const unpaid = bills.filter((b) => !b.isPaid);
  const overdue = unpaid.filter((b) => new Date(b.dueDate) < new Date());
  const dueSoon = unpaid.filter((b) => {
    const d = new Date(b.dueDate);
    const now = new Date();
    const week = new Date();
    week.setDate(week.getDate() + 7);
    return d >= now && d <= week;
  });

  return (
    <>
      <DashboardHeader
        title="Billing Tracker"
        subtitle="Visual bill management with export for your finance workflow"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => exportBillsPdf(bills)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-foreground/80 hover:border-primary/40"
            >
              <FileDown className="h-3.5 w-3.5" /> PDF
            </button>
            <button
              type="button"
              onClick={() => exportBillsExcel(bills)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-foreground/80 hover:border-primary/40"
            >
              <FileDown className="h-3.5 w-3.5" /> Excel
            </button>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Add bill
            </button>
          </div>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Unpaid", value: unpaid.length, color: "text-amber-400" },
          { label: "Due this week", value: dueSoon.length, color: "text-orange-400" },
          { label: "Overdue", value: overdue.length, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-5">
            <p className={cn("text-3xl font-bold", color)}>{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="glass-card mb-6 p-6">
          <h3 className="mb-4 font-semibold">New bill</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              placeholder="Bill name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount (USD)"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              value={form.recurrence}
              onChange={(e) => setForm((f) => ({ ...f, recurrence: e.target.value }))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="once">One-time</option>
            </select>
            <button
              type="button"
              onClick={createBill}
              disabled={!form.name || !form.amount || !form.dueDate}
              className="rounded-xl bg-primary py-2 text-sm font-medium disabled:opacity-50"
            >
              Save bill
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {bills.map((bill) => {
          const isOverdue = !bill.isPaid && new Date(bill.dueDate) < new Date();
          return (
            <div
              key={bill.id}
              className={cn(
                "glass-card flex items-center gap-4 p-4 transition",
                isOverdue && "border-red-500/30",
                bill.isPaid && "opacity-60",
              )}
            >
              <button type="button" onClick={() => togglePaid(bill)} className="shrink-0">
                {bill.isPaid ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/70 hover:text-primary" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{bill.name}</p>
                <p className="text-xs text-muted-foreground">
                  Due {formatDate(bill.dueDate)} · {bill.recurrence}
                  {bill.category && ` · ${bill.category}`}
                </p>
              </div>
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </span>
              )}
              <p className={cn("text-lg font-semibold", bill.isPaid ? "text-muted-foreground line-through" : "text-white")}>
                {formatCurrency(bill.amountCents, bill.currency)}
              </p>
            </div>
          );
        })}
        {bills.length === 0 && (
          <div className="glass-card p-12 text-center text-muted-foreground">
            No bills yet — add your recurring expenses to stay ahead of cash flow.
          </div>
        )}
      </div>
    </>
  );
}
