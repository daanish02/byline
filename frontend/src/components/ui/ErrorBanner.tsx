type Props = { message: string };

export function ErrorBanner({ message }: Props) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <span className="mt-px">✕</span>
      <span>{message}</span>
    </div>
  );
}
