import type { FaqItem } from "@/lib/seo/pages";

export function PageFaq({
  heading,
  intro,
  faqs,
}: {
  heading: string;
  intro: string;
  faqs: readonly FaqItem[];
}) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="space-y-4">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
        {heading}
      </h2>
      <p className="text-muted">{intro}</p>
      <div className="space-y-4">
        {faqs.map((item) => (
          <article
            key={item.question}
            className="rounded-2xl border border-line bg-panel px-4 py-4"
          >
            <h3 className="text-base font-semibold">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
