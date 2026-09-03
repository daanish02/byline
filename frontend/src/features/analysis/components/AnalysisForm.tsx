"use client";

import { useState } from "react";
import type { AnalyzeResponse } from "@/features/analysis/schema";

type Props = {
  onResult: (result: AnalyzeResponse) => void;
  onError: (message: string) => void;
};

const inputCls =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:opacity-40 transition-all";

export function AnalysisForm({ onResult, onError }: Props) {
  const [journalist, setJournalist] = useState("");
  const [outlet, setOutlet] = useState("");
  const [pitch, setPitch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalist, outlet, pitch }),
      });
      const data = (await response.json()) as AnalyzeResponse & { error?: string };
      if (!response.ok) {
        onError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      onResult(data);
    } catch {
      onError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = journalist.trim() && outlet.trim() && pitch.trim() && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="journalist" className="text-xs text-muted-foreground tracking-widest uppercase">Journalist</label>
          <input id="journalist" type="text" value={journalist} onChange={(e) => setJournalist(e.target.value)} disabled={isLoading} required placeholder="Jane Smith" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="outlet" className="text-xs text-muted-foreground tracking-widest uppercase">Outlet</label>
          <input id="outlet" type="text" value={outlet} onChange={(e) => setOutlet(e.target.value)} disabled={isLoading} required placeholder="The Guardian" className={inputCls} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pitch" className="text-xs text-muted-foreground tracking-widest uppercase">Pitch</label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          disabled={isLoading}
          required
          rows={7}
          placeholder="Paste your pitch here…"
          className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring resize-y disabled:opacity-40 transition-all"
        />
      </div>

      <div className="flex items-center justify-between">
        {isLoading && <span className="text-xs text-muted-foreground animate-pulse">Researching journalist…</span>}
        <button
          type="submit"
          disabled={!canSubmit}
          className="ml-auto inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing
            </>
          ) : "Analyze →"}
        </button>
      </div>
    </form>
  );
}
