import { BrandLogo } from "./brand-logo";
import Link from "next/link";
import { CreditBalance } from "./credit-balance";
import { isMonetizationEnabled } from "@/lib/flags";

export function SiteHeader() {
  const monetization = isMonetizationEnabled();
  const links = monetization
    ? [
        { href: "/", label: "Generator" },
        { href: "/pricing", label: "Pricing" },
        { href: "/dashboard", label: "Dashboard" },
      ]
    : [{ href: "/", label: "Generator" }];

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <BrandLogo compact />
        <nav className="flex items-center gap-6 text-sm text-muted">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {monetization ? <CreditBalance /> : null}
        </nav>
      </div>
    </header>
  );
}
