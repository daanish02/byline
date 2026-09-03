"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { profile: string };

export function CoverageCard({ profile }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(profile);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Coverage Profile
        </CardTitle>
        <button
          onClick={copy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{profile}</p>
      </CardContent>
    </Card>
  );
}
