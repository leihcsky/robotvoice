import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { isMonetizationEnabled } from "@/lib/flags";

export function SiteFooter() {
  const monetization = isMonetizationEnabled();
  return (
    <footer className="mt-auto border-t border-line bg-panel">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 text-sm text-muted sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md space-y-3">
          <BrandLogo />
          <p>
            Online robot voice generator. Type a script, generate a metallic
            voice, and save the audio for videos or prank clips.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <Link href="/" className="hover:text-foreground">
              Robot Voice Generator
            </Link>
            <Link
              href="/female-robot-voice-generator"
              className="hover:text-foreground"
            >
              Female
            </Link>
            <Link
              href="/creepy-robot-voice-generator"
              className="hover:text-foreground"
            >
              Creepy
            </Link>
            <Link href="/#faq" className="hover:text-foreground">
              FAQ
            </Link>
            {monetization ? (
              <Link href="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            ) : null}
          </nav>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
