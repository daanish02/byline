"use client";

import { useState } from "react";
import { AnalysisForm } from "@/features/analysis/components/AnalysisForm";
import { CoverageCard } from "@/features/analysis/components/CoverageCard";
import { ScoreCard } from "@/features/analysis/components/ScoreCard";
import { RewriteCard } from "@/features/analysis/components/RewriteCard";
import { OpeningLineCard } from "@/features/analysis/components/OpeningLineCard";
import { LowConfidenceWarning } from "@/features/analysis/components/LowConfidenceWarning";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import type { AnalyzeResponse } from "@/features/analysis/schema";

type State =
  | { status: "idle" }
  | { status: "results"; data: AnalyzeResponse; elapsedMs: number }
  | { status: "error"; message: string };

export default function HomePage() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [startTime, setStartTime] = useState<number | null>(null);

  function handleStart() {
    setStartTime(Date.now());
  }

  function handleResult(data: AnalyzeResponse) {
    const elapsedMs = startTime ? Date.now() - startTime : 0;
    setState({ status: "results", data, elapsedMs });
  }

  function handleError(message: string) {
    setState({ status: "error", message });
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-10 py-16 flex flex-col gap-12">

        <header className="flex flex-col gap-2 border-b border-border pb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Byline</h1>
          <p className="text-sm text-muted-foreground">Know your journalist before you pitch.</p>
        </header>

        <AnalysisForm onStart={handleStart} onResult={handleResult} onError={handleError} />

        {state.status === "error" && <ErrorBanner message={state.message} />}

        {state.status === "results" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Analysis</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {(state.elapsedMs / 1000).toFixed(1)}s
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            {state.data.lowConfidence && (
              <LowConfidenceWarning articleCount={state.data.articleCount} />
            )}

            <div className="grid grid-cols-2 gap-5">
              <CoverageCard profile={state.data.profile} />
              <ScoreCard score={state.data.score} scoreReasoning={state.data.scoreReasoning} />
              <RewriteCard rewrite={state.data.rewrite} />
              <OpeningLineCard openingLine={state.data.openingLine} />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
