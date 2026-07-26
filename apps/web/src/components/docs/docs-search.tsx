"use client";

import { Search } from "lucide-react";

export function DocsSearchPlaceholder() {
  return (
    <div className="docs-search">
      <Search className="h-4 w-4 shrink-0 text-white/35" aria-hidden />
      <input
        type="search"
        disabled
        placeholder="Search documentation (coming soon)"
        aria-label="Search documentation"
        className="docs-search-input"
      />
    </div>
  );
}
