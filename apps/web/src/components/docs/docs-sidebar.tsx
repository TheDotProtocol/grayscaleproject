"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_SECTIONS, getDocsBySection, type DocEntry } from "@/lib/docs/manifest";
import { DocsSearchPlaceholder } from "./docs-search";
import { DocsVersionSelector } from "./docs-version-selector";

function docHref(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

function isActive(pathname: string, slug: string) {
  const href = docHref(slug);
  return pathname === href;
}

function navLinkClass(active: boolean) {
  return active
    ? "docs-nav-link docs-nav-link-active"
    : "docs-nav-link";
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar" aria-label="Documentation navigation">
      <DocsVersionSelector />
      <DocsSearchPlaceholder />

      <nav className="docs-nav">
        {DOC_SECTIONS.map((section) => {
          const items = getDocsBySection(section);
          if (items.length === 0) return null;
          return (
            <div key={section} className="docs-nav-section">
              <p className="docs-nav-heading">{section}</p>
              <ul>
                {items.map((item: DocEntry) => (
                  <li key={item.slug || "index"}>
                    <Link
                      href={docHref(item.slug)}
                      className={navLinkClass(isActive(pathname, item.slug))}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
