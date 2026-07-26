"use client";

import Link from "next/link";
import { useState } from "react";
import { useWaitlist } from "@/hooks/use-waitlist";
import { CTA, FAQ, FOOTER } from "./content";
import { FadeIn, PrimaryButton, Section, SectionHeader } from "./primitives";
import { GrayscaleLogo } from "../grayscale-logo";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id={FAQ.id}>
      <SectionHeader title={FAQ.title} />
      <div className="mx-auto max-w-3xl divide-y divide-white/5">
        {FAQ.items.map((item, i) => (
          <FadeIn key={item.q} delay={i * 0.04}>
            <div className="py-5">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 text-left"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-white">{item.q}</span>
                <span className="mt-1 shrink-0 landing-gold-60">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="mt-3 text-sm leading-relaxed text-white/50">{item.a}</p>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

export function CTASection() {
  const { mutate, isPending } = useWaitlist();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate({ data: { email: email.trim() } }, { onSuccess: () => setDone(true) });
  };

  return (
    <Section id="cta" className="landing-section-cta">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="landing-heading">{CTA.title}</h2>
          <p className="landing-subheading mt-5">{CTA.subtitle}</p>
          {done ? (
            <p className="mt-8 text-sm landing-gold-80" role="status">
              Thank you. We will be in touch shortly.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <label htmlFor="waitlist-email" className="sr-only">
                {CTA.placeholder}
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                placeholder={CTA.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="landing-input"
              />
              <PrimaryButton type="submit">{isPending ? "Submitting…" : CTA.button}</PrimaryButton>
            </form>
          )}
        </div>
      </FadeIn>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="landing-container">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <GrayscaleLogo href="/" />
            <p className="mt-4 text-xs text-white/35">{FOOTER.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/45 transition hover:text-white/70">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-10 text-xs text-white/25">{FOOTER.legal}</p>
      </div>
    </footer>
  );
}
