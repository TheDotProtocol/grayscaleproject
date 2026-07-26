"use client";

import { ChevronDown } from "lucide-react";
import { DOCS_VERSION } from "@/lib/docs/manifest";

export function DocsVersionSelector() {
  return (
    <div className="docs-version">
      <label htmlFor="docs-version" className="sr-only">
        Documentation version
      </label>
      <div className="relative">
        <select id="docs-version" className="docs-version-select" defaultValue="v1" disabled>
          <option value="v1">{DOCS_VERSION}</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
      </div>
    </div>
  );
}
