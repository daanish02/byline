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
      <div className="max-w-2xl mx-auto px-8 py-20 flex flex-col gap-12">

        {/* Header */}
        <header className="flex flex-col gap-2 border-b border-white/10 pb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Byline</h1>
          <p className="text-sm text-muted-foreground">Know your journalist before you pitch.</p>
        </header>

        {/* Form */}
        <AnalysisForm onResult={handleResult} onError={handleError} />

        {/* Error */}
        {state.status === "error" && <ErrorBanner message={state.message} />}

        {/* Results */}
        {state.status === "results" && (
          <div className="flex flex-col gap-8">
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
