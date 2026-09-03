type Props = { score: number; scoreReasoning: string };

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

export function ScoreCard({ score, scoreReasoning }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Fit Score</h2>
      <p className={`text-4xl font-bold ${scoreColor(score)}`}>{score}/100</p>
      <p className="text-sm text-gray-700 leading-relaxed">{scoreReasoning}</p>
    </div>
  );
}
