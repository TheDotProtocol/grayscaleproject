import type { Metadata } from "next";
import { LEADERSHIP } from "@/components/landing/os-v1/content";
import { MarketingShell } from "@/components/landing/os-v1/marketing-shell";
import { LuxuryCard } from "@/components/landing/os-v1/primitives";

export const metadata: Metadata = {
  title: "Leadership — Grayscale OS",
  description: "Meet the leadership team behind Project Grayscale and the Organizational Operating System.",
};

export default function LeadershipPage() {
  return (
    <MarketingShell
      title="Leadership"
      subtitle="The team building infrastructure for collective judgment — constitutional governance, enterprise intelligence, and organizational clarity."
    >
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {LEADERSHIP.map((leader) => (
          <LuxuryCard key={leader.name} className="p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border landing-gold-border-20 landing-gold-bg-10 text-sm font-medium landing-gold">
                {leader.initials}
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">{leader.name}</h2>
                <p className="text-sm landing-gold-70">{leader.role}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/55">{leader.bio}</p>
          </LuxuryCard>
        ))}
      </div>
    </MarketingShell>
  );
}
