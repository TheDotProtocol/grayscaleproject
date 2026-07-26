"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

export function Section({
  id,
  className,
  children,
  narrow,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <section id={id} className={cn("landing-section relative", className)}>
      <div className={cn("landing-container", narrow && "max-w-4xl")}>{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={cn("mb-14 md:mb-20", align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow && <p className="landing-eyebrow mb-4">{eyebrow}</p>}
      <h2 className="landing-heading">{title}</h2>
      {subtitle && <p className="landing-subheading mt-5">{subtitle}</p>}
    </header>
  );
}

/** CSS-only fade-in — content visible without JavaScript */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn("landing-fade-in", className)}
      style={{ animationDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function LuxuryCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("landing-card", hover && "landing-card-hover", className)}>
      {children}
    </div>
  );
}

export function GoldAccent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("landing-gold-text", className)}>{children}</span>;
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  href,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
  className?: string;
}) {
  const cls = cn("landing-btn-primary", className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  href,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const cls = cn("landing-btn-secondary", className);
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 shrink-0 landing-gold", className)} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
