"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { rewrite: string };

export function RewriteCard({ rewrite }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(rewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Rewritten Pitch
        </CardTitle>
        <button
          onClick={copy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto rounded bg-muted/40 px-3 py-2.5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{rewrite}</p>
        </div>
      </CardContent>
    </Card>
  );
}
