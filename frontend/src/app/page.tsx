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
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Byline</h1>
          <p className="text-sm text-gray-500">Know your journalist before you pitch.</p>
        </header>

        <AnalysisForm onResult={handleResult} onError={handleError} />

        {state.status === "error" && <ErrorBanner message={state.message} />}

        {state.status === "results" && (
          <div className="flex flex-col gap-4">
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
