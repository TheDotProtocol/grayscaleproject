"use client";

import { PLATFORM, SECTIONS, WHY } from "./content";
import { CheckIcon, FadeIn, LuxuryCard, Section, SectionHeader } from "./primitives";

export function WhySection() {
  return (
    <Section id={WHY.id} className="landing-section-alt">
      <SectionHeader title={WHY.title} subtitle={WHY.subtitle} />
      <div className="grid gap-6 md:grid-cols-2">
        {WHY.points.map((point, i) => (
          <FadeIn key={point.title} delay={i * 0.06}>
            <LuxuryCard className="h-full p-8">
              <h3 className="text-lg font-medium tracking-tight text-white">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{point.body}</p>
            </LuxuryCard>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

export function PlatformSection() {
  return (
    <Section id={PLATFORM.id}>
      <SectionHeader title={PLATFORM.title} subtitle={PLATFORM.subtitle} />
      <FadeIn>
        <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-white/55">
          {PLATFORM.body}
        </p>
      </FadeIn>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM.pillars.map((pillar, i) => (
          <FadeIn key={pillar.label} delay={i * 0.05}>
            <LuxuryCard className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--gold))]/20 bg-[hsl(var(--gold))]/5">
                <span className="text-xs font-semibold text-[hsl(var(--gold))]">{i + 1}</span>
              </div>
              <h3 className="text-sm font-medium text-white">{pillar.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/45">{pillar.desc}</p>
            </LuxuryCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-16">
        <div className="landing-arch-visual" aria-hidden>
          <div className="landing-arch-layer">Architecture Lock</div>
          <div className="landing-arch-layer">Founder Constitution</div>
          <div className="landing-arch-layer">Organizational Runtime</div>
          <div className="landing-arch-layer">Policy Engine · Governance Kernel</div>
          <div className="landing-arch-layer landing-arch-layer-accent">Mission Control</div>
        </div>
      </FadeIn>
    </Section>
  );
}

export function FeatureSections() {
  return (
    <>
      {SECTIONS.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          className={index % 2 === 1 ? "landing-section-alt" : undefined}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <p className="landing-eyebrow mb-4">{section.eyebrow}</p>
              <h2 className="landing-heading text-left">{section.title}</h2>
              <p className="landing-subheading mt-5 text-left">{section.body}</p>
              <ul className="mt-8 space-y-3">
                {section.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-white/60">
                    <CheckIcon className="mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.08} className={index % 2 === 1 ? "lg:order-1" : undefined}>
              <FeatureVisual id={section.id} title={section.eyebrow} />
            </FadeIn>
          </div>
        </Section>
      ))}
    </>
  );
}

function FeatureVisual({ id, title }: { id: string; title: string }) {
  return (
    <div className="landing-feature-visual">
      <div className="landing-feature-visual-header">
        <span className="text-xs font-medium tracking-wider text-[hsl(var(--gold))]/70 uppercase">{title}</span>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className={`h-8 w-8 rounded-md landing-visual-icon-${id}`} />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-3/4 rounded bg-white/10" />
                <div className="h-1.5 w-1/2 rounded bg-white/5" />
              </div>
              <div className="h-5 w-12 rounded-full bg-[hsl(var(--gold))]/10" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-white/35">
          <span>Explainable · Auditable</span>
          <span className="text-[hsl(var(--gold))]/60">Bedrock</span>
        </div>
      </div>
    </div>
  );
}
