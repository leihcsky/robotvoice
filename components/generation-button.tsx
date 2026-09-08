"use client";

export function GenerationButton({
  loading,
  disabled,
  label,
  hint,
}: {
  loading: boolean;
  disabled?: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? `Generating ${label}...` : `Generate ${label} voice`}
      </button>
      {hint ? (
        <p className="text-center text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
