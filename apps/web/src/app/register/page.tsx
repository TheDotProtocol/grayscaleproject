"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { AuthShell } from "@/components/layout/auth-shell";

function RegisterForm() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: searchParams.get("email") ?? "",
    password: "",
    companyName: "",
    industry: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="glass-card w-full max-w-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-foreground">Launch your company OS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Register as founder and create your company workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-muted-foreground">Your name</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="input-field !rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className="input-field !rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-muted-foreground">Password</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} className="input-field !rounded-xl" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Company name</label>
              <input required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className="input-field !rounded-xl" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Industry</label>
              <input value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="SaaS, Fintech…" className="input-field !rounded-xl" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm">
            {loading ? "Creating…" : "Create company workspace"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="link-accent">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
