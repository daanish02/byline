"use client";

import { useState } from "react";

type Props = { rewrite: string };

export function RewriteCard({ rewrite }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(rewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <span className="text-sm font-semibold">Rewritten Pitch</span>
        <button
          onClick={copy}
          className="text-xs border border-border rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="p-6 flex-1">
        <div className="max-h-96 overflow-y-auto rounded-lg bg-muted/40 px-4 py-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{rewrite}</p>
        </div>
      </div>
    </div>
  );
}
