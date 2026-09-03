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
      <div className="max-w-4xl mx-auto px-6 py-14 flex flex-col gap-10">

        {/* Header */}
        <header>
          <h1 className="text-4xl font-black tracking-tight">Byline</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Know your journalist before you pitch.</p>
        </header>

        {/* Form */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <AnalysisForm onResult={handleResult} onError={handleError} />
        </div>

        {/* Error */}
        {state.status === "error" && <ErrorBanner message={state.message} />}

        {/* Results */}
        {state.status === "results" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Analysis</span>
              <div className="flex-1 border-t border-border" />
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
