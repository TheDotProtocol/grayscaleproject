import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DocEntry } from "@/lib/docs/manifest";

function hrefFor(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export function DocsPrevNext({ prev, next }: { prev?: DocEntry; next?: DocEntry }) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Documentation pagination" className="docs-prev-next">
      {prev ? (
        <Link href={hrefFor(prev.slug)} className="docs-prev-next-link">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>
            <span className="docs-prev-next-label">Previous</span>
            <span className="docs-prev-next-title">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={hrefFor(next.slug)} className="docs-prev-next-link docs-prev-next-link-next">
          <span className="text-right">
            <span className="docs-prev-next-label">Next</span>
            <span className="docs-prev-next-title">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
