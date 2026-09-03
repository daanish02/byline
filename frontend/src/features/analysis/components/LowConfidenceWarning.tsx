type Props = { articleCount: number };

export function LowConfidenceWarning({ articleCount }: Props) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400">
      <span className="mt-px">⚠</span>
      <span>
        <strong>Low confidence</strong> — only {articleCount} article
        {articleCount === 1 ? "" : "s"} found for this journalist. Results may be less accurate.
      </span>
    </div>
  );
}
