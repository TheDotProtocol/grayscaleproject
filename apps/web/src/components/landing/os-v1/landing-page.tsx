"use client";

import { useRef } from "react";
import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { WhySection, PlatformSection, FeatureSections } from "./sections";
import { TrustSection } from "./trust-section";
import { PricingSection } from "./pricing-section";
import { RoadmapSection } from "./roadmap-section";
import { FAQSection, CTASection, Footer } from "./faq-footer";

export function GrayscaleOSLandingPage() {
  const ctaRef = useRef<HTMLElement>(null);

  const scrollToWaitlist = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-os">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4">
        Skip to content
      </a>
      <Navbar onWaitlistClick={scrollToWaitlist} />
      <main id="main">
        <Hero onWaitlistClick={scrollToWaitlist} />
        <WhySection />
        <PlatformSection />
        <FeatureSections />
        <TrustSection />
        <PricingSection onWaitlistClick={scrollToWaitlist} />
        <RoadmapSection />
        <FAQSection />
        <section ref={ctaRef} aria-label="Request access">
          <CTASection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
