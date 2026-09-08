import Link from "next/link";
import { CreditBalance } from "@/components/credit-balance";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted">
        Generation history and credit usage. Payment and plan changes come later.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
            Credits
          </h2>
          <div className="mt-4">
            <CreditBalance />
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
            History
          </h2>
          <Link
            href="/dashboard/history"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Open my generations
          </Link>
        </section>
      </div>
    </div>
  );
}
