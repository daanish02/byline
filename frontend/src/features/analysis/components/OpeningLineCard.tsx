type Props = { openingLine: string | null };

export function OpeningLineCard({ openingLine }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Opening Line</h2>
      {openingLine ? (
        <p className="text-sm text-gray-800 leading-relaxed italic">&ldquo;{openingLine}&rdquo;</p>
      ) : (
        <p className="text-sm text-gray-400 italic">
          No articles found — opening line unavailable.
        </p>
      )}
    </div>
  );
}
