type Props = { score: number; scoreReasoning: string };

function scoreLabel(score: number): { label: string; color: string; bar: string } {
  if (score >= 70) return { label: "Strong fit", color: "text-emerald-600", bar: "bg-emerald-500" };
  if (score >= 45) return { label: "Partial fit", color: "text-amber-600", bar: "bg-amber-500" };
  return { label: "Poor fit", color: "text-red-500", bar: "bg-red-500" };
}

export function ScoreCard({ score, scoreReasoning }: Props) {
  const { label, color, bar } = scoreLabel(score);

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">Fit Score</span>
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-end gap-3">
          <span className={`text-6xl font-black tabular-nums leading-none ${color}`}>{score}</span>
          <div className="flex flex-col mb-1 gap-0.5">
            <span className="text-xs text-muted-foreground leading-none">/100</span>
            <span className={`text-sm font-semibold leading-none ${color}`}>{label}</span>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{scoreReasoning}</p>
      </div>
    </div>
  );
}
