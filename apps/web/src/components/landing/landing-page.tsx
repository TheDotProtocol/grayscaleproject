"use client";

import { useRef } from "react";
import Navbar from "./replit/Navbar";
import Hero from "./replit/Hero";
import FounderProblem from "./replit/FounderProblem";
import ExecutiveTeam from "./replit/ExecutiveTeam";
import HowItWorks from "./replit/HowItWorks";
import FourPhases from "./replit/FourPhases";
import Features from "./replit/Features";
import FounderDashboard from "./replit/FounderDashboard";
import Privacy from "./replit/Privacy";
import Roadmap from "./replit/Roadmap";
import Testimonials from "./replit/Testimonials";
import FAQ from "./replit/FAQ";
import FinalCTA from "./replit/FinalCTA";
import Footer from "./replit/Footer";

export function LandingPage() {
  const ctaRef = useRef<HTMLElement>(null);

  const scrollToWaitlist = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar onWaitlistClick={scrollToWaitlist} />
      <main>
        <Hero onWaitlistClick={scrollToWaitlist} />
        <FounderProblem />
        <ExecutiveTeam />
        <HowItWorks />
        <FourPhases />
        <Features />
        <FounderDashboard />
        <Privacy />
        <Roadmap />
        <Testimonials />
        <FAQ />
        <section ref={ctaRef}>
          <FinalCTA />
        </section>
      </main>
      <Footer />
    </div>
  );
}
