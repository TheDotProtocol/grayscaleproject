"use client";

import { Children } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import { CopyCodeButton } from "./copy-code-button";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="docs-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link href={href} className="docs-link">
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} className="docs-link" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          pre: ({ children }) => {
            const codeEl = Children.toArray(children).find(
              (child) => typeof child === "object" && child !== null && "props" in child,
            ) as { props?: { children?: string; className?: string } } | undefined;
            const codeText =
              typeof codeEl?.props?.children === "string" ? codeEl.props.children.replace(/\n$/, "") : "";

            return (
              <div className="docs-code-block">
                {codeText && <CopyCodeButton code={codeText} />}
                <pre>{children}</pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="docs-table-wrap">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
