import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { score: number; scoreReasoning: string };

function scoreLabel(score: number): { label: string; color: string; bar: string } {
  if (score >= 70) return { label: "Strong fit", color: "text-emerald-600", bar: "bg-emerald-500" };
  if (score >= 45) return { label: "Partial fit", color: "text-amber-600", bar: "bg-amber-500" };
  return { label: "Poor fit", color: "text-red-500", bar: "bg-red-500" };
}

export function ScoreCard({ score, scoreReasoning }: Props) {
  const { label, color, bar } = scoreLabel(score);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Fit Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end gap-3">
          <span className={`text-5xl font-bold tabular-nums leading-none ${color}`}>{score}</span>
          <span className="text-lg text-muted-foreground mb-0.5">/100</span>
          <span className={`text-sm font-medium mb-1 ${color}`}>{label}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{scoreReasoning}</p>
      </CardContent>
    </Card>
  );
}
