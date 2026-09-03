"use client";

import { useState } from "react";
import type { AnalyzeResponse } from "@/features/analysis/schema";

type Props = {
  onResult: (result: AnalyzeResponse) => void;
  onError: (message: string) => void;
};

const inputCls =
  "h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/60 focus-visible:border-indigo-500/40 disabled:opacity-50 transition-colors";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="journalist" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Journalist name
          </label>
          <input
            id="journalist"
            type="text"
            value={journalist}
            onChange={(e) => setJournalist(e.target.value)}
            disabled={isLoading}
            required
            placeholder="e.g. Jane Smith"
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="outlet" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Outlet
          </label>
          <input
            id="outlet"
            type="text"
            value={outlet}
            onChange={(e) => setOutlet(e.target.value)}
            disabled={isLoading}
            required
            placeholder="e.g. The Guardian"
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="pitch" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Your pitch
        </label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          disabled={isLoading}
          required
          rows={6}
          placeholder="Paste your pitch here…"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/60 focus-visible:border-indigo-500/40 resize-y disabled:opacity-50 transition-colors"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        {isLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">Researching journalist…</p>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyzing
            </>
          ) : (
            "Analyze →"
          )}
        </button>
      </div>
    </form>
  );
}
