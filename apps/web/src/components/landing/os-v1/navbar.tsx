"use client";

import { useEffect, useState } from "react";
import { GrayscaleLogo } from "../grayscale-logo";
import { NAV_LINKS } from "./content";
import { PrimaryButton } from "./primitives";

interface NavbarProps {
  onWaitlistClick: () => void;
}

export function Navbar({ onWaitlistClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "landing-nav-scrolled" : "bg-transparent"
      }`}
    >
      <nav className="landing-container flex h-16 items-center justify-between md:h-[4.5rem]" aria-label="Main">
        <GrayscaleLogo href="/" />

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="landing-nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/login" className="landing-nav-link text-sm">
            Sign in
          </a>
          <PrimaryButton onClick={onWaitlistClick}>Request Access</PrimaryButton>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-white/80 transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white/80 transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white/80 transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-[hsl(var(--graphite))]/95 backdrop-blur-xl md:hidden">
          <ul className="landing-container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2 border-t border-white/5 pt-4">
              <a href="/login" className="px-3 py-2 text-sm text-white/60">
                Sign in
              </a>
              <PrimaryButton onClick={() => { setOpen(false); onWaitlistClick(); }}>
                Request Access
              </PrimaryButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
