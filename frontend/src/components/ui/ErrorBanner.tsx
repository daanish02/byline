type Props = { message: string };

export function ErrorBanner({ message }: Props) {
  return (
    <div className="border border-red-300 bg-red-50 rounded-md px-4 py-3 text-sm text-red-800">
      <span className="font-semibold">Error:</span> {message}
    </div>
  );
}
