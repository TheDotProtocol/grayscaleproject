import type { Metadata } from "next";
import { DocsShell } from "@/components/docs/docs-shell";

export const metadata: Metadata = {
  title: "Documentation — Grayscale OS v1.0",
  description: "Grayscale OS documentation — getting started, architecture, API, SDK, and platform guides.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
