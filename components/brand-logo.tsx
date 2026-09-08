import Link from "next/link";
import { BRAND_NAME } from "@/lib/seo";
import { BrandMark, VoiceWave } from "./brand-mark";

export function BrandLogo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={BRAND_NAME}
      className="flex items-center gap-2 text-foreground no-underline"
    >
      <BrandMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-muted">
          Robot
        </span>
        <span className="font-brand-voice mt-px text-[1.125rem] italic text-foreground">
          Voice
        </span>
        <VoiceWave className="mt-0.5 h-1.5 w-10 text-accent" />
        {compact ? null : (
          <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            robotvoice.org
          </span>
        )}
      </span>
    </Link>
  );
}
