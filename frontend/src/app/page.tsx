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
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Byline</h1>
            <span className="text-sm text-muted-foreground">Know your journalist before you pitch.</span>
          </div>
        </header>

        {/* Form */}
        <section className="rounded-xl border bg-card p-6 shadow-xs">
          <AnalysisForm onResult={handleResult} onError={handleError} />
        </section>

        {/* Error */}
        {state.status === "error" && <ErrorBanner message={state.message} />}

        {/* Results */}
        {state.status === "results" && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Analysis</span>
              <hr className="flex-1 border-border" />
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
          </section>
        )}

      </div>
    </main>
  );
}
