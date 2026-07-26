"use client";

import { ROADMAP } from "./content";
import { FadeIn, Section, SectionHeader } from "./primitives";

export function RoadmapSection() {
  return (
    <Section id={ROADMAP.id} className="landing-section-alt">
      <SectionHeader title={ROADMAP.title} subtitle={ROADMAP.subtitle} />

      <div className="grid gap-12 lg:grid-cols-2">
        <FadeIn>
          <h3 className="mb-6 flex items-center gap-2 text-sm font-medium text-white">
            <span className="h-2 w-2 rounded-full landing-gold-dot" aria-hidden />
            Delivered
          </h3>
          <ul className="space-y-4">
            {ROADMAP.completed.map((item) => (
              <li key={item.name} className="landing-roadmap-item landing-roadmap-done">
                <p className="font-medium text-white">{item.name}</p>
                <p className="mt-1 text-xs text-white/45">{item.detail}</p>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h3 className="mb-6 flex items-center gap-2 text-sm font-medium text-white">
            <span className="h-2 w-2 rounded-full border border-white/30" aria-hidden />
            Upcoming
          </h3>
          <ul className="space-y-4">
            {ROADMAP.upcoming.map((item) => (
              <li key={item.name} className="landing-roadmap-item">
                <p className="font-medium text-white/80">{item.name}</p>
                <p className="mt-1 text-xs text-white/40">{item.detail}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}
