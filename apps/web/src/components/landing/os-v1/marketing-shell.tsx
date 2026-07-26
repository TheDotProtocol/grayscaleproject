"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { FOOTER } from "./content";
import { GrayscaleLogo } from "../grayscale-logo";
import { PrimaryButton } from "./primitives";

export function MarketingShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="landing-os min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="landing-container flex h-16 items-center justify-between md:h-[4.5rem]">
          <GrayscaleLogo href="/" />
          <nav className="hidden items-center gap-6 md:flex" aria-label="Marketing">
            <Link href="/" className="landing-nav-link">
              Home
            </Link>
            <Link href="/docs" className="landing-nav-link">
              Documentation
            </Link>
            <Link href="/leadership" className="landing-nav-link">
              Leadership
            </Link>
            <Link href="/contact" className="landing-nav-link">
              Contact
            </Link>
            <Link href="/login" className="landing-nav-link">
              Sign in
            </Link>
          </nav>
          <PrimaryButton href="/#cta" className="hidden sm:inline-flex">
            Request Access
          </PrimaryButton>
        </div>
      </header>
      <main className="landing-container pb-16 pt-28 md:pt-32">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="landing-eyebrow mb-4">Grayscale OS v1.0</p>
          <h1 className="landing-heading">{title}</h1>
          {subtitle && <p className="landing-subheading mt-5">{subtitle}</p>}
        </div>
        {children}
      </main>
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
    </div>
  );
}
