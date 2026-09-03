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
    <div className="rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <span className="text-sm font-semibold">Rewritten Pitch</span>
        <button
          onClick={copy}
          className="text-xs border border-input rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="p-5 flex-1">
        <div className="max-h-64 overflow-y-auto rounded-lg bg-muted/40 px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{rewrite}</p>
        </div>
      </div>
    </div>
  );
}
