"use client";

import { useState } from "react";
import { ARCHITECTURE_LAYERS, PLATFORM, SECTIONS, WHY, type ArchitectureLayerId } from "./content";
import { ArchitectureModal } from "./architecture-modal";
import { FeatureDashboardPreview } from "./dashboard-previews";
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
  const [activeLayer, setActiveLayer] = useState<ArchitectureLayerId | null>(null);

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
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border landing-gold-border-20 landing-gold-bg-5">
                <span className="text-xs font-semibold landing-gold">{i + 1}</span>
              </div>
              <h3 className="text-sm font-medium text-white">{pillar.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/45">{pillar.desc}</p>
            </LuxuryCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-16">
        <p className="mb-4 text-center text-xs text-white/35">Click a layer to learn more</p>
        <div className="landing-arch-visual" role="list" aria-label="Architecture layers">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              role="listitem"
              className={`landing-arch-layer landing-arch-layer-btn ${layer.accent ? "landing-arch-layer-accent" : ""}`}
              onClick={() => setActiveLayer(layer.id)}
              aria-haspopup="dialog"
            >
              {layer.label}
            </button>
          ))}
        </div>
      </FadeIn>

      <ArchitectureModal layerId={activeLayer} onClose={() => setActiveLayer(null)} />
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
              <FeatureDashboardPreview id={section.id} />
            </FadeIn>
          </div>
        </Section>
      ))}
    </>
  );
}
