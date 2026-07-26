"use client";

import { GrayscaleLogo } from "@/components/landing/grayscale-logo";

/** Auth pages — Grayscale OS v1.0 shell */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6 md:h-[4.5rem]">
          <GrayscaleLogo variant="nav" href="/" />
        </div>
      </header>
      <div className="flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
        {children}
      </div>
    </div>
  );
}
