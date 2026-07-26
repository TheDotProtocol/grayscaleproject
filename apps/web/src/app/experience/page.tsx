"use client";

import Link from "next/link";
import { ArrowRight, Brain, BookOpen, Github, LayoutDashboard, Receipt } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { GrayscaleLogo } from "@/components/landing/grayscale-logo";
import { PrimaryButton, SecondaryButton } from "@/components/landing/os-v1/primitives";

const tourSteps = [
  { icon: LayoutDashboard, title: "Command Center", desc: "Your founder dashboard with live stats, executive status, and organizational insights.", href: "/dashboard" },
  { icon: Brain, title: "Company Memory", desc: "Capture and search institutional knowledge your organization references.", href: "/dashboard/memory" },
  { icon: BookOpen, title: "Daily Journal", desc: "Log your day, get summaries, export to PDF or DOCX.", href: "/dashboard/journal" },
  { icon: Receipt, title: "Billing Tracker", desc: "Visual bill management with overdue alerts and exports.", href: "/dashboard/billing" },
  { icon: Github, title: "GitHub Integration", desc: "Sync commits from your repo into company memory automatically.", href: "/dashboard/integrations" },
];

export default function ExperiencePage() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-[4.5rem]">
          <GrayscaleLogo variant="nav" href="/" />
          <p className="hidden text-sm font-medium text-muted-foreground sm:block">Experience Grayscale OS</p>
          {token ? (
            <PrimaryButton href="/dashboard">Open Dashboard</PrimaryButton>
          ) : (
            <SecondaryButton href="/login">Sign in</SecondaryButton>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:pt-32">
        <div className="text-center">
          <p className="landing-eyebrow">Interactive Tour</p>
          <h1 className="mt-4 text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Experience Grayscale OS
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Walk through the founder workspace — memory, journal, billing, and organizational intelligence working together.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tourSteps.map((step) => (
            <Link
              key={step.title}
              href={token ? step.href : "/login"}
              className="group glass-card p-6 transition hover:border-primary/20"
            >
              <step.icon className="icon-accent mb-4 h-5 w-5" />
              <h3 className="font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition group-hover:opacity-100">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <PrimaryButton href={token ? "/dashboard" : "/login"}>
            {token ? "Go to Command Center" : "Sign in to explore"}
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
