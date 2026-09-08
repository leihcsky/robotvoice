import type { Metadata } from "next";
import { isMonetizationEnabled } from "@/lib/flags";

const plans = [
  {
    name: "Free",
    price: "$0",
    detail: "500 credits once",
    note: "About 50,000 characters",
  },
  {
    name: "Creator",
    price: "$9.99",
    detail: "10,000 credits / month",
    note: "For regular robot lines",
  },
  {
    name: "Pro",
    price: "$19.99",
    detail: "30,000 credits / month",
    note: "For heavier production",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Plans for the robot voice generator. Start free, then add credits for more clips.",
  alternates: { canonical: "/pricing" },
  robots: isMonetizationEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-2 text-muted">
        Credits for the robot voice generator. 100 characters = 1 credit. Extra
        packs stay available after a monthly allotment runs out.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className="rounded-2xl border border-line bg-panel p-6"
          >
            <h2 className="text-lg font-medium">{plan.name}</h2>
            <p className="mt-3 text-3xl font-semibold text-accent">{plan.price}</p>
            <p className="mt-2 text-sm">{plan.detail}</p>
            <p className="mt-1 text-sm text-muted">{plan.note}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 rounded-2xl border border-dashed border-line px-4 py-5 text-sm text-muted">
        Buy 10,000 credits for $5. Payment via Creem lands in a later phase.
      </p>
    </div>
  );
}
