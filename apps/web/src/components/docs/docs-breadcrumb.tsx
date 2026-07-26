import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DocEntry } from "@/lib/docs/manifest";

function hrefFor(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export function DocsBreadcrumb({ entry }: { entry: DocEntry }) {
  const crumbs = [
    { label: "Docs", href: "/docs" },
    { label: entry.section, href: undefined },
    { label: entry.title, href: hrefFor(entry.slug) },
  ];

  return (
    <nav aria-label="Breadcrumb" className="docs-breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/25" aria-hidden />}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="text-white/45 transition hover:text-white/70">
                {crumb.label}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? "text-white/80" : "text-white/45"}>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
