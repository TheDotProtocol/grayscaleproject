"use client";

import { PRICING } from "./content";
import { CheckIcon, FadeIn, LuxuryCard, PrimaryButton, Section, SectionHeader } from "./primitives";

interface PricingSectionProps {
  onWaitlistClick: () => void;
}

export function PricingSection({ onWaitlistClick }: PricingSectionProps) {
  return (
    <Section id={PRICING.id}>
      <SectionHeader title={PRICING.title} subtitle={PRICING.subtitle} />

      <div className="grid gap-6 lg:grid-cols-4">
        {PRICING.plans.map((plan, i) => (
          <FadeIn key={plan.id} delay={i * 0.06}>
            <LuxuryCard
              className={`flex h-full flex-col p-7 ${plan.highlighted ? "landing-pricing-highlight" : ""}`}
              hover={!plan.highlighted}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block w-fit rounded-full border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/10 px-3 py-1 text-[10px] font-medium tracking-wider text-[hsl(var(--gold))] uppercase">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-medium text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-white/40">{plan.audience}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-light text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-white/40">{plan.period}</span>}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/50">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/55">
                    <CheckIcon className="mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <PrimaryButton
                className="mt-8 w-full"
                onClick={onWaitlistClick}
              >
                {plan.cta}
              </PrimaryButton>
            </LuxuryCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-10">
        <LuxuryCard className="landing-founding-card p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="rounded-full border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/10 px-3 py-1 text-[10px] font-medium tracking-wider text-[hsl(var(--gold))] uppercase">
                {PRICING.founding.badge}
              </span>
              <h3 className="mt-4 text-xl font-medium text-white">{PRICING.founding.name}</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {PRICING.founding.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-white/55">
                    <CheckIcon />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <PrimaryButton onClick={onWaitlistClick}>Become a Founding Member</PrimaryButton>
          </div>
        </LuxuryCard>
      </FadeIn>

      <FadeIn className="mt-16 overflow-x-auto">
        <h3 className="mb-6 text-center text-sm font-medium text-white/50">Feature Comparison</h3>
        <table className="landing-comparison-table w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr>
              <th className="pb-4 font-medium text-white/40">Feature</th>
              <th className="pb-4 text-center font-medium text-white/60">Explorer</th>
              <th className="pb-4 text-center font-medium text-white/60">Builder</th>
              <th className="pb-4 text-center font-medium text-[hsl(var(--gold))]/80">Scale</th>
              <th className="pb-4 text-center font-medium text-white/60">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {PRICING.comparisonFeatures.map((row) => (
              <tr key={row.name} className="border-t border-white/5">
                <td className="py-3 text-white/70">{row.name}</td>
                <td className="py-3 text-center"><Cell value={row.explorer} /></td>
                <td className="py-3 text-center"><Cell value={row.builder} /></td>
                <td className="py-3 text-center"><Cell value={row.scale} /></td>
                <td className="py-3 text-center"><Cell value={row.enterprise} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </FadeIn>
    </Section>
  );
}

function Cell({ value }: { value: boolean }) {
  return value ? (
    <CheckIcon className="mx-auto" />
  ) : (
    <span className="text-white/20">—</span>
  );
}
