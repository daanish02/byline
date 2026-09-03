type Props = { articleCount: number };

export function LowConfidenceWarning({ articleCount }: Props) {
  return (
    <div className="border border-yellow-300 bg-yellow-50 rounded-md px-4 py-3 text-sm text-yellow-800">
      <span className="font-semibold">Low confidence</span> — only {articleCount} article
      {articleCount === 1 ? "" : "s"} found for this journalist. Results may be less accurate.
    </div>
  );
}
