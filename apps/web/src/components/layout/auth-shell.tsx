"use client";

import { GrayscaleLogo } from "@/components/landing/grayscale-logo";

/** Auth pages — logo fixed top-left, Replit theme */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
          <GrayscaleLogo variant="nav" href="/" />
        </div>
      </header>
      <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-12">
        {children}
      </div>
    </div>
  );
}
