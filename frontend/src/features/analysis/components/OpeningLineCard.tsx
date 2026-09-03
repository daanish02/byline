"use client";

import { useState } from "react";

type Props = { openingLine: string | null };

export function OpeningLineCard({ openingLine }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!openingLine) return;
    await navigator.clipboard.writeText(openingLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">Opening Line</span>
        {openingLine && (
          <button
            onClick={copy}
            className="text-xs border border-border rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        )}
      </div>
      <div className="p-5 flex-1">
        {openingLine ? (
          <blockquote className="border-l-2 border-primary pl-4 text-sm italic leading-relaxed text-muted-foreground">
            {openingLine}
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No articles found — opening line unavailable.
          </p>
        )}
      </div>
    </div>
  );
}
