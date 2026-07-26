"use client";

import { HERO } from "./content";
import { FadeIn, GoldAccent, PrimaryButton, SecondaryButton } from "./primitives";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section className="landing-hero relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="landing-hero-glow" aria-hidden />
      <div className="landing-container relative">
        <FadeIn>
          <p className="landing-eyebrow mb-6">{HERO.eyebrow}</p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h1 className="landing-hero-title max-w-4xl">
            The <GoldAccent>Organizational Operating System</GoldAccent> for decisive leadership.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="landing-hero-subtitle mt-7 max-w-2xl">{HERO.subheadline}</p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryButton onClick={onWaitlistClick}>{HERO.primaryCta}</PrimaryButton>
            <SecondaryButton href="#platform">{HERO.secondaryCta}</SecondaryButton>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-16 md:mt-20">
          <div className="landing-mission-preview" role="img" aria-label="Mission Control preview">
            <div className="landing-mission-preview-bar">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 text-xs text-white/40">Mission Control</span>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-3 md:p-6">
              <PreviewWidget title="Organizational Health" value="94" unit="/100" trend="+2" />
              <PreviewWidget title="Policy Compliance" value="100" unit="%" trend="Certified" />
              <PreviewWidget title="Attention Budget" value="72" unit="%" trend="Optimal" />
              <PreviewWidget title="Council Deliberations" value="3" unit=" active" trend="Scheduled" wide />
              <PreviewWidget title="Twin Alignment" value="88" unit="%" trend="Stable" wide />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function PreviewWidget({
  title,
  value,
  unit,
  trend,
  wide,
}: {
  title: string;
  value: string;
  unit: string;
  trend: string;
  wide?: boolean;
}) {
  return (
    <div className={`landing-preview-widget ${wide ? "md:col-span-2" : ""}`}>
      <p className="text-xs font-medium tracking-wide text-white/45 uppercase">{title}</p>
      <p className="mt-2 font-light text-white">
        <span className="text-2xl md:text-3xl">{value}</span>
        <span className="text-sm text-white/50">{unit}</span>
      </p>
      <p className="mt-2 text-xs text-[hsl(var(--gold))]/80">{trend}</p>
    </div>
  );
}
