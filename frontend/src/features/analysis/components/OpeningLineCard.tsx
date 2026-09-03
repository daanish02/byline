"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Opening Line
        </CardTitle>
        {openingLine && (
          <button
            onClick={copy}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </CardHeader>
      <CardContent>
        {openingLine ? (
          <blockquote className="border-l-2 border-primary pl-3 text-sm italic leading-relaxed">
            {openingLine}
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No articles found — opening line unavailable.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
