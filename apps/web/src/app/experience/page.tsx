"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Brain, BookOpen, Receipt, Github, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { GrayscaleLogo } from "@/components/landing/grayscale-logo";

const tourSteps = [
  { icon: LayoutDashboard, title: "Command Center", desc: "Your founder dashboard with live stats, executive status, and AI insights.", href: "/dashboard" },
  { icon: Brain, title: "Company Memory", desc: "Capture and search institutional knowledge your AI team references.", href: "/dashboard/memory" },
  { icon: BookOpen, title: "Daily Journal", desc: "Log your day, get AI summaries, export to PDF or DOCX.", href: "/dashboard/journal" },
  { icon: Receipt, title: "Billing Tracker", desc: "Visual bill management with overdue alerts and exports.", href: "/dashboard/billing" },
  { icon: Github, title: "GitHub Integration", desc: "Sync commits from your repo into company memory automatically.", href: "/dashboard/integrations" },
];

export default function ExperiencePage() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <GrayscaleLogo variant="nav" href="/" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Experience Grayscale</span>
          </div>
          {token ? (
            <Link href="/dashboard" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
              Open Dashboard
            </Link>
          ) : (
            <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Interactive Tour</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Experience Grayscale
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Walk through the founder OS — memory, journal, billing, and AI executives working together.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tourSteps.map((step) => (
            <Link
              key={step.title}
              href={token ? step.href : "/login"}
              className="group glass-card p-6 transition hover:border-blue-500/30 hover:bg-white/[0.04]"
            >
              <step.icon className="mb-4 h-5 w-5 text-blue-400" />
              <h3 className="font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 opacity-0 transition group-hover:opacity-100">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href={token ? "/dashboard" : "/login"}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm"
          >
            {token ? "Go to Command Center" : "Sign in to explore"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
