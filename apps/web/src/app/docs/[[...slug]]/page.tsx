import type { Metadata } from "next";
import { DocsPageContent } from "@/components/docs/docs-page-content";
import { getAllDocSlugs } from "@/lib/docs/load-doc";
import { getDocBySlug } from "@/lib/docs/manifest";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  return [{ slug: [] }, ...getAllDocSlugs().map((slug) => ({ slug: slug.split("/") }))];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts?.join("/") ?? "";
  const entry = getDocBySlug(slug);
  if (!entry) return { title: "Not Found — Grayscale Docs" };
  return {
    title: `${entry.title} — Grayscale OS Docs`,
    description: entry.description,
  };
}

export default async function DocsCatchAllPage({ params }: PageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts?.join("/") ?? "";
  return <DocsPageContent slug={slug} />;
}
