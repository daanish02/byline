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
      <div className="max-w-4xl mx-auto px-10 py-16 flex flex-col gap-12">

        <header className="flex flex-col gap-2 border-b border-border pb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Byline</h1>
          <p className="text-sm text-muted-foreground">Know your journalist before you pitch.</p>
        </header>

        <AnalysisForm onResult={handleResult} onError={handleError} />

        {state.status === "error" && <ErrorBanner message={state.message} />}

        {state.status === "results" && (
          <div className="flex flex-col gap-8">
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
