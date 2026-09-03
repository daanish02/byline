"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AnalyzeResponse } from "@/features/analysis/schema";

type Props = {
  onResult: (result: AnalyzeResponse) => void;
  onError: (message: string) => void;
};

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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="journalist" className="text-sm font-medium">
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
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="outlet" className="text-sm font-medium">
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
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pitch" className="text-sm font-medium">
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
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y disabled:opacity-50"
        />
      </div>

      <div className="flex items-center justify-between">
        {isLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">Researching journalist…</p>
        )}
        <Button type="submit" disabled={!canSubmit} className="ml-auto">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Analyzing
            </span>
          ) : (
            "Analyze →"
          )}
        </Button>
      </div>
    </form>
  );
}
