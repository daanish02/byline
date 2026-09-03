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
  | { status: "results"; data: AnalyzeResponse }
  | { status: "error"; message: string };

export default function HomePage() {
  const [state, setState] = useState<State>({ status: "idle" });

  function handleResult(data: AnalyzeResponse) {
    setState({ status: "results", data });
  }

  function handleError(message: string) {
    setState({ status: "error", message });
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-10">

        {/* Header */}
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm">✦</span>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-white to-indigo-300 bg-clip-text text-transparent">
              Byline
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Research any journalist in seconds. Get a personalised pitch score, rewrite, and opening line — powered by their actual coverage.
          </p>
        </header>

        {/* Form */}
        <div className="rounded-xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/30 p-6 backdrop-blur-sm">
          <AnalysisForm onResult={handleResult} onError={handleError} />
        </div>

        {/* Error */}
        {state.status === "error" && <ErrorBanner message={state.message} />}

        {/* Results */}
        {state.status === "results" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Analysis</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {state.data.lowConfidence && (
              <LowConfidenceWarning articleCount={state.data.articleCount} />
            )}

            <div className="grid grid-cols-2 gap-4">
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
