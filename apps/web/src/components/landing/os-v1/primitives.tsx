"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

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
      {eyebrow && (
        <p className="landing-eyebrow mb-4">{eyebrow}</p>
      )}
      <h2 className="landing-heading">{title}</h2>
      {subtitle && <p className="landing-subheading mt-5">{subtitle}</p>}
    </header>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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

export function GoldAccent({ children }: { children: ReactNode }) {
  return <span className="landing-gold-text">{children}</span>;
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button type={type} onClick={onClick} className={cn("landing-btn-primary", className)}>
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
    <svg className={cn("h-4 w-4 shrink-0 text-[hsl(var(--gold))]", className)} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
