function SoundWaves({
  color,
  strokeWidth = 2.35,
}: {
  color: string;
  strokeWidth?: number;
}) {
  return (
    <>
      <circle cx="9" cy="16" r="3.15" fill={color} />
      <path
        d="M15 10.55a7.5 7.5 0 0 1 0 10.9"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M19.35 7.15a11.9 11.9 0 0 1 0 17.7"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M23.55 4.15a15.9 15.9 0 0 1 0 23.7"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </>
  );
}

export function BrandMark({
  className,
  badge = true,
}: {
  className?: string;
  badge?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
      focusable="false"
    >
      {badge ? (
        <>
          <rect width="32" height="32" rx="9" fill="#0d8f7e" />
          <SoundWaves color="#f3f7fb" />
        </>
      ) : (
        <SoundWaves color="#0d8f7e" />
      )}
    </svg>
  );
}

export function VoiceWave({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 6"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d="M1 3c3.2-2.6 6.4-2.6 9.6 0s6.4 2.6 9.6 0 6.4-2.6 9.6 0 6.4 2.6 9.6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
