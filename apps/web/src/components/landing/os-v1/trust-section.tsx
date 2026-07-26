"use client";

import { TRUST } from "./content";
import { FadeIn, LuxuryCard, Section, SectionHeader } from "./primitives";

export function TrustSection() {
  return (
    <Section id={TRUST.id} className="landing-section-alt">
      <SectionHeader title={TRUST.title} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST.items.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.04}>
            <LuxuryCard className="p-6">
              <h3 className="text-sm font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/45">{item.desc}</p>
            </LuxuryCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-16">
        <h3 className="mb-8 text-center text-sm font-medium tracking-wider text-white/50 uppercase">
          Certification Timeline
        </h3>
        <div className="landing-timeline">
          {TRUST.timeline.map((item, i) => (
            <div key={item.phase} className="landing-timeline-item">
              <div className="landing-timeline-dot" aria-hidden />
              {i < TRUST.timeline.length - 1 && <div className="landing-timeline-line" aria-hidden />}
              <div className="pb-10 pl-8">
                <p className="text-xs font-medium text-[hsl(var(--gold))]/80">{item.date}</p>
                <p className="mt-1 font-medium text-white">{item.phase}</p>
                <p className="mt-1 text-xs text-white/45">{item.score}</p>
                <span className="mt-2 inline-block rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50 uppercase tracking-wide">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
