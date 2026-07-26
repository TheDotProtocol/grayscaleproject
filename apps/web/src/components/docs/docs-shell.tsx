"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { GrayscaleLogo } from "@/components/landing/grayscale-logo";
import { PrimaryButton } from "@/components/landing/os-v1/primitives";
import { DocsSidebar } from "./docs-sidebar";

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-os docs-layout min-h-screen">
      <header className="docs-header">
        <div className="landing-container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <GrayscaleLogo href="/" />
            <span className="hidden text-sm text-white/35 sm:inline">Documentation</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="landing-nav-link hidden sm:inline">
              Home
            </Link>
            <Link href="/contact" className="landing-nav-link hidden md:inline">
              Contact
            </Link>
            <PrimaryButton href="/#cta" className="!px-4 !py-2 text-xs">
              Request Access
            </PrimaryButton>
          </nav>
        </div>
      </header>

      <div className="landing-container docs-body">
        <DocsSidebar />
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
