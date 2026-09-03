"use client";

import { useState } from "react";
import type { AnalyzeResponse } from "@/features/analysis/schema";

type Props = {
  onResult: (result: AnalyzeResponse) => void;
  onError: (message: string) => void;
};

const PRESETS = [
  {
    label: "Kelsey Piper · Vox",
    journalist: "Kelsey Piper",
    outlet: "Vox",
    pitch:
      "We built an AI tool that helps PR people personalize pitches to journalists in 30 seconds. It pulls the journalist's recent coverage, scores how well your pitch fits their beat, rewrites it to match their tone, and suggests a personalized opening line. We think it raises a genuine question about the future of media relations — does AI make pitching better or just noisier?",
  },
  {
    label: "Casey Newton · The Verge",
    journalist: "Casey Newton",
    outlet: "The Verge",
    pitch:
      "Our startup is launching a platform that lets creators sell access to their AI clone — a chatbot trained on their writing, voice, and personality. We've signed 50 creators in beta and are seeing 40% of fans prefer chatting with the AI over waiting for a reply from the real person. We'd love to discuss what this means for parasocial relationships and creator monetization.",
  },
  {
    label: "Julia Belluz · Vox",
    journalist: "Julia Belluz",
    outlet: "Vox",
    pitch:
      "A new peer-reviewed study we funded found that GLP-1 drugs reduce alcohol cravings by 38% in patients who weren't prescribed them for that purpose. We're a biotech working on the next generation of addiction treatments and think this warrants broader public attention. Our chief medical officer is available for comment.",
  },
  {
    label: "Cade Metz · NYT",
    journalist: "Cade Metz",
    outlet: "New York Times",
    pitch:
      "We're releasing research showing that the top five frontier AI labs have all quietly rolled back safety evaluations they publicly committed to in 2023. We tracked policy documents, hiring records, and internal job postings to build the case. Our lead researcher is available for an on-record interview and we have supporting documents we can share under embargo.",
  },
  {
    label: "Ryan Mac · NYT",
    journalist: "Ryan Mac",
    outlet: "New York Times",
    pitch:
      "We've documented 14 cases where Meta's content moderation contractors were instructed to approve political advertising that violated the platform's own stated policies — all in the six weeks before a national election. We have internal Slack messages and contractor testimonies. We're offering an exclusive before we publish independently.",
  },
] as const;

const inputCls =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:opacity-40 transition-all";

export function AnalysisForm({ onResult, onError }: Props) {
  const [journalist, setJournalist] = useState("");
  const [outlet, setOutlet] = useState("");
  const [pitch, setPitch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  function loadPreset(idx: number) {
    const p = PRESETS[idx];
    setJournalist(p.journalist);
    setOutlet(p.outlet);
    setPitch(p.pitch);
    setActivePreset(idx);
  }

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Try an example</span>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadPreset(i)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                activePreset === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="journalist" className="text-xs text-muted-foreground tracking-widest uppercase">Journalist</label>
          <input id="journalist" type="text" value={journalist} onChange={(e) => { setJournalist(e.target.value); setActivePreset(null); }} disabled={isLoading} required placeholder="Jane Smith" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="outlet" className="text-xs text-muted-foreground tracking-widest uppercase">Outlet</label>
          <input id="outlet" type="text" value={outlet} onChange={(e) => { setOutlet(e.target.value); setActivePreset(null); }} disabled={isLoading} required placeholder="The Guardian" className={inputCls} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pitch" className="text-xs text-muted-foreground tracking-widest uppercase">Pitch</label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => { setPitch(e.target.value); setActivePreset(null); }}
          disabled={isLoading}
          required
          rows={7}
          placeholder="Paste your pitch here…"
          className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring resize-y disabled:opacity-40 transition-all"
        />
      </div>

      <div className="flex items-center justify-between">
        {isLoading && <span className="text-xs text-muted-foreground animate-pulse">Researching journalist…</span>}
        <button
          type="submit"
          disabled={!canSubmit}
          className="ml-auto inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing
            </>
          ) : "Analyze →"}
        </button>
      </div>
    </form>
  );
}
