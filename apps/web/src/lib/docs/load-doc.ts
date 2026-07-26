import "server-only";

import fs from "fs";
import path from "path";
import { DOC_ENTRIES, getDocBySlug, type DocEntry } from "./manifest";

const REPO_ROOT = path.resolve(process.cwd(), "../..");

const ALLOWED_FILES = new Set(DOC_ENTRIES.map((d) => d.file));

export interface LoadedDoc {
  entry: DocEntry;
  content: string;
}

function resolveDocPath(relativeFile: string): string {
  if (!ALLOWED_FILES.has(relativeFile)) {
    throw new Error("Document not in public manifest");
  }
  const absolute = path.resolve(REPO_ROOT, relativeFile);
  const publicRoot = path.join(REPO_ROOT, "docs", "public");
  if (!absolute.startsWith(publicRoot)) {
    throw new Error("Invalid document path — public docs only");
  }
  return absolute;
}

export function loadDoc(slug: string): LoadedDoc | null {
  const entry = getDocBySlug(slug);
  if (!entry) return null;

  const absolute = resolveDocPath(entry.file);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Document file missing: ${entry.file}`);
  }

  const content = fs.readFileSync(absolute, "utf8");
  return { entry, content };
}

export function getAllDocSlugs(): string[] {
  return DOC_ENTRIES.map((d) => d.slug).filter(Boolean);
}
