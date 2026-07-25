"use client";

import Image from "next/image";
import Link from "next/link";

interface GrayscaleLogoProps {
  /** nav = top-left mark; mark = icon only */
  variant?: "nav" | "mark";
  className?: string;
  href?: string;
}

/** Official Project Grayscale logo — top-left nav only */
export function GrayscaleLogo({
  variant = "nav",
  className = "",
  href = "/",
}: GrayscaleLogoProps) {
  const content =
    variant === "mark" ? (
      <Image
        src="/grayscale-logo.png"
        alt="Grayscale"
        width={80}
        height={80}
        className={`h-8 w-8 rounded-[4px] object-cover object-top ${className}`}
        priority
      />
    ) : (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Image
          src="/grayscale-logo.png"
          alt=""
          width={80}
          height={80}
          className="h-8 w-8 shrink-0 rounded-[4px] object-cover object-top"
          aria-hidden
          priority
        />
        <span className="font-semibold text-xl tracking-tight text-white">Grayscale</span>
      </div>
    );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {content}
      </Link>
    );
  }

  return content;
}
