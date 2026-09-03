type Props = { rewrite: string };

export function RewriteCard({ rewrite }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Rewritten Pitch
      </h2>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{rewrite}</p>
    </div>
  );
}
