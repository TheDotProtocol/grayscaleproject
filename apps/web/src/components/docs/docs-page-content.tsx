import "server-only";

import { notFound } from "next/navigation";
import { loadDoc } from "@/lib/docs/load-doc";
import { getDocNav } from "@/lib/docs/manifest";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsPrevNext } from "@/components/docs/docs-prev-next";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";

export function DocsPageContent({ slug }: { slug: string }) {
  const doc = loadDoc(slug);
  if (!doc) notFound();

  const { prev, next } = getDocNav(slug);

  return (
    <article>
      <DocsBreadcrumb entry={doc.entry} />
      <header className="docs-page-header">
        <h1 className="docs-page-title">{doc.entry.title}</h1>
        {doc.entry.description && <p className="docs-page-desc">{doc.entry.description}</p>}
      </header>
      <MarkdownRenderer content={doc.content} />
      <DocsPrevNext prev={prev} next={next} />
    </article>
  );
}
