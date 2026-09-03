"use client";

import { useState } from "react";

type Props = { profile: string };

export function CoverageCard({ profile }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(profile);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <span className="text-sm font-semibold">Coverage Profile</span>
        <button
          onClick={copy}
          className="text-xs border border-input rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="p-5 flex-1">
        <p className="text-sm leading-relaxed text-muted-foreground">{profile}</p>
      </div>
    </div>
  );
}
