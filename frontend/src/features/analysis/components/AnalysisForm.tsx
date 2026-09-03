"use client";

import { useState } from "react";
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="journalist" className="text-sm font-medium text-gray-700">
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
            className="border border-gray-300 rounded-md px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="outlet" className="text-sm font-medium text-gray-700">
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
            className="border border-gray-300 rounded-md px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pitch" className="text-sm font-medium text-gray-700">
          Your pitch
        </label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          disabled={isLoading}
          required
          rows={5}
          placeholder="Paste your pitch here..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm resize-y disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !journalist || !outlet || !pitch}
        className="self-end flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-40 hover:bg-gray-700 transition-colors"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing…
          </>
        ) : (
          "Analyze →"
        )}
      </button>
    </form>
  );
}
