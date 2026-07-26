"use client";

import { HERO } from "./content";
import { HeroMissionControlPreview } from "./dashboard-previews";
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
          <h1 className="landing-hero-title max-w-5xl">
            The{" "}
            <GoldAccent className="landing-hero-accent">Organizational Operating System</GoldAccent>{" "}
            for decisive leadership.
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
          <div role="img" aria-label="Mission Control dashboard preview">
            <HeroMissionControlPreview />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
